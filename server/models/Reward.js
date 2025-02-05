const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Challenge = require('./Challenge');

const Reward = sequelize.define('Reward', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  image: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'reward',
  timestamps: false
});

// Relación con Challenge
Reward.belongsTo(Challenge, { foreignKey: 'challenge_id', onDelete: 'CASCADE' });

module.exports = Reward;

