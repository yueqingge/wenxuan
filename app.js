var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieSession = require('cookie-session');
var logger = require('morgan');
var multer = require('multer');
let cors = require('cors');

var app = express();

// 中间件的配置
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieSession({
    name: 'top-news',
    keys: ['aaaaa', 'bbb', 'ccc'],
    maxAge: 1000 * 60 * 60 * 60 * 24
}))

const storage = multer.diskStorage({
    //分配位置
    destination: function(req, file, cb) {
        //req  请求体  req.files == array   file 一张
        if (req.url.indexOf('reg') !== -1) {
            cb(null, path.join('public', 'upload', 'user'))
        } else if (req.url.includes('banner')) {
            cb(null, path.join('public', 'upload', 'banner'))
        } else {
            cb(null, path.join('public', 'upload', 'news'))
        }
    },
})

let objMulter = multer({ storage });
app.use(objMulter.any());



app.use(cors({
    //允许所有前端域名
    "origin": ["http://localhost:8001", "http://localhost:5000", "http://127.0.0.1:8848"],
    "credentials": true, //允许携带凭证
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE", //被允许的提交方式
    "allowedHeaders": ['Content-Type', 'Authorization', 'token'] //被允许的post方式的请求头
}));


// 多位置的静态资源托管
app.use(express.static(path.join(__dirname, 'public/template')));
// 加别名访问不同端
app.use('/admin', express.static(path.join(__dirname, 'public/admin')));
// 访问外层公共资源
app.use(express.static(path.join(__dirname, 'public')));

//接口的响应 -客户端接口

app.all('/api/*', require('./utils/params'));
app.use('/api/login', require('./routes/api/login'));
app.use('/api/reg', require('./routes/api/reg'));
app.use('/api/user', require('./routes/api/user'));
app.use('/api/news', require('./routes/api/news'));
app.use('/api/is-token', require('./routes/api/is-token'));

// app.use('/api/banner', require('./routes/api/banner'));
// app.use('/api/home', require('./routes/api/home'));
// app.use('/api/column', require('./routes/api/column'));
// app.use('/api/follow', require('./routes/api/follow'));

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
    // res.status(err.status || 500);
    // res.render('error');


    if (req.url.includes('/api')) { //webApi接口错误
        res.send({
            err: 1,
            msg: '不存在的接口名'
        })
    } else if (req.url.includes('/admin')) { //服务端Api接口错误
        res.render('error');
    } else { //交还给客户端判断
        res.sendFile(path.join(__dirname, 'public', 'template', 'index.html'));
    }

});

module.exports = app;