module.exports = function(){
  const express = require('express');
  const timeout = require('connect-timeout');
  const path = require('path');
  const favicon = require('serve-favicon');
  const ejs = require('ejs');
  const bodyParser = require('body-parser');
  const session = require('express-session');
  const db = require('./db');
  const helmet = require('helmet');
  const morgan = require('morgan');

  const log = require('./log');
  const key = require('../key.json');
  const app = express();

  process.on('uncaughtException', function (err) {
    log.logger().error(err);
    console.log('Caught exception: ' + err);
  });

  app.use(timeout('5s'));

  //  public/폴더명 생성하기
  app.use('/club_img', express.static(path.join(__dirname, '../public/club_img')));
  app.use('/main_img', express.static(path.join(__dirname, '../public/main_img')));
  app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname,'../views'));

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use(session({
    secret: key.secret,
    resave: false,
    saveUninitialized: true
  }));

  db.connect(function(err){
    if(err){
      log.logger().error('Unable to connect to DB: ' + err);
      console.log('Unable to connect to DB.');
      process.exit(1);
    }
  });

  app.use(helmet());
  app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :response-time ms "\\n:user-agent"'));

  return app;
};
