const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan'); // 로그 확인용
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks'); // 템플릿 엔진사용 
const dotenv = require('dotenv'); //.env 파일 읽는 모듈
const passport = require('passport');

dotenv.config();
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const showUserRouter = require('./routes/showUser');;
const { sequelize } = require('./models');
const passportConfig = require('./passport');

const app = express();
passportConfig(); 
app.set('port', process.env.PORT || 8002);
app.set('view engine', 'html');
nunjucks.configure('views', {
  express: app,
  watch: true,
});
sequelize.sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use(express.json()); //요청의 본문에 있는 데이터를 해석해서 req.body 객체로 만들어주는 미들웨어
app.use(express.urlencoded({ extended: false })); //요청의 본문에 있는 데이터를 해석해서 req.body 객체로 만들어주는 미들웨어
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', pageRouter);
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/showUser', showUserRouter);

app.use((req, res, next) => {
  const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});
