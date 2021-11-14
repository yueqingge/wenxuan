let jwt = require('./jwt');
module.exports = (req, res, next) => {

    //处理公共参数  !address address headers

    req.query._page = req.query._page ? req.query._page - 1 : require('../config/global')._page;
    req.query._limit = req.query._limit ? req.query._limit - 0 : require('../config/global')._limit;
    req.query.q = req.query.q ? req.query.q : require('../config/global').q;
    req.query._sort = req.query._sort ? req.query._sort : require('../config/global')._sort;

    req.body._page = req.body._page ? req.body._page - 1 : require('../config/global')._page;
    req.body._limit = req.body._limit ? req.body._limit - 0 : require('../config/global')._limit;
    req.body.q = req.body.q ? req.body.q : require('../config/global').q;
    req.body._sort = req.body._sort ? req.body._sort : require('../config/global')._sort;


    req.headers._page = req.headers._page ? req.headers._page - 1 : require('../config/global')._page;
    req.headers._limit = req.headers._limit ? req.headers._limit - 0 : require('../config/global')._limit;
    req.headers.q = req.headers.q ? req.headers.q : require('../config/global').q;
    req.headers._sort = req.headers._sort ? req.headers._sort : require('../config/global')._sort;

    // 处理公共授权

    if (/login|reg|logout/.test(req.url)) {
        next()
    } else {
        //校验token是否携带，是否合法
        let token = req.headers.token || req.body.token || req.query.token;
        jwt.verify(token).then(
            decode => {
                console.log(decode)
                req.query.decode = decode;
                next();
            }
        ).catch(
            message => res.send({ err: 2, msg: 'token过期或无效' + message })
        )

    }


}