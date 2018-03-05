const mysql = require('mysql');
let pool;

exports.connect = function(done){
  pool = mysql.createPool({
    connectionLimit: 50,         // pool 50개 생성
    host     : process.env._host,
    user     : process.env._user,
    password : process.env._password,
    database : process.env._database1
  });
};

exports.get = function(){
  return pool;
};
