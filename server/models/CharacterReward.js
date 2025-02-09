const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CharacterReward = sequelize.define('CharacterReward', {}, {
  tableName: 'character_reward',
  timestamps: false
});

module.exports = CharacterReward;
