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
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  approved_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'superuser',
      key: 'id'
    }
  }
}, {
  tableName: 'post',
  timestamps: false
});

Post.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Post.belongsTo(Challenge, { foreignKey: 'challenge_id', onDelete: 'CASCADE' });

module.exports = Post;