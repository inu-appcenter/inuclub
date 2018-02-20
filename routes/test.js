module.exports = function(){
  const route = require('express').Router();
  const db = require('../config/db');
  const async = require('async');

  route.get('/login', function(req, res){
    req.session.userId = 'app';
    res.sendStatus(200);
  });

  route.get('/', function(req, res){
    res.render('infoPost');
  });

  return route;
};
