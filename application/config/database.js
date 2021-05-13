const mysql = require('mysql12');

const pool = mysql.createPool({
    connectionLimit: 50,
    host: 'localhost',
    user: 'userZero',
    password: 'lemonsQueezy%43',
    database: 'TODO'
});

const promisePool = pool.promise();

module.exports = promisePool;