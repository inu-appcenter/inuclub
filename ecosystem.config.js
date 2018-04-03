module.exports = {
  apps :
      {
        name      : 'pm2',
        script    : 'index.js',
        watch     : true,
        ignore_watch : ["logs", "public"],
        exec_mode : "cluster",
        instances : 0,
  
        merge_logs : true,
        log_date_format : "YY-MM-DD HH:mm:ss",
        error_file : "./logs/err.log",
        out_file : "./logs/out.log"
      }
  };