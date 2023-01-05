const mysql = require('mysql2');
const util = require('util');

// config is an object that contains the connection details
const config = {
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE
};

// create a connection to the database
const sqlConnection = mysql.createConnection(config);

/* 1. util.promisify() takes a function that 
   takes a callback as its last argument and returns a function that returns a promise.
   2. For details, see https://nodejs.org/api/util.html#util_util_promisify_original
   3. For details about bind(), see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
*/

const sqlQuery = util.promisify(sqlConnection.execute).bind(sqlConnection);

module.exports = sqlQuery;