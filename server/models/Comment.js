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
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  parent_id: {  // Para manejar respuestas a comentarios
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'comment', // Se autoreferencia
      key: 'id'
    }
  }
}, {
  tableName: 'comment',
  timestamps: false
});

// Relación con User
Comment.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
// Relación para respuestas
Comment.hasMany(Comment, { as: 'replies', foreignKey: 'parent_id' });

module.exports = Comment;
