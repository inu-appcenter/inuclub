const path = require('path');
const fs = require('fs');
const winston = require('winston');

const logDir = 'log';
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
const logFilename = path.join(__dirname, '../', logDir, '/created-logfile.log');
const tsFormat = () => (new Date()).toLocaleTimeString();

let logger = new (winston.Logger)({
  transports: [
    new (require('winston-daily-rotate-file'))({
      level: 'info',
      filename: `${logDir}/-logs.log`,
      timestamp: tsFormat,
      datePattern: 'yyyy-MM-dd',
      prepend: true
    })
  ]
});

exports.logger = function(){
  return logger;
};
