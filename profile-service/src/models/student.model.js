const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Student = sequelize.define('Student', {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  studyLevel: { type: DataTypes.STRING, allowNull: false },
  universityName: { type: DataTypes.STRING, allowNull: false },
}, {
  tableName: 'students',
  timestamps: true,
});

module.exports = Student;
