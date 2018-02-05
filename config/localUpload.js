const multer = require('multer');
const path = require('path');
const fs = require('fs');
const log = require('./log');

exports.multerSetting = function(req, res){
  var filename;
  var storage = multer.diskStorage({
    destination : function (req, file, callback) {
      var uploadDir = path.join(__dirname, '../public/club_img/');
      callback(null, uploadDir);
    },
    filename : function (req, file, callback) {
      filename = 'club_' + req.params.clubnum + '_' + Date.now() + '.' + file.mimetype.split('/')[1];
      callback(null, filename);
    }
  });
  return multer({
    storage: storage,
    limits: { fileSize: 2097152 }, //형태는 byte이며 현재 2mb로 제한. callback 사용불가.
    fileFilter: function (req, file, callback) { // 파일 필터는 파일의 미메타입을 체크하는 옵션.
      if (file.mimetype.indexOf('image') === -1) { // 이미지만 가능.
        req.validateErr = '이미지 파일만 가능합니다.';
        callback(null, false, new Error('이미지 파일만 가능합니다.'));
      } else {
        callback(null, true);
      }
    }
  });
};

exports.deleteFile = function(location, filename, callback){
  fs.unlink(path.join(__dirname, '../public/') + location + '/' + filename, function(err){
    if(err) log.logger(err);
    callback();
  });
};
