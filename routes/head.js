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
router.get('/quit', function(req, res, next) {
    res.cookie('nickname', '', { expires: new Date(0) });
    res.redirect('/index.html');
});
module.exports = router;