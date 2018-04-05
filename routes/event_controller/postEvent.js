const db = require('../../config/db');
const log = require('../../config/log');

function updateEvent(sql, eventArray, callback) {
  const limited_Length = [15, 15];
  const datePattern = /^(20\d{2})-(0[0-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
  const timePattern = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;

  //이벤트 이름, 날짜, 시간 유효성 검사
  if(eventArray[0] && datePattern.test(eventArray[2]) && timePattern.test(eventArray[3])){

    for(let i = 0; i < eventArray.length - 3; i++)            //일정이름, 장소 길이 검사
      if(eventArray[i] && eventArray[i].length > limited_Length[i])
        return callback(412);

    db.get().query(sql, eventArray, function(err, result){
      if(err) return callback(400);
      callback(201);
    });
  }
  else
    return callback(465);
}

//------------------일정 등록---------------------
exports.new = function(req, res) {
  let userId = req.session.userId;
  if(!userId) return res.sendStatus(401);

  let eventname = req.body.eventname;
      location = req.body.location;
      date = req.body.date;
      time = req.body.time;

  let sql = 'SELECT clubname FROM club_authority WHERE authId = ?;';
  db.get().query(sql, userId, function(err, rows){
    if(err || !rows.length) return res.sendStatus(400);

    let newEventArray = [eventname, location, date, time, rows[0].clubname];
        sql = 'INSERT INTO club_event (eventname, location, date, time, clubname) VALUES (?, ?, ?, ?, ?);';

    updateEvent(sql, newEventArray, function(statusCode){
      log.logger().info(req.session.userId + ' (' + statusCode + ') 일정등록 : ' + eventname);
      res.sendStatus(statusCode);
    });
  });
};

//------------------일정 수정---------------------
exports.edit = function(req, res) {
  let eventnum = req.params.eventnum;
      eventname = req.body.eventname;
      location = req.body.location;
      date = req.body.date;
      time = req.body.time;

      editEventArray = [eventname, location, date, time, eventnum];
      sql = 'UPDATE club_event SET eventname = ?, location = ?, date = ?, time = ? WHERE eventnum = ?';

      updateEvent(sql, editEventArray, function(statusCode){
        log.logger().info(req.session.userId + ' (' + statusCode + ') 일정수정 : ' + eventnum);
        res.sendStatus(statusCode);
      });
};

//------------------일정 삭제---------------------
exports.delete = function(req, res) {
  let eventnum = req.params.eventnum;
      sql = 'DELETE FROM club_event WHERE eventnum = ?;';

  db.get().query(sql, eventnum, function(err, result){
    if(err) return res.sendStatus(400);
    
    log.logger().info(req.session.userId + ' 일정삭제 : ' + eventnum);
    res.sendStatus(201);
  });
};
