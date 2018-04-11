module.exports = {
  apps :
      {
        name      : 'inuclub',
        script    : 'index.js',
        watch     : false,
        // ignore_watch : ["log", "public"],
        exec_mode : "fork",
        instances : 1
      }
  };