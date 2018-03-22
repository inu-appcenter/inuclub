const app = require('./config/express')();
const log = require('./config/log');
const key = require('./key.json');
//if 마스터클러스터
/*
else {
  미들웨어 타임아웃 시작
  미들웨어
  404
  에러미들웨어
}
*/

app.use('/main', require('./routes/main')());
app.use('/club', require('./routes/club')());
app.use('/event', require('./routes/event')());
app.use('/user', require('./routes/user')());

app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  log.logger().warn(err);
  res.sendStatus(err.status || 500);
});

const port = key.port;
app.listen(port, function(){
  console.log('Sever On!');
});
