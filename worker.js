const app = require('./config/express')();

app.use('/main', require('./routes/main'));
app.use('/club', require('./routes/club'));
app.use('/event', require('./routes/event'));
app.use('/user', require('./routes/user'));

if (app.get('key').env === 'development') {
    app.use('/test', require('./routes/test')());
}

app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    console.log('Error handler : [' + req.originalUrl + '] ' + err);
    res.sendStatus(err.status || 500);
});

const port = app.get('key').port || 3000;
app.listen(port, () => {
    console.log('[' + app.get('key').env + '] Listening on port %d.', port);
});