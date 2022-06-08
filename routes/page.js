const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User, Question } = require('../models');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.likes = req.user ? req.user.Likes.map((p) => p.id) : [];
  next();
});

router.get('/', (req, res) => {
  res.render('home', { title: 'Haru Han Jogak' });
});

router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile', { title: 'Haru Han Jogak' });
});

router.get('/login', isNotLoggedIn, (req, res) => {
  res.render('login', { title: 'Haru Han Jogak' });
});

router.get('/join', isNotLoggedIn, (req, res) => {
  res.render('join', { title: 'Haru Han Jogak' });
});

router.get('/write', isLoggedIn, async (req, res) => {

  try {
    //오늘날짜
    let day = Math.floor(Date.now() / 1000 / (60 * 60 * 24));

    //질문가지고 오기
    const question = await Question.findOne({ where: { id: day } });

    //글가지고 오기
    const post = await Post.findOne({
      include: [{
        model: User,
        attributes: ['id', 'nick'],
      },
      {
        model: Question,
        attributes: ['id', 'content'],
      }],
      where: { QuestionId: day, UserId : req.user.id },
      order: [['createdAt', 'DESC']],
    });

    res.render('write', {
      title: 'Haru Han Jogak',
      question: question,
      post : post
    });

  } catch (err) {
    console.error(err);
    next(err);
  }

});

router.get('/show_all', async (req, res, next) => {
  try {
    
    //오늘날짜
    let day = Math.floor(Date.now() / 1000 / (60 * 60 * 24));

    //질문가지고 오기
    const question = await Question.findOne({ where: { id : day } });

    //글가지고 오기
    const posts = await Post.findAll({
      include: [{
        model: User,
        attributes: ['id', 'nick'],
      },
      {
        model: Question,
        attributes: ['id', 'content'],
      }],
      
      where: { QuestionId: day },
      order: [['createdAt', 'DESC']],
    });

    res.render('showAll', {
      title: 'Haru Han Jogak',
      twits: posts,
      question : question
    });

  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post('/profile', isLoggedIn, async (req, res, next) => {
  try {
    await User.update({ nick: req.body.edit }, { where: { id: req.user.id } })
    res.redirect('/profile')
  } catch (error) {
    console.error(error)
    next(error)
  }
})

module.exports = router;