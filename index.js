const app = require('./config/express')();
const log = require('./config/log');
const key = require('./key.json');

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
  log.logger().warn('Error handler: ' + req.originalUrl + ', ' + err);
  res.sendStatus(err.status || 500);
});

const port = key.port;
app.listen(port, function(){
  console.log('Sever On!');
});
