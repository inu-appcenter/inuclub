const cluster = require('cluster');
const numCPUs = require('os').cpus().length == 1 ? 1 : 2;

cluster.setupMaster({
  exec : __dirname + '/worker.js'
});

let startWorker = () => {
  let worker = cluster.fork();
  console.log('CLUSTER: Worker %d started', worker.process.pid);
}

for (let i = 0; i < numCPUs; i++) {
  startWorker();
}

cluster.on('exit', (deadWorker, code, signal) => {
  console.log('CLUSTER: Worker %d died with exit code %d (%s)', deadWorker.process.pid, code, signal);
  startWorker();
});
