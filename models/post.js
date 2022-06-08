const Sequelize = require('sequelize');

module.exports = class Post extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      content: {
        type: Sequelize.STRING(140),
        allowNull: false,
      },
      img: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      likeCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Post',
      tableName: 'posts',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }

  static associate(db) {
    db.Post.belongsTo(db.User);
    db.Post.belongsTo(db.Question);
    db.Post.belongsToMany(db.User, { through: "PostLikes", as: "Likes" });
  }
};
