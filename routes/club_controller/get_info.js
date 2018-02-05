const db = require('../../config/db');
const arrayWrap = require("arraywrap");
const NUMBER_OF_IMAGES = 4;

const list_img = function(rows, callback){
  for(let i = 0; i < rows.length; i++){
    if(rows[i].image1)
      rows[i].image1 = 'club_img/' + rows[i].image1;
  }
  callback(rows);
};

const page_img = function(rows, callback){
  for(let i = 1; i <= NUMBER_OF_IMAGES; i++){
    if(rows[0]['image' + i])
      rows[0]['image' + i] = 'club_img/' + rows[0]['image' + i];
  }
  callback(rows);
};

exports.category = function(req, res, next){          //해당 카테고리 동아리 목록
  var category = req.params.type;

  var sql = `SELECT auth.num, auth.clubname, info.introduce, info.location, info.image1
              FROM inuclub.club_authority AS auth
              LEFT OUTER JOIN inuclub.club_info AS info
              ON auth.num = info.num
              WHERE info.category = ?;`;

  db.get().query(sql, category, function(err, rows){
    if(err) return next(err);
    list_img(rows, function(result){
      res.status(200).json(result);
    });
  });
};

exports.search = function(req, res, next){            //관련 동아리 검색
  var keyword = arrayWrap(req.query.keyword || '');
  var terms = keyword[0].split('+');
  terms = '%' + terms + '%';

  var sql = `SELECT auth.num, auth.clubname, info.introduce, info.location, info.image1
              FROM inuclub.club_authority AS auth
              LEFT OUTER JOIN inuclub.club_info AS info
              ON auth.num = info.num
              WHERE auth.clubname LIKE ? OR info.introduce LIKE ? OR info.category LIKE ?;`;

  db.get().query(sql, [terms, terms, terms], function(err, rows){
    if(err) return next(err);
    list_img(rows, function(result){
      res.status(200).json(result);
    });
  });
};


exports.info = function(req, res, next){              //해당 동아리 info
  var num = req.params.clubnum;

  var sql = `SELECT auth.num, auth.clubname, info.introduce, info.location,
                    info.image1, info.image2, info.image3, info.image4, info.representative,
                    info.phone, info.application, info.contents
              FROM club_authority AS auth
              LEFT OUTER JOIN club_info AS info
              ON auth.num = info.num
              WHERE auth.num = ?;`;

  db.get().query(sql, num, function(err, rows){
    if(err) next(err);
    else if(!rows.length){
      res.status(400).send('Invalid request.');
    } else {
      page_img(rows, function(result){
        res.status(200).json(result);
      });
    }
  });
};
