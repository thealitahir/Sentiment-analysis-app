var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var url = require('./routes/url');

var app = express();

var multer = require('multer');
app.use(multer());
var array=[{team:'london',player:'smith',goals:2},{team:'munich',player:'schwartz',goals:1},{team:'london',player:'robert',goals:1},{team:'munich',player:'schwartz',goals:3}]
function groupBy(key,array){
    var group={};
    for(var i=0;i,array.length;i++){
        if(checkDuplicate(group,key)){

        }
        else{
            group[key].push(getAllkeys(array[i],key));
        }
    }
}
function checkDuplicate(group,key){

}
function getAllkeys(doc,key){
    delete doc[key];
    return doc;
}
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
//app.use('/users', users);

//app.use('/', students);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
