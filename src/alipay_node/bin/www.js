/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-07-18.
 * [项目启动文件]
 */

'use strict';

var app = require('../app'),
    conf = require('../conf/conf'),
    debug = require('debug')(conf.appName),
    http = require('http'),
    cluster = require('cluster'),
    numCpus = require('os').cpus().length,
    port = (_v => {
        var port = parseInt(_v, 10);
        if (isNaN(port)) return _v;
        if (port >= 0) return port;
        return false;
    })(process.env.PORT || conf.PORT);

// 创建服务器
if (cluster.isMaster) {
    // 根据CPU数量创建进程
    let _l = numCpus;
    while (_l--) cluster.fork();
    cluster.on('listening', (worker, address) => {
        console.log('---worker: ', worker.process.pid, ' start---');
    });
    cluster.on('exit', (worker, code, signal) => {
        console.log('---worker: ', worker.process.pid, ' died,wait for restart…---');
        cluster.fork();
        console.log('---worker: ', worker.process.pid, ' restart success---');
    });
} else {
    // 设置端口
    app.set('port', port);
    let server = http.createServer(app);
    server.listen(port);
    server.on('error', error => {
        if (error.syscall !== 'listen') throw error;
        let bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
        switch (error.code) {
            case 'EACCES':
                console.error(bind, ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind, ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    });
    server.on('listening', () => {
        let addr = server.address(),
            bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
        debug('Listening on ' + bind);
    });
}
