var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var async = require('async');
var router = express.Router();

/* GET users listing. */
var url = 'mongodb://127.0.0.1:27017';
router.get('/', function(req, res, next) {
        var page = parseInt(req.query.page) || 1; // 页码
        var pageSize = parseInt(req.query.pageSize) || 5; // 每页显示的条数
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
                    db.collection('user').find().count(function(err, num) {
                        if (err) {
                            cb(err);
                        } else {
                            totalSize = num;
                            cb(null);
                        }
                    })
                },
                function(cb) {
                    // limit()
                    // skip()
                    // 1 - 0     page * pageSize - pageSize
                    // 2 - 5
                    db.collection('user').find().limit(pageSize).skip(page * pageSize - pageSize).toArray(function(err, data) {
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

                    res.render('users', {
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
    //登录操作
router.post('/login', function(req, res) {
    //1.获取前端传递过来的参数
    var username = req.body.name;
    var password = req.body.pwd;
    //2.验证参数的有效性
    if (!username) {
        res.render('error', {
            message: '用户名不能为空',
            error: new Error('用户名不能为空')
        })
        return;
    }
    if (!password) {
        res.render('error', {
            message: '密码不能为空',
            error: new Error('密码不能为空')
        })
        return;
    }

    //3.链接数据库做验证，是否允许登录
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
            if (err) {
                console.log('连接失败', err);
                res.render('error', {
                    mmessage: '连接失败',
                    error: err
                })
                return;
            }
            var db = client.db('project');
            /* db.collection('user').find({ //根据条件查找用户名和密码
                username: username,
                password: password
            }).count(function(err, num) { //查找条数，
                if (err) {
                    console.log('查询失败');
                    res.render('error', {
                        mmessage: '查询失败',
                        error: err
                    })
                } else if (num > 0) { // num>0表示有这么一个数据
                    // 登录成功
                    // res.render('index'); //这样只是渲染首页，uri地址没有变，是/user/login这样的地址，而首页的地址是index.htnl    
                    //则需要重定向 注意：如果直接使用render（），页面地址不会改变。
                    //登录成功，写入cookie
                    res.cookie('nickname',)
                    res.redirect('/index.html');
                } else {
                    //登录失败
                    console.log('登录失败');
                    res.render('error', {
                        meaasge: '登录失败',
                        error: new Error('登录失败')
                    })
                }
                client.close();
            }) */
            db.collection('user').find({
                username: username,
                password: password
            }).toArray(function(err, data) { //data是一个数组
                if (err) {
                    console.log('查询失败', err);
                    res.render('error', {
                        message: '查询失败',
                        error: err
                    })
                } else if (data.length <= 0) {
                    //没找到，登录失败
                    res.render('error', {
                        message: '登录失败',
                        error: new Error('登录失败')
                    })
                } else {
                    //登录成功
                    //cookier操作
                    res.cookie('nickname', data[0].nickname, {
                        maxAge: 60 * 60 * 1000 //毫秒
                    })
                    res.redirect('/index.html');
                }
                client.close();

            })
        })
        // res.send('');//注意这里：因为mongodb的操作是异步操作，
        //则会先执行这里再会执行上面的代码，所以就会出错。
})



//注册操作localhost：3000/users/register
router.post('/register', function(req, res) {
    //1.获取前端传递过来的参数
    var name = req.body.name;
    var pwd = req.body.pwd;
    var nickname = req.body.nickname;
    var age = parseInt(req.body.age);
    var sex = req.body.sex;
    var isAdmin = req.body.isAdmin === '是' ? true : false;
    //2.验证参数的有效性
    if (!name) {
        res.render('error', {
            message: '用户名不能为空',
            error: new Error('用户名不能为空')
        })
        return;
    }
    if (!pwd) {
        res.render('error', {
            message: '密码不能为空',
            error: new Error('密码不能为空')
        })
        return;
    }
    if (!nickname) {
        res.render('error', {
            message: '昵称不能为空',
            error: new Error('昵称不能为空')
        })
    }
    if (!age) {
        res.render('error', {
            message: '年龄不能为空',
            error: new Error('年龄不能为空')
        })
    }
    if (!age) {
        res.render('error', {
            message: '年龄不能为空',
            error: new Error('年龄不能为空')
        })
    }
    //3.链接数据库做验证，是否允许注册
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
                db.collection('user').find({ username: name }).count(function(err, num) {
                    if (err) {
                        cb(err);
                    } else if (num > 0) {
                        //这个用户名已经注册过了
                        cb(new Error('已经注册了'));
                    } else {
                        cb(null);
                    }
                })
            },
            function(cb) {
                db.collection('user').insertOne({
                    username: name,
                    password: pwd,
                    nickname: nickname,
                    age: age,
                    sex: sex,
                    isAdmin: isAdmin
                }, function(err) {
                    if (err) {
                        cb(err);
                    } else {
                        cb(null);
                    }
                })
            }
        ], function(err, result) {
            if (err) {
                res.render('error', {
                    message: '错误',
                    error: err
                })
            } else {
                res.redirect('/');
            }
            //不管成功或失败
            client.close();
        })
    })
})



//删除操作localhost:3000/user/delete
router.get('/delete', function(req, res) {
        //1.获取前端传递过来的参数
        var id = req.query.id;
        //2.链接数据库， 删除
        MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
            if (err) {
                res.render('error', {
                    message: '连接失败',
                    error: err
                })
                return;
            }
            var db = client.db('project');
            db.collection('user').deleteOne({
                _id: ObjectId(id),
            }, function(err, data) {
                console.log(data);
                if (err) {
                    res.render('error', {
                        message: '删除失败',
                        error: err
                    })
                } else {
                    //删除成功，页面刷新一下，也就是又跳转到users.ejs页面
                    res.redirect('/users');
                }
                client.close();
            })
        })
    })
    //搜索操作localhost:3000/user/search
router.get('/search', function(req, res) {
    var name = req.query.name;
    // console.log(name);
    var filter = new RegExp(name);
    var page = parseInt(req.query.page) || 1; // 页码
    var pageSize = parseInt(req.query.pageSize) || 5; // 每页显示的条数
    var totalSize = 0; // 总条数
    var data = [];
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
                db.collection('user').find({
                    nickname: filter
                }).count(function(err, num) {
                    if (err) {
                        cb(err);
                    } else {
                        totalSize = num;
                        cb(null);
                    }
                })
            },
            function(cb) {
                db.collection('user').find({
                    nickname: filter
                }).limit(pageSize).skip(page * pageSize - pageSize).toArray(function(err, data) {
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

                res.render('users', {
                    list: results[1],
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
module.exports = router;