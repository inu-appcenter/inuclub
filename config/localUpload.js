const multer = require('multer');
const path = require('path');
const fs = require('fs');
const log = require('./log');

//------------------파일 업로드------------------
exports.multerSetting = function(req, res){
  let filename;
  let storage = multer.diskStorage({
    destination : function (req, file, callback) {
      let uploadDir = path.join(__dirname, '../public/club_img/');
      callback(null, uploadDir);
    },
    filename : function (req, file, callback) {
      //파일명은 club_동아리번호_현재시각.확장자
      filename = 'club_' + req.params.clubnum + '_' + Date.now() + '.' + file.mimetype.split('/')[1];   
      callback(null, filename);
    }
  });
  return multer({
    storage: storage,
    limits: { fileSize: 4194304 }, //형태는 byte이며 현재 4mb로 제한. callback 사용불가.
    fileFilter: function (req, file, callback) { // 파일 필터는 파일의 미메타입을 체크하는 옵션.
      if (file.mimetype.indexOf('image') === -1) { // 이미지만 가능.
        req.validateErr = 'otherType';
        callback(null, false, new Error('otherType'));
      } else {
        callback(null, true);
      }
    }
  });
};

//------------------파일 삭제------------------
exports.deleteFile = function(location, filename, callback){
  fs.unlink(path.join(__dirname, '../public/') + location + '/' + filename, function(err){
    if(err)
      log.logger().warn('no image: ' + location + ', ' + filename + ', ' + err);
    callback();
  });
};
