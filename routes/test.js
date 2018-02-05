module.exports = function(){
  const route = require('express').Router();
  const db = require('../config/db');
  const async = require('async');

  route.get('/', function(req, res){
/*
    var thisUpload = upload.multerSetting(req, res).single('userfile');

    thisUpload(req, res, function (err) {
      console.log(req.file);
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') { // limits 설정보다 큰 파일
          res.status(400).send('이미지 크기는 최대2Mbye까지 가능합니다.');
        } else {
          next(err);
        }
      } else if (req.validateErr) {
          res.status(400).send(req.validateErr);
      } else if(!req.file) {
        res.status(400).send('이미지를 등록해주세요.');
      } else {
        res.status(200).send('Uploaded!');
        console.log(req.file);
        console.log(req.file.filename);
      }
    });
    */
  });

  return route;
};
