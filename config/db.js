const mysql = require('mysql');
var pool;

exports.connect = function(done){
  pool = mysql.createPool({
    connectionLimit: 100,
    host     : process.env._host,
    user     : process.env._user,
    password : process.env._password,
    database : process.env._database1
  });
};

exports.get = function(){
  return pool;
};
