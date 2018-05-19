const route = require('express').Router();
const db = require('../config/db');
const log = require('../config/log');

//------------------login------------------
route.post('/login', function(req, res){
  let userId = req.body.id;
  let userpw = req.body.pw;
  
  let sql = 'SELECT * FROM club_authority WHERE authId = ?;';
  db.get().query(sql, [userId, userpw], function(err, rows){
    if(err) {
      log.logger().warn('user: ' +  req.session.userId + ' 로그인 err: ' + err);
      res.sendStatus(460);
    }
    else if(rows.length > 0 && userpw === rows[0].password){
      req.session.userId = userId;
      log.logger().info('user: ' +  req.session.userId + ' 로그인');
      res.status(201).send('' + rows[0].num);
    } else {
      res.sendStatus(460);
    }
  });
});

//------------------logout------------------
route.get('/logout', function (req, res) {
  req.session.destroy(function(err){
    if(err) return next(err);
    req.session;
    res.sendStatus(200);
  });
});

module.exports = route;
