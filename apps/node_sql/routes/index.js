/**
 * Ceated by hangyangws in 2016-06-02.
 * [路由控制 - RESTful设计]
 */

module.exports = function(app) {
    // 注册
    app.use('/user', require('./user/controller'));
};
