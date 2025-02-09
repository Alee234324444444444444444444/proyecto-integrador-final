const sequelize = require('../config/database');
const User = require('./User');
const Superuser = require('./Superuser');
const Challenge = require('./Challenge');
const Reward = require('./Reward');
const Character = require('./Character');
const CharacterReward = require('./CharacterReward');
const Post = require('./Post');
const Comment = require('./Comment');
const Audit = require('./Audit');

// Relaciones básicas
Comment.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Comment.hasMany(Comment, { as: 'replies', foreignKey: 'parent_id' });

// Relaciones de Challenge y Reward
Challenge.hasOne(Reward, { foreignKey: 'challenge_id' });
Reward.belongsTo(Challenge, { foreignKey: 'challenge_id' });
Challenge.belongsTo(Superuser, { foreignKey: 'superuser_id' });

// Relaciones de Character
Character.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });

// Relaciones entre Character y Reward a través de CharacterReward
Character.belongsToMany(Reward, { 
  through: CharacterReward,
  foreignKey: 'character_id',
  onDelete: 'CASCADE'
});

Reward.belongsToMany(Character, { 
  through: CharacterReward,
  foreignKey: 'reward_id',
  onDelete: 'CASCADE'
});

// Relación explícita para CharacterReward
CharacterReward.belongsTo(Character, { foreignKey: 'character_id' });
CharacterReward.belongsTo(Reward, { foreignKey: 'reward_id' });

// Relaciones de Post
Post.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Post.belongsTo(Challenge, { foreignKey: 'challenge_id', onDelete: 'CASCADE' });

module.exports = {
  sequelize,
  User,
  Superuser,
  Challenge,
  Reward,
  Character,
  CharacterReward,
  Post,
  Comment,
  Audit
};