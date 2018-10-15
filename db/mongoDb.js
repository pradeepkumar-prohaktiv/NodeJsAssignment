var MongoClient = require('mongodb').MongoClient;
// var db = '';
module.exports.getConnection = function (cb) {
    MongoClient.connect('mongodb://localhost:27017/',{ useNewUrlParser: true }, function (err, client) {
        if (err) throw err
        return cb(null,client.db('test'));

    });
}
// module.exports = db;