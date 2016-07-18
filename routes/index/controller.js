/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-07-18.
 */

var express = require('express'),
    router = express.Router(),
    service = require('./service');

router.get("/", function(req, res, next) {
    service.init(req, res);
});

module.exports = router;
