const db = require('../services/db');

function getAll(callback) {
    db.connection.query('select * from laptops', function(err, results, fields) {
        callback(results)
    });
}

module.exports = {
    getAll
}