/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-07-18.
 * [路由请求页面]
 */

module.exports = function(app) {
    app.use('/', require('./index/controller'));
    app.use('/alipay', require('./alipay/controller'));
}
