const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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
  type: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  image: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  config: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  challenge_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'challenge',
      key: 'id'
    }
  }
}, {
  tableName: 'reward',
  timestamps: false
});

module.exports = Reward;