const mysql = require('mysql');

const mysqlClient = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Root1234@',
    database: 'attendance'
})

module.exports = (queryText, options) => {
    return new Promise((resolve, reject) => {
        mysqlClient.query(queryText, options, (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}