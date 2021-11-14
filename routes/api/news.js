var express = require('express');
var router = express.Router();
// var findList = require("../../utils/mgdb").findList
var { findList, findDetail } = require("../../utils/mgdb")

router.get('/:newsname', function(req, res, next) {


    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
    // res.setHeader('Access-Control-Allow-Origin', "http://localhost:8848")

    //所有新闻类型列表
    // console.log('news1',req.params);

    //判断查询字符串里面是否含有_id ,交给下一个接口
    if (req.query._id) {
        console.log(1);
        res.redirect(`/api/news/${req.params.newsname}/${req.query._id}`)
        return;
    }

    let collectionName = req.params.newsname;
    let { _page, _limit, _sort, q } = req.query;

    findList({
        collectionName,
        _page,
        _limit,
        _sort,
        q
    }).then(
        result => res.send(result)
    ).catch(
        err => res.send(err)
    )



});


router.get('/:newsname/:_id', function(req, res, next) {
    //所有新闻类型详情
    console.log('news2', req.params)

    let collectionName = req.params.newsname;
    let _id = req.params._id;

    findDetail({ collectionName, _id }).then(
        result => res.send(result)
    ).catch(
        err => res.send(err)
    )
});

module.exports = router;