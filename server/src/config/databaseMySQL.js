import { DataTypes } from 'sequelize';
import { Registration, Payment, PaymentInitialization, AccommodationInventory } from '../models/index.js';
import sequelize from './sequelizeConfig.js';
import {
  ACCOMMODATION_OPTIONS,
  DEFAULT_ACCOMMODATION_TYPE
} from '../utils/accommodation.js';

// Initialize database connection
export const initializeDatabase = async () => {
  try {
    // Test the connection
    await sequelize.authenticate();
    console.log('Connection to Aiven MySQL has been established successfully.');
    
    // Sync new tables, then apply additive columns to existing registration tables.
    await sequelize.sync();
    const registrationColumns = await sequelize.getQueryInterface().describeTable('registrations');
    if (!registrationColumns.accommodation_type) {
      await sequelize.getQueryInterface().addColumn('registrations', 'accommodation_type', {
        type: DataTypes.STRING,
        allowNull: true
      });
    }
    if (!registrationColumns.registration_amount) {
      await sequelize.getQueryInterface().addColumn('registrations', 'registration_amount', {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
      });
    }

    await sequelize.query(`
      UPDATE registrations
      SET accommodation_type = :accommodationType,
          registration_amount = CASE
            WHEN payment_status = 'paid' THEN registration_amount
            ELSE :registrationAmount
          END
      WHERE accommodation_type IS NULL OR TRIM(accommodation_type) = ''
    `, {
      replacements: {
        accommodationType: DEFAULT_ACCOMMODATION_TYPE,
        registrationAmount: ACCOMMODATION_OPTIONS[DEFAULT_ACCOMMODATION_TYPE].price
      }
    });

    for (const [accommodationType, option] of Object.entries(ACCOMMODATION_OPTIONS)) {
      if (!option.capacityTracked) continue;

      await AccommodationInventory.findOrCreate({
        where: { accommodation_type: accommodationType },
        defaults: {
          rooms: option.rooms,
          beds: option.beds
        }
      });
    }
    console.log('Database models synchronized');
    
    return true;
  } catch (error) {
    console.error('Unable to connect to Aiven MySQL:', error);
    throw error;
  }
};

// Helper functions to work with the database
export const runQuery = async (query, params = {}) => {
  try {
    const result = await sequelize.query(query, {
      replacements: params,
      type: sequelize.QueryTypes.UPDATE
    });
    return { id: result[0], changes: result[1] };
  } catch (error) {
    console.error('Error running query:', error);
    throw error;
  }
};

export const getQuery = async (query, params = {}) => {
  try {
    const [result] = await sequelize.query(query, {
      replacements: params,
      type: sequelize.QueryTypes.SELECT
    });
    return result;
  } catch (error) {
    console.error('Error getting query:', error);
    throw error;
  }
};

export const getAllQuery = async (query, params = {}) => {
  try {
    const results = await sequelize.query(query, {
      replacements: params,
      type: sequelize.QueryTypes.SELECT
    });
    return results;
  } catch (error) {
    console.error('Error getting all query:', error);
    throw error;
  }
};

// Export models
export { Registration, Payment, PaymentInitialization, AccommodationInventory };
