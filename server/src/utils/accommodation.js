export const ACCOMMODATION_OPTIONS = {
  four_fan: {
    label: '4 in 1 with fan',
    price: 970,
    capacityTracked: false
  },
  fan: {
    label: '2 in 1 with fan',
    price: 1350,
    capacityTracked: true,
    rooms: 680,
    beds: 1360
  },
  aircon: {
    label: '2 in 1 with air conditioning',
    price: 1500,
    capacityTracked: true,
    rooms: 132,
    beds: 264
  }
};

export const DEFAULT_ACCOMMODATION_TYPE = 'four_fan';

export const normalizeAccommodationType = (type) => {
  const normalizedType = String(type || '').trim().toLowerCase();
  return Object.prototype.hasOwnProperty.call(ACCOMMODATION_OPTIONS, normalizedType) ? normalizedType : null;
};

export const getAccommodationFee = (type = DEFAULT_ACCOMMODATION_TYPE) => {
  const normalizedType = normalizeAccommodationType(type);
  return normalizedType ? ACCOMMODATION_OPTIONS[normalizedType].price : null;
};

export const isAccommodationCapacityTracked = (type) => {
  const normalizedType = normalizeAccommodationType(type);
  return normalizedType ? ACCOMMODATION_OPTIONS[normalizedType].capacityTracked : false;
};

export const calculateAccommodationAvailability = (occupiedBeds = {}) => (
  Object.entries(ACCOMMODATION_OPTIONS).reduce((availability, [type, option]) => {
    const occupied = Math.max(0, Number(occupiedBeds[type]) || 0);
    const occupiedRooms = option.capacityTracked
      ? Math.min(option.rooms, Math.ceil(occupied / 2))
      : null;
    availability[type] = {
      label: option.label,
      price: option.price,
      capacityTracked: option.capacityTracked,
      rooms: option.rooms,
      beds: option.beds,
      occupiedRooms,
      occupiedBeds: occupied,
      remainingRooms: option.capacityTracked ? Math.max(0, option.rooms - occupiedRooms) : null,
      remainingBeds: option.capacityTracked ? Math.max(0, option.beds - occupied) : null
    };
    return availability;
  }, {})
);
