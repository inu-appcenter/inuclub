module.exports = {
  apps :
      {
        name      : 'inuclub',
        script    : 'index.js',
        watch     : true,
        ignore_watch : ["log", "public"],
        exec_mode : "fork",
        instances : 0
      }
  };