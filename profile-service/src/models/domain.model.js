const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Domain = sequelize.define('Domain', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
}, {
  tableName: 'domains',
  timestamps: false,
});

module.exports = Domain;
