/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-07-18.
 */

'use strict';

var express = require('express'),
    router = express.Router(),
    service = require('./service');

router.get("/start", (req, res) => {
    service.start(req, res);
});

//【支付宝同步返回界面】
router.get("/return", (req, res) => {
    service.return(req, res);
});

//【支付宝自动通知页面 - 回调记账】
router.post("/notify", (req, res) => {
    service.notify(req, res);
});

module.exports = router;
