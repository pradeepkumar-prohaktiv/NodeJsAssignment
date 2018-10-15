var express = require('express');
var router = express.Router();
var mdb = require('../db/mongoDb');
/* GET home page. */
router.get('/', function(req, res, next) {
     mdb.getConnection(function (err,db) {
        db.collection('mycollection').findOne({},function (err, result) {
            if (err) throw err

            res.send(result);
        })
    })

});

module.exports = router;
