module.exports = {
  apps :
      {
        name      : 'inuclub',
        script    : 'index.js',
        watch     : true,
        ignore_watch : ["log", "public", "node_modules"],
        exec_mode : "fork",
        instances : 1
      }
  };