const db = require('./db');

exports.checkPermission = function (req, res, next){
  var userId = req.session.userId;
      clubnum = req.params.clubnum;
      event_num = req.params.event_num;

  if(!userId) return res.status(403).send('Please log in.');

  if(clubnum){
    var sql = 'SELECT num FROM club_authority WHERE num = ? AND authId = ?;';
      db.get().query(sql, [clubnum, userId], function(err, rows){
        if(err) next(err);
        else if(rows.length > 0 ) next();
        else
          return res.status(403).send('You don\'t have permission.');
    });
  } else if(event_num){
    //행사 수정,삭제 권한 여부, event_num을 통한 clubnum과 session의 id를 통한 clubnum비교? <--> 행사 등록여부는 위의 로직 이용
    console.log('event_num' + event_num);
  } else {
    next('err');
  }
};
