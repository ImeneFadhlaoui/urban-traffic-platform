const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Incident = sequelize.define('Incident', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  title: { type: DataTypes.STRING(150), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },

  type: {
    type: DataTypes.ENUM('ACCIDENT', 'TRAVAUX', 'ROUTE_FERMEE', 'EMBOUTEILLAGE'),
    allowNull: false
  },

  status: {
    type: DataTypes.ENUM('SIGNALÉ', 'EN_COURS', 'RÉSOLU'),
    defaultValue: 'SIGNALÉ'
  },

  latitude: { type: DataTypes.DECIMAL(10, 8), allowNull: true },
  longitude: { type: DataTypes.DECIMAL(11, 8), allowNull: true },
  location: { type: DataTypes.STRING(200), allowNull: true },

  reportedBy: { type: DataTypes.INTEGER, allowNull: false },
  reportedByName: { type: DataTypes.STRING(100), allowNull: true },

  resolvedAt: { type: DataTypes.DATE, allowNull: true }

}, { tableName: 'incidents', timestamps: true });

module.exports = Incident;