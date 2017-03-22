/**
 * [user表操作相应sql语句]
 */

var userDao = {
    add:'INSERT INTO user(id, name, age) VALUES(0, ?, ?)',
    delete: 'DELETE FROM user WHERE id=?',
    update:'UPDATE user SET name=?, age=? WHERE id=?',
    query: 'SELECT * FROM user WHERE id=?'
};

module.exports = userDao;
