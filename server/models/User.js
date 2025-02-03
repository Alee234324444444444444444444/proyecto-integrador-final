const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  username: {
    type: DataTypes.STRING(200),
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING(355),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(250),
    allowNull: false
  }
}, {
  tableName: 'users', // Relación con la tabla 'users' en PostgreSQL
  timestamps: false   // Si no usas createdAt o updatedAt
});

module.exports = User;
