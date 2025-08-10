const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Profile = sequelize.define('Profile', {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  phoneNumber: { type: DataTypes.STRING, allowNull: true },
  country: { type: DataTypes.STRING, allowNull: true },
  city: { type: DataTypes.STRING, allowNull: true },
  birthDate: { type: DataTypes.DATEONLY, allowNull: true },
  avatarUrl: { type: DataTypes.STRING, allowNull: true },
  bio: { type: DataTypes.TEXT, allowNull: true },
  linkedinUrl: { type: DataTypes.STRING, allowNull: true },
  youtubeUrl: { type: DataTypes.STRING, allowNull: true },
  personalWebsite: { type: DataTypes.STRING, allowNull: true },
}, {
  tableName: 'profiles',
  timestamps: true,
});

module.exports = Profile;
