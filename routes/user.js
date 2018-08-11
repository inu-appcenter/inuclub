const route = require('express').Router();

//------------------login------------------
route.post('/login', (req, res) => {
  const db = req.app.get('db');
  let userId = req.body.id,
      userpw = req.body.pw;

  let sql = 'SELECT * FROM club_authority WHERE authId = ?';
  db.query(sql, userId, (err, rows) => {

    if (err || !rows.length) {

      console.log(`user.js err : id=${userId} err=${err}`);
      res.sendStatus(460);

    } else if (userpw === rows[0].password) {
      
      req.session.userId = userId;
      console.log(`${req.session.userId} 로그인`);
      res.status(201).send('' + rows[0].num);

    } else {
      res.sendStatus(460);
    }
  });
});

//------------------logout------------------
route.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.sendStatus(200);
  });
});

module.exports = route;
