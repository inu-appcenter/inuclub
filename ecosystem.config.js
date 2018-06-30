module.exports = {
  apps :
      {
        name      : 'inuclub',
        script    : 'index.js',
        watch     : false,
        ignore_watch : ["logs", "public"],
        exec_mode : "fork",
        instances : 1,
        merge_logs : true,
        log_date_format : "YY-MM-DD HH:mm:ss",
        error_file : "./logs/err.log",
        out_file : "./logs/out.log"
      }
  };