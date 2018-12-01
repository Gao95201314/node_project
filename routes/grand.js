var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: 'C:/tmp' });
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var async = require('async');
var url = 'mongodb://127.0.0.1:27017';
var fs = require('fs');
var path = require('path');


/* GET home page. */
//品牌管理
router.get('/grand.html', function(req, res, next) {
    var page = parseInt(req.query.page) || 1; // 页码
    var pageSize = parseInt(req.query.pageSize) || 3; // 每页显示的条数
    var totalSize = 0; // 总条数
    var data = [];
    //将用户列表给列出来
    //操作数据库
    MongoClient.connect(url, { useNewUrlPsrser: true }, function(err, client) {
        if (err) {
            //链接数据库失败
            console.log('链接数据库失败', err);
            res.render('error', {
                message: '连接数据库失败',
                error: err
            });
            return;
        }
        var db = client.db('project');
        async.series([
            function(cb) {
                db.collection('grand').find().count(function(err, num) {
                    if (err) {
                        cb(err);
                    } else {
                        totalSize = num;
                        cb(null);
                    }
                })
            },
            function(cb) {
                db.collection('grand').find().sort({ _id: -1 }).limit(pageSize).skip(page * pageSize - pageSize).toArray(function(err, data) {
                    if (err) {
                        cb(err)
                    } else {
                        // data = data;
                        cb(null, data)
                    }
                })

            }
        ], function(err, results) {
            if (err) {
                res.render('error', {
                    message: '错误',
                    error: err
                })
            } else {
                var totalPage = Math.ceil(totalSize / pageSize); // 总页数

                res.render('grand', {
                    list: results[1],
                    // totalSize: totalSize,
                    totalPage: totalPage,
                    pageSize: pageSize,
                    currentPage: page
                })
            }
        })
    })
})

//品牌删除操作localhost:3000/user/delete
router.get('/delete', function(req, res) {
    //1.获取前端传递过来的参数
    var id = req.query.id;
    //2.连接数据库， 删除
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
        if (err) {
            res.render('error', {
                message: '连接失败',
                error: err
            })
            return;
        }
        var db = client.db('project');
        db.collection('grand').deleteOne({
            _id: ObjectId(id),
        }, function(err, data) {
            // console.log(data);
            if (err) {
                res.render('error', {
                    message: '删除失败',
                    error: err
                })
            } else {
                //删除成功，页面刷新一下，也就是又跳转到grand.ejs页面
                res.redirect('/grand/grand.html');
            }
            client.close();
        })
    })
})

//品牌新增
router.post('/addgrand', upload.single('grandlogo'), function(req, res, next) {
    //1.获取前端传递过来的参数
    var grandname = req.body.grandname;
    // console.log(req.file);
    //如果想要通过浏览器访问到这张图片的话， 需要将图片放到public里面去
    var grandlogo = 'images/' + new Date().getTime() + '_' + req.file.originalname;
    var newgrandlogo = path.resolve(__dirname, '../public/', grandlogo);
    try {
        var data = fs.readFileSync(req.file.path);
        fs.writeFileSync(newgrandlogo, data);
        //2.连接数据库， 新增
        MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
            if (err) {
                res.render('error', {
                    message: '连接失败',
                    error: err
                })
                return;
            }
            var db = client.db('project');
            db.collection('grand').insertOne({
                grandname: grandname,
                grandlogo: grandlogo
            }, function(err, data) {
                console.log(data);
                if (err) {
                    res.render('error', {
                        message: '添加失败',
                        error: err
                    })
                } else {
                    //添加成功，页面刷新一下，也就是又跳转到grand.ejs页面
                    res.redirect('/grand/grand.html');
                }
                client.close();
            })
        })
    } catch (error) {
        res.render('error', {
            message: '添加失败',
            error: err
        })
    }
});

module.exports = router;