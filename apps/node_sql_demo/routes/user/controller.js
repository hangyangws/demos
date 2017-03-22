/**
 * Ceated by hangyangws in 2016-06-02.
 */

var express = require('express'),
    router = express.Router(),
    userDao = require('../../dao/userDao');

// 新增用户
router.get('/add', function(req, res, next) {
    userDao.add(req, res, next);
});

// 删除用户
router.get('/delete', function(req, res, next) {
    userDao.delete(req, res, next);
});

// 更新用户信息
router.get('/update', function(req, res, next) {
    userDao.update(req, res, next);
});

// 获取用户信息
router.get('/query', function(req, res, next) {
    userDao.query(req, res, next);
});

module.exports = router;
