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
//手机管理localhost:3000/phone/phone.html
router.get('/phone.html', function(req, res, next) {
    var page = parseInt(req.query.page) || 1; // 页码
    var pageSize = parseInt(req.query.pageSize) || 3; // 每页显示的条数
    var totalSize = 0; // 总条数
    var data = [];
    //将用户列表给列出来
    //操作数据库
    MongoClient.connect(url, { useNewUrlPsrser: true }, function(err, client) {
        if (err) {
            //连接数据库失败
            console.log('连接数据库失败', err);
            res.render('error', {
                message: '连接数据库失败',
                error: err
            });
            return;
        }
        var db = client.db('project');
        async.series([
            function(cb) {
                db.collection('phone').find().count(function(err, num) {
                    if (err) {
                        cb(err);
                    } else {
                        totalSize = num;
                        cb(null);
                    }
                })
            },
            function(cb) {
                db.collection('phone').find().sort({ _id: -1 }).limit(pageSize).skip(page * pageSize - pageSize).toArray(function(err, data) {
                    if (err) {
                        cb(err)
                    } else {
                        // data = data;
                        cb(null, data)
                    }
                })

            },
        ], function(err, results) {
            if (err) {
                res.render('error', {
                    message: '错误',
                    error: err
                })
            } else {
                var totalPage = Math.ceil(totalSize / pageSize); // 总页数

                res.render('phone', {
                    list: results[1],
                    list2: results[2],
                    // totalSize: totalSize,
                    totalPage: totalPage,
                    pageSize: pageSize,
                    currentPage: page
                })
            }
            client.close();
        })
    })
})

//手机删除操作localhost:3000/phone/delete
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
        db.collection('phone').deleteOne({
            _id: ObjectId(id),
        }, function(err, data) {
            // console.log(data);
            if (err) {
                res.render('error', {
                    message: '删除失败',
                    error: err
                })
            } else {
                //删除成功，页面刷新一下，也就是又跳转到phone.ejs页面
                res.redirect('/phone/phone.html');
            }
            client.close();
        })
    })
})

//手机新增localhost:3000/phone/addphone
router.post('/addphone', upload.single('phoneimg'), function(req, res, next) {
    //1.获取前端传递过来的参数
    var phonename = req.body.phonename;
    var phonegrand = req.body.phonegrand;
    var phoneprice = req.body.phoneprice;
    var phoneoldprice = req.body.phoneoldprice;
    // console.log(req.file);
    //如果想要通过浏览器访问到这张图片的话， 需要将图片放到public里面去
    var phoneimg = 'images/' + new Date().getTime() + '_' + req.file.originalname;
    var newphoneimg = path.resolve(__dirname, '../public/', phoneimg);

    try {
        var data = fs.readFileSync(req.file.path);
        fs.writeFileSync(newphoneimg, data);
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
            db.collection('phone').insertOne({
                phonename: phonename,
                phonegrand: phonegrand,
                phoneprice: phoneprice,
                phoneoldprice: phoneoldprice,
                phoneimg: phoneimg
            }, function(err, data) {
                // console.log(data);
                if (err) {
                    res.render('error', {
                        message: '添加失败',
                        error: err
                    })
                } else {
                    //添加成功，页面刷新一下，也就是又跳转到phone.ejs页面
                    res.redirect('/phone/phone.html');
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

//手机查找
router.get('/findandupdate', function(req, res) {
    //1.获取前端传过来的参数
    var page = parseInt(req.query.page) || 1; // 页码
    var pageSize = parseInt(req.query.pageSize) || 3; // 每页显示的条数
    var totalSize = 0; // 总条数
    var data = [];
    var id = req.query.id;
    //2.连接数据库，
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
        if (err) {
            res.render('error', {
                message: '连接失败',
                error: err
            })
            return;
        }
        var db = client.db('project');
        async.series([
            function(cb) {
                db.collection('phone').find().count(function(err, num) {
                    if (err) {
                        cb(err);
                    } else {
                        totalSize = num;
                        cb(null);
                    }
                })
            },
            function(cb) {
                db.collection('phone').find().sort({ _id: -1 }).limit(pageSize).skip(page * pageSize - pageSize).toArray(function(err, data1) {
                    if (err) {
                        cb(err)
                    } else {
                        // data = data;
                        cb(null, data1)
                    }
                })

            },
            function(cb) {
                db.collection('phone').find({
                    _id: ObjectId(id),
                }).toArray(function(err, data2) {
                    // console.log(data);
                    if (err) {
                        cb(err);
                    } else {
                        cb(null, data2)
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

                res.render('update', {
                    list: results[1],
                    list2: results[2],
                    // totalSize: totalSize,
                    totalPage: totalPage,
                    pageSize: pageSize,
                    currentPage: page
                })
            }
            client.close();
        })
    })
})


//手机更新
router.post('/updatephone', upload.single('phoneimg'), function(req, res, next) {
    //1.获取前端传递过来的参数
    var id = req.body.phoneid;
    var phonename = req.body.phonename;
    var phonegrand = req.body.phonegrand;
    var phoneprice = req.body.phoneprice;
    var phoneoldprice = req.body.phoneoldprice;
    // console.log(req.file);
    //如果想要通过浏览器访问到这张图片的话， 需要将图片放到public里面去
    if (req.file) {
        var phoneimg = 'images/' + new Date().getTime() + '_' + req.file.originalname;
        var newphoneimg = path.resolve(__dirname, '../public/', phoneimg);
    }
    try {
        if (req.file) {
            var data = fs.readFileSync(req.file.path);
            fs.writeFileSync(newphoneimg, data);
            //2.连接数据库，修改 如果有上传图片就更新
            MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
                if (err) {
                    res.render('error', {
                        message: '连接失败',
                        error: err
                    })
                    return;
                }
                var db = client.db('project');
                db.collection('phone').updateOne({ _id: ObjectId(id) }, {
                        $set: {
                            phonename: phonename,
                            phonegrand: phonegrand,
                            phoneprice: phoneprice,
                            phoneoldprice: phoneoldprice,
                            phoneimg: phoneimg
                        }
                    },
                    function(err, data) {
                        // console.log(data);
                        if (err) {
                            res.render('error', {
                                message: '更新失败',
                                error: err
                            })
                        } else {
                            //更新成功，页面刷新一下，也就是又跳转到phone.ejs页面
                            res.redirect('/phone/phone.html');
                        }
                        client.close();
                    })
            })
        } else {
            //2.连接数据库， 新增  如果没有上传图片就不更新
            MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
                if (err) {
                    res.render('error', {
                        message: '连接失败',
                        error: err
                    })
                    return;
                }
                var db = client.db('project');
                db.collection('phone').updateOne({ _id: ObjectId(id) }, {
                        $set: {
                            phonename: phonename,
                            phonegrand: phonegrand,
                            phoneprice: phoneprice,
                            phoneoldprice: phoneoldprice
                        }
                    },
                    function(err, data) {
                        // console.log(data);
                        if (err) {
                            res.render('error', {
                                message: '更新失败',
                                error: err
                            })
                        } else {
                            //更新成功，页面刷新一下，也就是又跳转到phone.ejs页面
                            res.redirect('/phone/phone.html');
                        }
                        client.close();
                    })
            })
        }

    } catch (error) {
        res.render('error', {
            message: '更新失败',
            error: err
        })
    }
});


module.exports = router;