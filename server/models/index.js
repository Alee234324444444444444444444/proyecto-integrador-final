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