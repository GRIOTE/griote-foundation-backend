const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Independent = sequelize.define('Independent', {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  yearsExperience: { type: DataTypes.INTEGER, allowNull: true },
}, {
  tableName: 'independents',
  timestamps: true,
});

module.exports = Independent;
