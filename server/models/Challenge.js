const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Superuser = require('./Superuser');

const Challenge = sequelize.define('Challenge', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING(10),
    allowNull: false,
    validate: {
      isIn: [['daily', 'weekly']]
    }
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  due_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  reward_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'reward',
      key: 'id'
    }
  }
}, {
  tableName: 'challenge',
  timestamps: false
});

// Relación con Superuser
Challenge.belongsTo(Superuser, { foreignKey: 'superuser_id', onDelete: 'SET NULL' });

module.exports = Challenge;