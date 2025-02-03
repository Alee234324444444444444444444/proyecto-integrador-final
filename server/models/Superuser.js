const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Superuser = sequelize.define('Superuser', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  username: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING(355),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'superuser', // Relación con la tabla 'superuser' en PostgreSQL
  timestamps: false
});

module.exports = Superuser;
