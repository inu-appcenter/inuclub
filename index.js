const app = require('./config/express')();
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const log = require('./config/log');
const key = require('./key.json');

if (cluster.isMaster) {
	for (let i = 0; i < numCPUs; i++) {
    let child = cluster.fork();
    log.logger().info('worker '+child.process.pid+' born at init.');
	}

	cluster.on('exit', function(deadWorker, code, signal) {
		let worker = cluster.fork();
		    newPID = worker.process.pid;
        oldPID = deadWorker.process.pid;

    log.logger().error('worker '+oldPID+' died.');
    log.logger().error('error','worker '+newPID+' born.');
  });

} else {  

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
}