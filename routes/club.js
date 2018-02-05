module.exports = function(){
  const route = require('express').Router();
  const util = require('../config/util');
  const get_info = require('./club_controller/get_info');
  const post_info = require('./club_controller/post_info');

  route.get('/category/:type', get_info.category);  //해당 카테고리 동아리 목록
  route.get('/search', get_info.search);            //동아리 검색
  route.get('/info/:clubnum', get_info.info);       //해당 동아리 info

  route.post('/info/:clubnum', util.checkPermission, post_info.info);                      //동아리 소개 수정
  route.post('/image/:clubnum/:seq', util.checkPermission, post_info.image);              //동아리 사진 수정

  return route;
};
