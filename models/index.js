const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const User = require('./user');
const Post = require('./post');
const Question = require('./question'); 

const db = {};
const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.User = User;
db.Post = Post;
db.Question = Question;

User.init(sequelize);
Post.init(sequelize);
Question.init(sequelize);

User.associate(db);
Post.associate(db);
Question.associate(db);

module.exports = db;
