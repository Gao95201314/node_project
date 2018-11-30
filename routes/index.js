var express = require('express');
var multer = require('multer');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var async = require('async');
var upload = multer({ dest: 'C:/tmp' });
var router = express.Router();
var url = 'mongodb://127.0.0.1:27017';
var fs = require('fs');
var path = require('path');


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('login');
});
router.get('/register.html', function(req, res, next) {
    res.render('register');
});
router.get('/index.html', function(req, res, next) {
    res.render('index'); //index.ejs文件后缀可省略
});

router.get('/phone.html', function(req, res, next) {
    res.render('phone');
});
module.exports = router;