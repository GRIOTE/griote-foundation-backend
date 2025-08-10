const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Teacher = sequelize.define('Teacher', {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  institutionName: { type: DataTypes.STRING, allowNull: false },
  academicTitle: { type: DataTypes.STRING, allowNull: false },
  yearsExperience: { type: DataTypes.INTEGER, allowNull: true },
}, {
  tableName: 'teachers',
  timestamps: true,
});

module.exports = Teacher;
