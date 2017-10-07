var mysql = require('mysql'),
    conf = require('../conf/conf'),
    sql = require('./userDaoSql'),
    pool = mysql.createPool(conf.MYSQL),
    // [mysql-queues](https://www.npmjs.com/package/mysql-queues)
    queues = require('mysql-queues');


var DEBUG = true,
    renderJson = function(res, result) {
        res.json(result || {
            status: false,
            error: '操作失败'
        });
    };

//console.log(pool);

module.exports = {
    add: function(req, res, next) {
        pool.getConnection(function(err, connection) {
            var param = req.query;
            queues(connection, DEBUG);
            // SQL事务
            var trans = connection.startTransaction();
            trans.query(sql.add, [param.name+'NEW', param.age], function(err, info) {
                if(err) {
                    trans.rollback();
                }
                else {

                    console.log('add-result==============');
                    console.log(info);
                    var _id = param.id || 1;
                    console.log(_id);
                    trans.query(sql.query, _id, function(err, info) {
                        if(err) {
                            trans.rollback();
                        }
                        else {
                            console.log('query-result==============');
                            console.log(info);
                            info && (info = { status: 200 , message: '增加且查询成功'});
                            renderJson(res, info);
                            trans.commit();
                        }
                    });
                }
            });
            trans.execute();
            // 在上一事务执行完之前（包括callback）以下查询不会执行
            // connection.query(sql.query, param.id, function(err, result) {
            //     console.log('query-resulet==============');
            //     console.log(result);
            //     if(result && result.length) {
            //         result = {
            //             status: 200,
            //             data: result[0]
            //         };
            //     } else {
            //         result = null;
            //     }
            //     console.log(result);
            //     connection.release();
            // });
        });
    },
    delete: function(req, res, next) {
        var id = +req.query.id;
        if (id) {
            pool.getConnection(function(err, connection) {
                connection.query(sql.delete, id, function(err, result) {
                    console.log('delete-resulet==============');
                    console.log(result);
                    if (result.affectedRows > 0) {
                        result = { status: 200 };
                    } else {
                        result = null;
                    }
                    renderJson(res, result);
                    connection.release();
                });
            });
        } else {
            renderJson(res, {
                status: false,
                error: '缺少id参数'
            });
        }
    },
    update: function(req, res, next) {
        var param = req.query || {};
        if (param.name && param.age && param.id) {
            pool.getConnection(function(err, connection) {

                queues(connection, DEBUG);
                var q = connection.createQueue();

                q.query(sql.update, [param.name, param.age, +param.id], function(err, result) {
                    console.log('update-result==============');
                    console.log(result);
                    // 使用页面进行跳转提示
                    if (result.affectedRows > 0) {
                        result = { status: 200 };
                    } else {
                        result = null;
                    }
                    renderJson(res, result);
                });
                q.execute();

                // 在上一操作执行完之前（包括callback）以下操作不会执行
                //q.query()
            });
        } else {
            renderJson(res, {
                status: false,
                error: '缺少参数'
            });
        }
    },
    query: function(req, res, next) {
        var _id = +req.query.id;
        console.log(_id);
        if (_id) {
            pool.getConnection(function(err, connection) {
                connection.query(sql.query, _id, function(err, result) {
                    console.log('query-result==============');
                    console.log(result);
                    if(result && result.length) {
                        result = {
                            status: 200,
                            data: result[0]
                        };
                    } else {
                        result = null;
                    }
                    renderJson(res, result);
                    connection.release();
                });
            });
        } else {
            renderJson(res, {
                status: false,
                error: '缺少参数'
            });
        }
    }
};
