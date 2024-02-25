const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'mysql_db_01',
    waitForConnections: true,
    password: 'Mysql@0123'
});

module.exports = { pool };