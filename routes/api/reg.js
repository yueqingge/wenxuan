var express = require('express');
const fs = require('fs');
var router = express.Router();
var path = require('path');
let bcrypt = require('../../utils/bcrypt')
var { open } = require('../../utils/mgdb')

router.post('/', async(req, res, next) => {
    console.log('reg')

    //获取 username password nikename icon

    let { username, password, nikename } = req.body;


    //校验必传参数

    if (!username || !password) {
        res.send({ err: 1, msg: '用户名和密码为必传参数' })
        return;
    }


    //参数整理

    nikename = nikename || '新用户';

    let follow = 0;
    let fans = 0;

    let time = Date.now(); //服务器的时间
    let icon = '/upload/default.gif';

    //判断用户是否传了头像
    if (req.files && req.files.length > 0) {
        console.log(1)
        fs.renameSync(
            req.files[0].path,
            req.files[0].path + path.parse(req.files[0].originalname).ext
        )

        icon = '/upload/user/' + req.files[0].filename + path.parse(req.files[0].originalname).ext
    }


    //开库
    open({
        collectionName: 'user'
    }).then(
        ({ collection, client }) => {

            // 找用户名， 
            collection.find({ username }).toArray((err, result) => {

                if (err) {
                    res.send({ err: 1, msg: '集合操作失败，请在重试' })
                    client.close()
                } else {
                    if (result.length === 0) {
                        //没有找到才可注册，注册入库，密码要加密
                        password = bcrypt.hashSync(password)
                        collection.insertOne({
                            username,
                            password,
                            nikename,
                            fans,
                            follow,
                            time,
                            icon
                        }, (err, result) => {

                            if (!err) {
                                res.send({
                                    err: 0,
                                    msg: '成功',
                                    data: {
                                        _id: result.insertedId,
                                        nikename,
                                        fans,
                                        follow,
                                        time,
                                        icon
                                    }
                                })
                            } else {
                                res.send({ err: 1, msg: '集合操作失败，请在重试' })
                            }

                            client.close()

                        })
                    } else {
                        //已存在不可注册  把传送来的磁盘图片删除

                        if (icon.indexOf('default.jpg') === -1) {
                            fs.unlinkSync('./public' + icon)
                        }

                        res.send({ err: 1, msg: '该用户存在' })
                        client.close()
                    }

                }
            })
        }
    ).catch(
        err => {
            res.send(err)
        }
    )




});

module.exports = router;