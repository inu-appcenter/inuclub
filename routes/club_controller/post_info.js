const db = require('../../config/db');
const async = require('async');
const fs = require('fs');
const path = require('path');
const upload = require('../../config/localUpload');

exports.info = function(req, res, next){            //동아리 소개 수정
  var clubnum = req.params.clubnum;
      introduce = req.body.introduce;
      representative = req.body.representative;
      phone = req.body.phone;
      application = req.body.application;
      contents = req.body.contents;

  var updateArray = [introduce, representative, phone,
                      application, contents, clubnum];
      nameArray = ['introduce', 'representative', 'phone',
                      'application', 'contents', 'clubnum'];
      limited_Length = [20, 5, 13, 255, 1000];

  for(let i = 0; i < updateArray.length - 1; i++){
    if(updateArray[i].length > limited_Length[i])
      return res.status(400).send(nameArray[i] + '의 길이가 너무 깁니다.');
  }

  var sql = `UPDATE club_info
            SET introduce = ?, representative = ?, phone = ?, application = ?, contents = ?
            WHERE num = ?;`;

  db.get().query(sql, updateArray, function(err, result){
    if(err) return next(err);
    res.sendStatus(201);
  });
};

exports.image = function(req, res){                   //동아리 사진 수정
  var clubnum = req.params.clubnum;
  var seq = req.params.seq;

  async.waterfall([
      function(callback) {                  // 1. 파일 수신
        var thisUpload = upload.multerSetting(req, res).single('userfile');

        thisUpload(req, res, function (err) {
          if (err) {
              if (err.code === 'LIMIT_FILE_SIZE') // limits 설정보다 큰 파일
                callback('이미지 크기는 최대2Mbye까지 가능합니다.');
              else
                callback('업로드에 실패하였습니다.');
          }
          else if (req.validateErr)
            callback(req.validateErr);
          else if(!req.file)
            callback('이미지를 등록해주세요.');
          else
            callback(null, req.file.filename);
        });
      },
      function(upload_Img, callback) {        // 2. 기존 이미지 검사 및 db에 업로드이미지 갱신
        var sql = 'SELECT image' + seq + ' FROM club_info WHERE num = ?';

        db.get().query(sql, clubnum, function(err, rows){
          if(err) {                           //에러 발생시 업로드 파일 제거
            upload.deleteFile('club_img', upload_Img, function(){
              callback('업로드에 실패하였습니다.');
            });
          } else {
            var privious_img = rows[0]['image'+seq];
            var sql = 'UPDATE club_info SET image' + seq + ' = ? WHERE num = ?';

            db.get().query(sql, [upload_Img, clubnum], function(err, rows){
              if(err) {                       //에러 발생시 업로드 파일 제거
                upload.deleteFile('club_img', upload_Img, function(){
                  callback('업로드에 실패하였습니다.');
                });
              } else
                callback(null, privious_img);
            });
          }
        });
      },
      function(privious_img, callback) {            // 3. 기존 이미지 삭제
          if(!privious_img) callback(null);
          else {
            upload.deleteFile('club_img', privious_img, function(){
              callback(null);
            });
          }
      }
  ], function (err) {
      if( err ) return res.status(400).send(err);
      res.status(201);
  });
};
