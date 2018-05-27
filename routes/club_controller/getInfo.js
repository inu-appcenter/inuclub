const db = require('../../config/db');
const arrayWrap = require("arraywrap");
const NUMBER_OF_IMAGES = 4;

const list_img = function(rows, callback){              //list 사진 접근경로 수정 : 동아리들 첫 사진파일 이름 앞에 정적루트 추가
  for(let i = 0, len = rows.length; i < len; i++){
    if(rows[i].image1)
      rows[i].image1 = 'club_img/' + rows[i].image1;
  }
  callback(rows);
};

const page_img = function(rows, callback){              //page 사진 접근경로 수정 : 사진파일 존재시 파일명 앞에 정적루트 추가
  for(let i = 1; i <= NUMBER_OF_IMAGES; i++){
    if(rows[0]['image' + i])
      rows[0]['image' + i] = 'club_img/' + rows[0]['image' + i];
  }
  delete rows[0].category;
  callback(rows);
};

//------------------동아리 전체 목록 ( temp )------------------
exports.total = function(req, res){
  let sql = `SELECT auth.num, auth.clubname, info.*
              FROM club_authority AS auth
              INNER JOIN club_info AS info
              ON auth.num = info.num;`;

  db.get().query(sql, function(err, rows){
    if(err) {
      log.logger().warn('동아리 전체목록 db err: ' + err);
      return res.sendStatus(400);
    }
    for(let i = 0; i < rows.length; i++){
      for(let j = 1; j <= NUMBER_OF_IMAGES; j++){
        if(rows[i]['image' + j])
          rows[i]['image' + j] = 'club_img/' + rows[i]['image' + j];
      }
    }
    res.status(200).json(rows);
  });
};

//------------------해당 카테고리 동아리 목록------------------
exports.category = function(req, res){
  let category = req.params.type;

  let sql = `SELECT auth.num, auth.clubname, info.location, info.image1
              FROM club_authority AS auth
              INNER JOIN club_info AS info
              ON auth.num = info.num
              WHERE info.category = ?;`;

  db.get().query(sql, category, function(err, rows){
    if(err) {
      log.logger().warn(req.originalUrl + ' 카테고리 목록 db err: ' + err);
      return res.sendStatus(400);
    }
    list_img(rows, function(result){
      res.status(200).json(result);
    });
  });
};

//------------------관련 동아리 검색------------------
exports.search = function(req, res){
  let keyword = arrayWrap(req.query.keyword || '');
  let terms = keyword[0].split('+');
  terms = '%' + terms + '%';

  // 동아리 이름, 카테고리, 내용 검색
  let sql = `SELECT auth.num, auth.clubname, info.location, info.image1
              FROM club_authority AS auth
              INNER JOIN club_info AS info
              ON auth.num = info.num
              WHERE auth.clubname LIKE ? OR info.category LIKE ? OR info.contents LIKE ?;`;

  db.get().query(sql, [terms, terms, terms], function(err, rows){
    if(err) {
      log.logger().warn(req.originalUrl + ' 검색 db err: ' + err);
      return res.sendStatus(400);
    }
    list_img(rows, function(result){
      res.status(200).json(result);
    });
  });
};

//------------------해당 동아리 info------------------
exports.info = function(req, res){
  let num = req.params.clubnum;

  // clubnum을 통한 동아리 정보 가져오기
  let sql = `SELECT auth.num, auth.clubname, info.*
              FROM club_authority AS auth
              INNER JOIN club_info AS info
              ON auth.num = info.num
              WHERE auth.num = ?;`;

  db.get().query(sql, num, function(err, rows){
    if(err || !rows.length) {
      log.logger().warn(num + '번 동아리 info db err: ' + err + ' / rows.length: ' + rows.length);
      return res.sendStatus(400);
    }
    page_img(rows, function(result){
      res.status(200).json(result);
    });
  });
};

//------------------해당 동아리 일정------------------
exports.event = function(req, res) {
  let clubnum = req.params.clubnum;
      sql = 'SELECT clubname FROM club_authority WHERE num = ?;';
  db.get().query(sql, clubnum, function(err, rows){
    if(err || !rows.length) {
      log.logger().warn(clubnum + '번 동아리 일정 db err 1: ' + err + ' / rows.length: ' + rows.length);
      return res.sendStatus(400);
    }

    sql = 'SELECT * FROM club_event WHERE clubname = ? ORDER BY date;';
    db.get().query(sql, rows[0].clubname, function(err, rows){
      if(err) {
        log.logger().warn(clubnum + '번 동아리 일정 db err 2: ' + err);
        return res.sendStatus(400);
      }
      res.status(200).json(rows);
    });
  });
};
