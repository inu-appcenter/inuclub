//---------------해당 날짜 일정 목록 ( temp )--------------- 이거 말고 달 단위로 날짜만....
exports.total = (req, res) => {

  const db = req.app.get('db');
  let sql = 'SELECT * FROM club_event ORDER BY date';

  db.query(sql, (err, rows) => {
    if(err) {
      console.log('getEvent.js err: [' + req.originalUrl + '] ' + err);
      return res.sendStatus(400);
    }
    res.status(200).json(rows);
  });
};

//---------------해당 날짜 일정 목록---------------
exports.list = (req, res) => {

  const db = req.app.get('db');
  let date = req.params.date;
      pattern = /^(20\d{2})-(0[0-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;

  //날짜 유효성 검사
  if(pattern.test(date)) {

    let sql = 'SELECT * FROM club_event WHERE date = ? ORDER BY time';

    db.query(sql, date, (err, rows) => {
      if(err) {
        console.log('getEvent.js err: [' + req.originalUrl + '] ' + err);
        return res.sendStatus(400);
      }
      res.status(200).json(rows);
    });
    
  } else {
      res.sendStatus(465);
  }
};
