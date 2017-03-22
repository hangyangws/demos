var mysql = require('mysql'),
    conf = require('../conf/conf'),
    connect = mysql.createConnection(conf.MYSQL);


connect.query('CREATE TABLE user (' +
        ' id INT AUTO_INCREMENT,' +
        ' name VARCHAR(100) NOT NULL,' +
        ' age INT,' +
        ' PRIMARY KEY(id))',
        function(err, result){
            if (err) {
                console.log(err);
            }
            else {
                console.log(result);
                console.log('CREATE TABLE SUCCESSFULLY!');
                process.exit();
            }
        });

