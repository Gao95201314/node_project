var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ignoreRouter = require('./config/ignoreRouter');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var grandRouter = require('./routes/grand');
var phoneRouter = require('./routes/phone');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//自已实现的中间件函数，用来判断用户是否登录
app.use(function(req, res, next) {
    //req.cookies.nickname; //cookie-parser是个中间件，则就可以直接获取到请求头中的cookie信息
    // req.get('Cookie');也可以通过这个方法获取，但是这个获取的是字符串
    //登录页面也会进入这个中间函数，所以要排除，不然就会报错，说重定向次数过多
    //排除不需要判断的页面
    if (ignoreRouter.indexOf(req.url) > -1) {
        next();
        return;
    }
    var nickname = req.cookies.nickname;
    if (nickname) {
        next();
    } else {
        //如果nicknam不存在，就跳转到登录页面
        res.redirect('/');
    }

})


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/grand', grandRouter);
app.use('/phone', phoneRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;