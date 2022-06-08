const passport = require('passport');
const local = require('./localStrategy');
const { User, Post } = require("../models");


module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findOne({
      where: { id },
      include: [
        {
          model: Post,
          attributes: ["id"],
          as: "Likes",
        },
      ],
    })
      .then(user => done(null, user))
      .catch(err => done(err));
  });

  local();
};
