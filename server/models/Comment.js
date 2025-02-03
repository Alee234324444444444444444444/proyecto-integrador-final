const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'comment',
  timestamps: false
});

// Relación con User
Comment.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });

module.exports = Comment;
