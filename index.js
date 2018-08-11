const cluster = require('cluster');
const numCPUs = (require('os').cpus().length == 1 ? 1 : 2);

cluster.setupMaster({
  exec: __dirname + '/worker.js'
});

let startWorker = () => {
  let worker = cluster.fork();
  console.log(`CLUSTER: Worker ${worker.process.pid} started`);
}

for (let i = 0; i < /*numCPUs*/ 1; i++) { //워커 개수 늘리려면 주석 풀고 레디스설치
  startWorker();
}

cluster.on('exit', (deadWorker, code, signal) => {
  console.log(`CLUSTER: Worker ${deadWorker.process.pid} died with exit code ${code} (${signal})`);
  startWorker();
});
