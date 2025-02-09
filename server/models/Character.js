const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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

module.exports = Character;
