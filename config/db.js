const mysql = require('mysql');
let pool;

exports.connect = (key, done) => {
  pool = mysql.createPool({
    connectionLimit: 10,         // pool 생성
    host     : key.host,
    user     : key.user,
    password : key.password,
    database : key.database
  });
};

exports.get = () => { return pool; };