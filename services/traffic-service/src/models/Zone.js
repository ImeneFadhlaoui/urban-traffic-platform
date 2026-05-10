const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Zone = sequelize.define('Zone', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  name: { type: DataTypes.STRING(100), allowNull: false },

  // Coordonnées du centre de la zone
  centerLat: { type: DataTypes.DECIMAL(10, 8), allowNull: false },
  centerLng: { type: DataTypes.DECIMAL(11, 8), allowNull: false },

  radius: { type: DataTypes.INTEGER, defaultValue: 500 },

  vehicleCount: { type: DataTypes.INTEGER, defaultValue: 0 },

  // Calculé automatiquement selon vehicleCount
  // FAIBLE < 10 véhicules / MOYEN 10-30 / ÉLEVÉ > 30
  densityLevel: {
    type: DataTypes.ENUM('FAIBLE', 'MOYEN', 'ÉLEVÉ'),
    defaultValue: 'FAIBLE'
  },

  isActive: { type: DataTypes.BOOLEAN, defaultValue: true }

}, { tableName: 'zones', timestamps: true });

module.exports = Zone;