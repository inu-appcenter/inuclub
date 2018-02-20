module.exports = function(){
  const route = require('express').Router();
  const fs = require("fs");
  const path = require('path');

//------------------메인페이지. public/main_img 폴더의 사진들------------------
  route.get('/', function(req, res){
    let main_img = [];
    let files =  fs.readdirSync(path.join(__dirname, '../public/main_img'));
    for(let i = 0; i < files.length; i++){
      let tem = {};
      tem.img = "main_img/" + files[i];
      main_img[i] = tem;
    }
    res.status(200).json(main_img);
  });

  return route;
};
