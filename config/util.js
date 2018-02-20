const db = require('./db');

//------------------권한 체크------------------
exports.checkPermission = function (req, res, next){
  let userId = req.session.userId;
      clubnum = req.params.clubnum;
      eventnum = req.params.eventnum;

  if(!userId) return res.sendStatus(401);

  if(clubnum){    //동아리 내용수정 및 사진수정 루트 접근시
    let sql = 'SELECT EXISTS (SELECT num FROM club_authority WHERE num = ? AND authId = ?) AS success;';
    db.get().query(sql, [clubnum, userId], function(err, rows){
      if(err) res.sendStatus(400);
      else if(rows[0].success) next();
      else
        return res.sendStatus(403);
    });
  } else if(eventnum){     //행사 관련 수정,삭제 루트 접근시
    let sql = `SELECT EXISTS
                  (SELECT *
                  FROM club_authority AS auth
                  INNER JOIN club_event AS event
                  ON auth.clubname = event.clubname
                  WHERE event.eventnum = ? AND auth.authId = ?)
              AS success;`;
    db.get().query(sql, [eventnum, userId], function(err, rows){
      if(err) res.sendStatus(400);
      else if(rows[0].success) next();
      else
        return res.sendStatus(403);
    });

  } else {
    return res.sendStatus(400);
  }
};
