const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User, Question } = require('../models');

const router = express.Router();

router.get('/show_user', isLoggedIn, async (req, res, next) => {
    try {
      const user_id = parseInt(res.locals.user.id);
      const posts = await Post.findAll({
        include: [{
          model: User,
          attributes: ['id', 'nick'],
        },
        {
          model: Question,
          attributes: ['id', 'content'],
        }],
        where: { UserId: user_id },
        order: [['createdAt', 'DESC']],
      });
      res.render('showUser', {
        title: 'Haru Han Jogak',
        twits: posts,        
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

  router.post("/delete", isLoggedIn, async (req, res, next) => {
    try {
      const post = await Post.findOne({ where: { id: req.body.id } });
      if (post) {
        const result2 = await Post.destroy({
          where: { id: req.body.id },
        });
        if (result2 == 1) res.send("success");
        else res.status(404).send("no twit");
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  });

  module.exports = router;