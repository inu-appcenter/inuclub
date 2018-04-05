module.exports = {
  apps :
      {
        name      : 'inuclub',
        script    : 'index.js',
        watch     : true,
        ignore_watch : ["log", "public"],
        exec_mode : "cluster",
        instances : 0
      }
  };