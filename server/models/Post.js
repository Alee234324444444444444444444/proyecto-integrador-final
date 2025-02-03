const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Challenge = require('./Challenge');

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  photo: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.STRING(75),
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'post',
  timestamps: false
});

// Relación con User y Challenge
Post.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Post.belongsTo(Challenge, { foreignKey: 'challenge_id', onDelete: 'CASCADE' });

module.exports = Post;
