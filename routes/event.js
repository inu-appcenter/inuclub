const route = require('express').Router();
const util = require('../config/util');
const getEvent = require('./event_controller/getEvent');
const postEvent = require('./event_controller/postEvent');

route.get('/list/', getEvent.total);                                   //이거 말고 달 단위로 날짜만
route.get('/list/:date', getEvent.list);                               //해당 날짜 목록

route.post('/new', postEvent.new);                                     //일정 등록
route.post('/:eventnum/edit', util.checkPermission, postEvent.edit);   //일정수정
route.post('/:eventnum/delete', util.checkPermission, postEvent.delete);  //일정 삭제

module.exports = route;