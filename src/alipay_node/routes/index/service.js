/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-07-18.
 */

module.exports = {
    init: function(req, res) {
        res.render('index/index', {
            name: 'hangyangws',
            title: 'index'
        });
    }
}
