var express = require('express');
var router = express.Router();
var mdb = require('../db/mongoDb');
var jwt = require('jsonwebtoken');
var MongoClient = require('mongodb').MongoClient;
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var md5 = require('md5');

/* GET users listing. */
router.post('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/registration', function(req, res, next) {
    var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
    var userData = {firstname: req.body.firstname,lastname: req.body.lastname,email: req.body.email,password: md5(req.body.password),token : token,isActive: 0};
    mdb.getConnection(function (err,db) {
            db.collection('Registration').findOne({email: req.body.email},function (err, response) {
                if (err) throw err
                if(response){
                    res.send({"error": "This email id is already registered."});
                }else {
                    db.collection('Registration').insertOne(userData,function (err, result) {
                        if (err) throw err

                        var link = "http://localhost:4200/activate/"+token;
                        var name = "Click Here";
                        var transporter = nodemailer.createTransport(smtpTransport({
                            service: 'gmail',
                            host: 'smtp.gmail.com',
                            auth: {
                                user: 'pradeepk357@gmail.com',
                                pass: 'Pkumar_123'
                            }
                        }));

                        var mailOptions = {
                            from: 'pradeepk357@gmail.com',
                            to: 'pradeepk357@gmail.com',
                            subject: 'Welcome to your new account',
                            html: '<p>Hello User</p><p style="color: #2ECC71;">Thank you for creating an account.</p> <p>Please click on below given link to activate your account.<a href="'+ link +'">'+name+'</a>'
                        };

                        transporter.sendMail(mailOptions, function(error, info){
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Email sent:Sucessfully..');
                            }
                        });

                        res.send(result);
                    })
                }

            })
    })

});
router.post('/login', function(req, res, next) {

    var loginData = {"email": req.body.email,"password": md5(req.body.password),"isActive": 1};

    mdb.getConnection(function (err,db) {
        db.collection('Registration').findOne(loginData,function (err, result) {
            if (err) throw err
            res.send(result);
        })
    })

});
router.post('/activate_user', function(req, res, next) {
    var Activate = {"token": req.body.token,"isActive": 1};

    mdb.getConnection(function (err,db) {
        db.collection('Registration').update({"token": req.body.token},{$set:{"isActive": 1}},function (err, result) {
            if (err) throw err
            res.send(result);
        })
    })

});


module.exports = router;
