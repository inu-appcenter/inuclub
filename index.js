const app = require('./config/express')();
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const log = require('./config/log');
const key = require('./key.json');

function startWorker() {
  let worker = cluster.fork();
  log.logger().info('CLUSTER: Worker %d started', worker.process.pid);
}

if (cluster.isMaster) {
	for (let i = 0; i < numCPUs; i++) {
    startWorker();
	}

	cluster.on('exit', function(deadWorker, code, signal) {
    log.logger().error('CLUSTER: Worker %d died with exit code %d (%s)', deadWorker.process.pid, code, signal);
    startWorker();
  });

} else {  

  app.use('/main', require('./routes/main'));
  app.use('/club', require('./routes/club'));
  app.use('/event', require('./routes/event'));
  app.use('/user', require('./routes/user'));

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
    console.log('Server On!');
  });
}