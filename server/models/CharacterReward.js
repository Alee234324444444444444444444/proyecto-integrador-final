const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Character = require('./Character');
const Reward = require('./Reward');

const CharacterReward = sequelize.define('CharacterReward', {}, {
  tableName: 'character_reward',
  timestamps: false
});

// Relaciones entre Character y Reward
Character.belongsToMany(Reward, { through: CharacterReward, foreignKey: 'character_id', onDelete: 'CASCADE' });
Reward.belongsToMany(Character, { through: CharacterReward, foreignKey: 'reward_id', onDelete: 'CASCADE' });

module.exports = CharacterReward;
