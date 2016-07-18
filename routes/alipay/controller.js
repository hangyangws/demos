/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-07-18.
 */

var express = require('express'),
    router = express.Router(),
    service = require('./service');

router.get("/start", (req, res) => {
    service.start(req, res);
});

router.get("/return", (req, res) => {
    service.return(req, res);
});

router.get("/notify", (req, res) => {
    service.notify(req, res);
});

module.exports = router;
