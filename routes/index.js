var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' }); //index.ejs文件后缀可省略
});
router.get('/users.html', function(req, res, next) {
    res.render('users');
});
router.get('/grand.html', function(req, res, next) {
    res.render('grand');
});
router.get('/phone.html', function(req, res, next) {
    res.render('phone');
});
module.exports = router;