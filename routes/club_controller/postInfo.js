const db = require('../../config/db');
const async = require('async');
const fs = require('fs');
const path = require('path');
const upload = require('../../config/localUpload');

//------------------동아리 소개 수정------------------
exports.info = function(req, res){
  let clubnum = req.params.clubnum;
      representative = req.body.representative;
      phone = req.body.phone;
      application = req.body.application;
      contents = req.body.contents;

  // 길이검사
  let updateArray = [representative, phone,
                      application, contents, clubnum];
  const limited_Length = [5, 13, 255, 1000];

  for(let i = 0; i < updateArray.length - 1; i++){
    if(updateArray[i] && updateArray[i].length > limited_Length[i])
      return res.sendStatus(412);
  }

  let sql = `UPDATE club_info
            SET representative = ?, phone = ?, application = ?, contents = ?
            WHERE num = ?;`;

  db.get().query(sql, updateArray, function(err, result){
    if(err) return res.sendStatus(400);
    res.sendStatus(201);
  });
};


//------------------동아리 사진 수정------------------
exports.image = function(req, res){
  let clubnum = req.params.clubnum;
  let seq = req.params.seq;

  async.waterfall([
      function(callback) {                  // 1. 파일 수신
        let thisUpload = upload.multerSetting(req, res).single('userfile');

        thisUpload(req, res, function (err) {
          if (err) {
              if (err.code === 'LIMIT_FILE_SIZE') // limits 설정보다 큰 파일
                return res.sendStatus(462);
              else
                callback('Error occurred'); //그 외 에러
          }
          else if (req.validateErr) // mimetype가 image가 아님
            return res.sendStatus(464);
          else if(!req.file)  // 아무것도 보내지 않은 경우
            return res.sendStatus(463);
          else
            callback(null, req.file.filename);
        });
      },
      function(upload_Img, callback) {        // 2. 기존 이미지 select 및 db에 업로드이미지 갱신
        let sql = 'SELECT image' + seq + ' FROM club_info WHERE num = ?;';

        db.get().query(sql, clubnum, function(err, rows){
          if(err) {                           //에러 발생시 업로드 파일 제거
            upload.deleteFile('club_img', upload_Img, function(){
              callback('Error occurred');
            });
          } else {
            let privious_img = rows[0]['image'+seq];          //기존 이미지 이름
            let sql = 'UPDATE club_info SET image' + seq + ' = ? WHERE num = ?;';

            db.get().query(sql, [upload_Img, clubnum], function(err, result){
              if(err) {                       //에러 발생시 업로드 파일 제거
                upload.deleteFile('club_img', upload_Img, function(){
                  callback('Error occurred');
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
      if( err ) return res.sendStatus(461);
      res.sendStatus(201);
  });
};
