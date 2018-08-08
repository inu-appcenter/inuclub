const route = require('express').Router();
const util = require('../config/util');
const getInfo = require('./club_controller/getInfo');
const postInfo = require('./club_controller/postInfo');

route.get('/', getInfo.total);
route.get('/category/:type', getInfo.category);       //해당 카테고리 동아리 목록
route.get('/search', getInfo.search);                 //동아리 검색
route.get('/info/:clubnum', getInfo.info);            //해당 동아리 info
route.get('/event/:clubnum', getInfo.event);          //해당 동아리 일정 목록

route.post('/info/:clubnum', util.checkPermission, postInfo.info);                      //동아리 소개 수정  => 일반학생 로그인 안하면 :clubnum 지우고 세션으로
route.post('/image/:clubnum/:seq', util.checkPermission, postInfo.image);              //동아리 사진 수정
route.delete('/image/:clubnum/:seq', util.checkPermission, postInfo.deleteImage);      //동아리 사진 삭제

module.exports = route;
