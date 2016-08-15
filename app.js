/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-07-18.
 */

'use strict';

// 模块引入
var express = require('express'),
    path = require('path'),
    httpLogger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    app = express(),
    velocity = require('velocityjs'),
    fs = require('fs'),
    conf = require('./conf/conf');

// 模板引擎设置（velocity）
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', function(path, options, fn) {
    var template = fs.readFileSync(path).toString(),
        macros = {
            parse: function(file) {
                var template = fs.readFileSync(process.cwd() + '/views/' + file).toString();
                return this.eval(template);
            }
        };
    try {
        fn(null, velocity.render(template, options, macros));
    } catch (err) {
        fn(err)
    }
});

app.use(httpLogger('dev')); // 打印http请求日志
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// 配置静态文件路径
app.use(express.static(path.join(__dirname, conf.staticSrc)));

// 路由设置
require('./routes/index')(app);

// 404
app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// 500
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('common/error', {
        message: err.message
    });
});

module.exports = app;
