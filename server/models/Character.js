const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Character = sequelize.define('Character', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  tableName: 'character',
  timestamps: false
});

// Relación con User
Character.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });

module.exports = Character;
