const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Vehicle = sequelize.define('Vehicle', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  
  plate: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true  
  },
  type: {
    type: DataTypes.ENUM('CAR', 'TRUCK', 'BUS', 'MOTORCYCLE'),
    allowNull: false
  },
  brand: { type: DataTypes.STRING(50), allowNull: false },
  model: { type: DataTypes.STRING(50), allowNull: false },
  
  // Position actuelle du véhicule
  currentLat: { type: DataTypes.DECIMAL(10, 8), defaultValue: null },
  currentLng: { type: DataTypes.DECIMAL(11, 8), defaultValue: null },
  
  status: {
    type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'MAINTENANCE'),
    defaultValue: 'ACTIVE'
  },
  createdBy: { type: DataTypes.INTEGER, allowNull: false }

}, { tableName: 'vehicles', timestamps: true });

module.exports = Vehicle;