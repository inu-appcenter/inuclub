module.exports = () => {
  const express = require('express');
  const timeout = require('connect-timeout');
  const path = require('path');
  const bodyParser = require('body-parser');
  const session = require('express-session');
  const connectRedis = require('connect-redis');
  const RedisStore = connectRedis(session);
  const db = require('./db');
  const helmet = require('helmet');
  const app = express();

  const key = require('../key.json');
  app.set('key', key);

  process.on('uncaughtException', (err) => {
    console.log('Caught exception: ' + err);
  });

  app.use(timeout('5s'));
  app.use(helmet());

  app.use('/club_img', express.static(path.join(__dirname, '../public/club_img')));
  app.use('/main_img', express.static(path.join(__dirname, '../public/main_img')));

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use(session({
    secret: app.get('key').secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 3600 * 1000
    },
    store: new RedisStore({
      host: app.get('key').host,
      port: app.get('key').redisPort,
      prefix : "session:",
      db : 0,
      logErrors: false })
  }));

  db.connect(key, (err) => {
    if(err){
      console.log('Unable to connect to DB.');
      process.exit(1);
    }
  });

  app.set('db', db.get());

  switch ( app.get('key').env ) {
    case 'development':
        // const ejs = require('ejs');
        // app.set('view engine', 'ejs');
        // app.set('views', path.join(__dirname,'../views'));
        app.use(require('morgan')('dev'));
        break;
    case 'production':
        /* production setting */
        break;
    default :
        app.use(require('morgan')('dev'));
        console.log('Development environment setup required');
        break;
  }

  return app;
};
