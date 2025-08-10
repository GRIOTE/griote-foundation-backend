const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  profileType: { type: DataTypes.ENUM('Student','Teacher','Independent'), allowNull: false },
  isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  tableName: 'users',
  timestamps: true,
});

module.exports = User;
