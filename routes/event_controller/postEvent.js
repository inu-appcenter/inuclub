let updateEvent = (db, sql, eventArray, callback) => {
  const limited_Length = [15, 15];
  const datePattern = /^(20\d{2})-(0[0-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
  const timePattern = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;

  //이벤트 이름, 날짜, 시간 유효성 검사
  if (eventArray[0] && datePattern.test(eventArray[2]) && timePattern.test(eventArray[3])) {

    //일정이름, 장소 길이 검사
    for (let i = 0, len = eventArray.length - 3; i < len; i++) 
      if (eventArray[i] && eventArray[i].length > limited_Length[i])
        return callback(412);

    db.query(sql, eventArray, (err, result) => {

      if (err) {
        console.log('postEvent.js err1: [' + req.session.userId + '] ' + err);
        return callback(400);
      }
      callback(201);

    });

  } else {
    return callback(465);
  }
}

//------------------일정 등록---------------------
exports.new = (req, res) => {
  const db = req.app.get('db');
  let userId = req.session.userId;
  if (!userId) return res.sendStatus(401);

  let eventname = req.body.eventname;
  location = req.body.location || '';
  date = req.body.date;
  time = req.body.time;

  let newEventArray = [eventname, location, date, time, userId];
  sql = `INSERT INTO club_event (eventname, location, date, time, clubname) VALUES (?, ?, ?, ?, 
              (SELECT clubname FROM club_authority WHERE authId = ?))`;

  updateEvent(db, sql, newEventArray, (statusCode) => {
    console.log('postEvent.js : [' + req.session.userId + '] status:' + statusCode + ', 일정등록: ' + eventname);
    res.sendStatus(statusCode);
  });
};

//------------------일정 수정---------------------
exports.edit = (req, res) => {
  const db = req.app.get('db');
  let eventnum = req.params.eventnum;
  eventname = req.body.eventname;
  location = req.body.location;
  date = req.body.date;
  time = req.body.time;

  editEventArray = [eventname, location, date, time, eventnum];
  sql = 'UPDATE club_event SET eventname = ?, location = ?, date = ?, time = ? WHERE eventnum = ?';

  updateEvent(db, sql, editEventArray, (statusCode) => {
    console.log('postEvent.js : [' + req.session.userId + '] status:' + statusCode + ', 일정수정번호 : ' + eventnum);
    res.sendStatus(statusCode);
  });
};

//------------------일정 삭제---------------------
exports.delete = (req, res) => {
  const db = req.app.get('db');
  let eventnum = req.params.eventnum;
  sql = 'DELETE FROM club_event WHERE eventnum = ?';

  db.query(sql, eventnum, (err, result) => {

    if (err) {
      console.log('postEvent.js err2 : [' + req.session.userId + '] ' + eventnum + '번 일정 ' + err);
      return res.sendStatus(400);
    }

    console.log('postEvent.js : [' + req.session.userId + '] ' + eventnum + '번 일정삭제');
    res.sendStatus(201);
    
  });
};
