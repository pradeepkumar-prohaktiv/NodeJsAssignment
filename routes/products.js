var express = require('express');
var router = express.Router();
var mdb = require('../db/mongoDb');

/* GET users listing. */
router.get('/', function(req, res, next) {
      mdb.getConnection(function (err,db) {
        db.collection('Products').find().toArray(function (err, products) {
            res.send(products);
        })
    })
});
router.post('/user_product', function(req, res, next) {
    mdb.getConnection(function (err,db) {
        db.collection('User_products').find({"user_id":req.body.user_id}).toArray(function (err, products) {
            res.send(products);
        })
    })
});

router.post('/add_product', function(req, res, next) {
    mdb.getConnection(function (err,db) {
        // var userProduct = {user_id: req.body.user_id,id: req.body.id,name: req.body.product_name,description: req.body.product_description};
        db.collection('User_products').insert(req.body,function (err, result) {
            res.send(result);
        })
    })
});


module.exports = router;
