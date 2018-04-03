const mysql = require('mysql');
const key = require('../key.json');
let pool;

exports.connect = function(done){
  pool = mysql.createPool({
    connectionLimit: 30,         // pool 30개 생성
    host     : key.host,
    user     : key.user,
    password : key.password,
    database : key.database
  });
};

exports.get = function(){
  return pool;
};
