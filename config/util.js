//------------------권한 체크------------------
exports.checkPermission = (req, res, next) => {
  const db = req.app.get('db');
  let userId = req.session.userId;
  clubnum = req.params.clubnum;
  eventnum = req.params.eventnum;

  if (!userId) return res.sendStatus(401);

  if (clubnum) { //동아리 내용수정 및 사진수정 루트 접근 : 동아리번호(num)와 세션id 검사
    let sql = 'SELECT EXISTS (SELECT num FROM club_authority WHERE num = ? AND authId = ?) AS success';

    db.query(sql, [clubnum, userId], (err, rows) => {
      if (err) {
        console.log(`util.js err1 : userId=${userId} / clubnum=${clubnum} / rows=${rows} / err=${err}`);
        res.sendStatus(400);
      } else if (rows[0].success) {
        next();
      } else {
        return res.sendStatus(403);
      }
    });

  } else if (eventnum) { //행사 관련 수정,삭제 루트 접근 : 이벤트번호(eventnum)와 세션id 검사 
    let sql = 'select authId from club_authority where clubname = (select clubname from club_event where eventnum = ?)';

    db.query(sql, [eventnum, userId], (err, rows) => {
      if (err || !rows.length) {
        console.log(`util.js err2 : userId=${userId} / eventnum=${eventnum} / rows=${rows} / err=${err}`);
        res.sendStatus(400);
      } else if (rows[0].authId === userId) {
        next();
      } else {
        return res.sendStatus(403);
      }
    });

  } else {
    console.log('util.js err3');
    return res.sendStatus(400);
  }
};