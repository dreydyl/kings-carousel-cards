const mysql = require('mysql2');

const pool = mysql.createPool({
    connectionLimit: 50,
    waitForConnections: true,
    host: 'localhost',
    user: 'root',
    password: 'lemonsQueezy%43',
    database: 'csc317db'
    //debug: true
});

const promisePool = pool.promise();

module.exports = promisePool;