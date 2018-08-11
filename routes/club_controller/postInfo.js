const async = require('async');
const upload = require('../../config/localUpload');

//------------------동아리 소개 수정------------------
exports.info = (req, res) => {
  const db = req.app.get('db');
  let clubnum = req.params.clubnum,
      representative = req.body.representative || '',
      phone = req.body.phone || '',
      application = req.body.application || '',
      contents = req.body.contents || '';

  // 길이검사
  let updateArray = [representative, phone, application, contents, clubnum];
  const limited_Length = [5, 13, 255, 1000];

  for (let i = 0, len = updateArray.length; i < len - 1; i++) {
    if (updateArray[i] && updateArray[i].length > limited_Length[i]) {
      console.log(`postInfo.js Exceed the length : clubnum=${clubnum}`);
      return res.sendStatus(412);
    }
  }

  let sql = `UPDATE club_info
            SET representative = ?, phone = ?, application = ?, contents = ?
            WHERE num = ?`;

  db.query(sql, updateArray, (err, result) => {

    if (err) {
      console.log(`postInfo.js err1 : clubnum=${clubnum} err=${err}`);
      return res.sendStatus(400);
    }

    console.log(`postInfo.js : 동아리 수정 clubnum=${clubnum}`);
    res.sendStatus(201);

  });
};


//------------------동아리 사진 수정------------------
exports.image = (req, res) => {
  const db = req.app.get('db');
  let clubnum = req.params.clubnum,
      seq = req.params.seq,
      upload_Img = null;

  if (!(seq >= 1 && seq <= 4)) return res.sendStatus(400);

  async.waterfall([

    /* 파일 수신 */
    (callback) => {

      let thisUpload = upload.multerSetting(req, res).single('userfile');

      thisUpload(req, res, (err) => {
        if (err) {

          if (err.code === 'LIMIT_FILE_SIZE') { // limits 설정보다 큰 파일
            let msg = '파일 용량 초과';
            callback(462, msg);
          }
          else {
            let msg = `err2=${err}`;
            callback(461, msg); //그 외 에러
          }

        } else if (req.validateErr) { // mimetype가 image가 아님
          let msg = 'invalid mimetype';
          callback(464, msg);
        }
        else if (!req.file) { // 아무것도 보내지 않은 경우
          let msg = '파일이 수신되지 않음';
          callback(463, msg);
        }
        else {
          upload_Img = req.file.filename;
          callback(null);
        }
      });
    },

    /* 기존 이미지 select 및 db에 업로드이미지 갱신 */
    (callback) => {

      let sql = 'SELECT image' + seq + ' FROM club_info WHERE num = ?';

      db.query(sql, clubnum, (err, rows) => {

        if (err) { //에러 발생시 업로드 파일 제거

          let msg = `err3=${err}`;
          callback(461, msg);

        } else {

          let sql = 'UPDATE club_info SET image' + seq + ' = ? WHERE num = ?';
          db.query(sql, [upload_Img, clubnum], (err, result) => {

            if (err) { //에러 발생시 업로드 파일 제거

              let msg = `err4=${err}`;
              callback(461, msg);

            } else {

              let privious_img = rows[0]['image' + seq]; //기존 이미지 이름
              callback(null, privious_img);

            }
          });
        }
      });
    },

    /* 기존 이미지 삭제 */
    (privious_img, callback) => {

      if (!privious_img) callback(null);
      else {
        upload.deleteFile('club_img', privious_img, () => {
          callback(null);
        });
      }

    }

    /* response */
  ], (errStatus, msg) => {

    /* 업로드 실패한 경우 */
    if (errStatus) {

      console.log(`postInfo.js : clubnum=${clubnum} ${seq}번 사진 업로드 실패 errStatus=${errStatus}, errMsg=>[${msg}]`);
      if (upload_Img !== null) {
        let fileRoute = 'club_img';
        upload.deleteFile(fileRoute, upload_Img, () => { /*  */ });
      }
      return res.sendStatus(errStatus);

    } else {

      console.log(`postInfo.js : clubnum=${clubnum} ${seq}번 사진 업로드`);
      res.sendStatus(201);

    }
  });
};

//------------------동아리 사진 삭제------------------
exports.deleteImage = (req, res) => {
  const db = req.app.get('db');
  let clubnum = req.params.clubnum,
      seq = req.params.seq;

  if (!(seq >= 1 && seq <= 4)) return res.sendStatus(400);

  let sql = `SELECT image${seq} FROM club_info WHERE num = ?`;
  db.query(sql, clubnum, (err, rows) => {

    if (err || !rows.length) {
      console.log(`postInfo.js err5 : ${err}`);
      return res.sendStatus(400);
    } else if (rows[0]['image' + seq] === null) {
      console.log(`postInfo.js 등록된 이미지 없음 : clubnum=${clubnum} seq=${seq}`);
      return res.sendStatus(400);
    }

    let deleteImgName = rows[0]['image' + seq];

    sql = `UPDATE club_info SET image${seq} = null WHERE num = ?`;
    db.query(sql, clubnum, (err, result) => {

      if (err) {
        console.log(`postInfo.js err6 : ${err}`);
        return res.sendStatus(400);
      }

      upload.deleteFile('club_img', deleteImgName, () => {
        res.sendStatus(200);
      });

    });
  });
}

// exports.image2 = (req, res) => {
//   const db = req.app.get('db');
//   let clubnum = req.params.clubnum,
//       seq = req.params.seq;

//   if (!(seq >= 1 && seq <= 4)) return res.sendStatus(400);

//   async.waterfall([

//     /* 파일 수신 */
//     (callback) => {

//       let thisUpload = upload.multerSetting(req, res).single('userfile');

//       thisUpload(req, res, (err) => {
//         if (err) {

//           if (err.code === 'LIMIT_FILE_SIZE') // limits 설정보다 큰 파일
//             callback(462);
//           else {
//             console.log(`postInfo.js err2 : clubnum=${clubnum} err=${err}`);
//             callback(461); //그 외 에러
//           }
//         } else if (req.validateErr) // mimetype가 image가 아님
//           callback(464);
//         else if (!req.file) // 아무것도 보내지 않은 경우
//           callback(463);
//         else {
//           callback(null, req.file.filename);
//         }
//       });
//     },

//     /* 기존 이미지 select 및 db에 업로드이미지 갱신 */
//     (upload_Img, callback) => {

//       let sql = 'SELECT image' + seq + ' FROM club_info WHERE num = ?';

//       db.query(sql, clubnum, (err, rows) => {

//         if (err) { //에러 발생시 업로드 파일 제거

//           console.log(`postInfo.js err3 : clubnum=${clubnum} err=${err}`);
//           upload.deleteFile('club_img', upload_Img, () => {
//             callback(461);
//           });

//         } else {

//           let sql = 'UPDATE club_info SET image' + seq + ' = ? WHERE num = ?';
//           db.query(sql, [upload_Img, clubnum], (err, result) => {

//             if (err) { //에러 발생시 업로드 파일 제거

//               console.log(`postInfo.js err4 : clubnum=${clubnum} err=${err}`);
//               upload.deleteFile('club_img', upload_Img, () => {
//                 callback(461);
//               });

//             } else {

//               let privious_img = rows[0]['image' + seq]; //기존 이미지 이름
//               callback(null, privious_img);

//             }
//           });
//         }
//       });
//     },

//     /* 기존 이미지 삭제 */
//     (privious_img, callback) => {

//       if (!privious_img) callback(null);
//       else {
//         upload.deleteFile('club_img', privious_img, () => {
//           callback(null);
//         });
//       }
//     }

//     /* response */
//   ], (errStatus) => {

//     /* 업로드 실패한 경우 */
//     if (errStatus) {
//       console.log(`postInfo.js : clubnum=${clubnum} ${seq}번 사진 업로드 실패 errStatus=${errStatus}`);
//       return res.sendStatus(errStatus);
//     }

//     console.log(`postInfo.js : clubnum=${clubnum} ${seq}번 사진 업로드`);
//     res.sendStatus(201);
//   });
// };
