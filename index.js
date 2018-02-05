const app = require('./config/express')();
const log = require('./config/log');

app.use('/main', require('./routes/main')());
app.use('/club', require('./routes/club')());
app.use('/user', require('./routes/user')());

app.use('/test', require('./routes/test')());

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  if(err.status != 404) err = 'Invalid request..';
  log.logger(err);
  res.status(err.status || 500).send('' + err);
});

const port = process.env._port;
app.listen(port, function(){
  console.log('Sever On!');
});
