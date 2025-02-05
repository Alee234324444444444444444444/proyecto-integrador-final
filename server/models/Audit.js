const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Audit = sequelize.define('Audit', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Entity: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  Event: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  NewSyntax: {
    type: DataTypes.STRING(1000),
    allowNull: true
  },
  OldSyntax: {
    type: DataTypes.STRING(1000),
    allowNull: true
  },
  Users: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  RecordDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Audits',
  timestamps: false
});

module.exports = Audit;
