import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelizeConfig.js';

class AccommodationInventory extends Model {}

AccommodationInventory.init({
  accommodation_type: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  rooms: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  beds: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'AccommodationInventory',
  tableName: 'accommodation_inventory',
  timestamps: false
});

export default AccommodationInventory;
