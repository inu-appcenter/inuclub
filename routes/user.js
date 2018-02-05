module.exports = function(){
  const route = require('express').Router();
  const db = require('../config/db');

  route.post('/login', function(req, res, next){
    var userId = req.body.id;
    var userpw = req.body.id;

    if(userId.length > 20 || userpw > 20) return res.status(400).send('너무 길게 입력하셨습니다.');

    var sql = 'SELECT num FROM club_authority WHERE authId = ? AND password = ?;';
    db.get().query(sql, [userId, userpw], function(err, rows){
      if(err) next(err);
      else if(rows.length > 0){
        req.session.userId = userId;
        res.status(200).send('' + rows[0].num);
      } else {
        res.status(400).send('아이디 또는 비밀번호가 틀렸습니다.');
      }
    });
  });

  route.get('/logout', function (req, res) {
    req.session.destroy(function(err){
      if(err) return next(err);
      req.session;
      res.status(200).send('로그아웃 되었습니다.');
    });
  });

  return route;
};
