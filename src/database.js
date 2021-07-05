const mysql = require('mysql');

// createConnection
/* const db  = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'sqllogin'
  });

module.exports = db; */


// pool
let pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  password        : '',
  database        : 'sqllogin'
});

module.exports = pool;