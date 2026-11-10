import sequelize from '../config/sequelizeConfig.js';
import AccommodationInventory from '../models/AccommodationInventory.js';
import Registration from '../models/Registration.js';
import {
  calculateAccommodationAvailability,
  isAccommodationCapacityTracked,
  normalizeAccommodationType
} from './accommodation.js';

export class AccommodationUnavailableError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AccommodationUnavailableError';
  }
}

export const getAccommodationAvailability = async () => {
  const [inventory, paidRegistrations] = await Promise.all([
    AccommodationInventory.findAll({ raw: true }),
    Registration.findAll({
      attributes: ['accommodation_type'],
      where: { payment_status: 'paid' },
      raw: true
    })
  ]);
  const occupiedBeds = paidRegistrations.reduce((counts, registration) => {
    const type = normalizeAccommodationType(registration.accommodation_type);
    if (type) counts[type] = (counts[type] || 0) + 1;
    return counts;
  }, {});
  const availability = calculateAccommodationAvailability(occupiedBeds);

  for (const option of inventory) {
    if (!isAccommodationCapacityTracked(option.accommodation_type)) continue;

    if (availability[option.accommodation_type]) {
      availability[option.accommodation_type].rooms = option.rooms;
      availability[option.accommodation_type].beds = option.beds;
      availability[option.accommodation_type].remainingRooms = Math.max(
        0,
        option.rooms - availability[option.accommodation_type].occupiedRooms
      );
      availability[option.accommodation_type].remainingBeds = Math.max(
        0,
        option.beds - availability[option.accommodation_type].occupiedBeds
      );
    }
  }

  return availability;
};

export const markRegistrationAsPaid = async (registrationCode, paymentMethod) => (
  sequelize.transaction(async (transaction) => {
    const registration = await Registration.findOne({
      where: { registration_code: registrationCode },
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    if (!registration) {
      throw new Error('Registration not found');
    }

    if (registration.payment_status === 'paid') {
      return registration;
    }

    const accommodationType = normalizeAccommodationType(registration.accommodation_type);
    if (!accommodationType) {
      throw new AccommodationUnavailableError('Registration has no valid accommodation choice');
    }

    if (isAccommodationCapacityTracked(accommodationType)) {
      const inventory = await AccommodationInventory.findByPk(accommodationType, {
        transaction,
        lock: transaction.LOCK.UPDATE
      });

      if (!inventory) {
        throw new Error(`Accommodation inventory is not configured for ${accommodationType}`);
      }

      const occupiedBeds = await Registration.count({
        where: {
          accommodation_type: accommodationType,
          payment_status: 'paid'
        },
        transaction
      });

      if (occupiedBeds >= inventory.beds) {
        throw new AccommodationUnavailableError('This accommodation option is fully booked');
      }
    }

    await registration.update({
      payment_status: 'paid',
      ...(paymentMethod ? { payment_method: paymentMethod } : {})
    }, { transaction });

    return registration;
  })
);
