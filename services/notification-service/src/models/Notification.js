const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Notification = sequelize.define('Notification', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  title: { type: DataTypes.STRING(150), allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },

  type: {
    type: DataTypes.ENUM('INFO', 'WARNING', 'ALERT'),
    defaultValue: 'INFO'
  },

  // À quel utilisateur cette notification est destinée (null = broadcast)
  userId: { type: DataTypes.INTEGER, allowNull: true },

  isRead: { type: DataTypes.BOOLEAN, defaultValue: false },

}, { tableName: 'notifications', timestamps: true });

module.exports = Notification;