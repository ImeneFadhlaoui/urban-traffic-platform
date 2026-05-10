const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');
const Vehicle = require('./Vehicle');

// Chaque enregistrement = une position à un moment donné
const GpsPosition = sequelize.define('GpsPosition', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  
  vehicleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Vehicle, key: 'id' }
  },
  latitude: { type: DataTypes.DECIMAL(10, 8), allowNull: false },
  longitude: { type: DataTypes.DECIMAL(11, 8), allowNull: false },
  speed: {
    type: DataTypes.FLOAT,
    defaultValue: 0  
  },
  recordedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW  
  }

}, { tableName: 'gps_positions', timestamps: false });

Vehicle.hasMany(GpsPosition, { foreignKey: 'vehicleId', as: 'positions' });
GpsPosition.belongsTo(Vehicle, { foreignKey: 'vehicleId', as: 'vehicle' });

module.exports = GpsPosition;