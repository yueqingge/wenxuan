var mongodb = require('mongodb');
let mongoCt = mongodb.MongoClient;
let ObjectId = mongodb.ObjectId;


let sql = 'wenxuan'

//链接库

let open = ({ dbName = sql, collectionName, url = 'mongodb://127.0.0.1:27017' }) => {

    return new Promise((resolve, reject) => {
        mongoCt.connect(url, (err, client) => {
            //err 错误 client链接后的客户端
            if (err) {
                reject(err)
            } else {
                let db = client.db(dbName);
                let collection = db.collection(collectionName);
                resolve({ collection, client, ObjectId })
            }
        })
    })

}


// 查列表
let findList = ({
    collectionName, //集合名
    dbName = sql, //库名
    _page,
    _limit,
    _sort,
    q //可选参数
}) => {
    //检索条件
    let rule = q ? { title: eval('/' + q + '/') } : {};
    return new Promise((resolve, reject) => {
        // 开库

        open({
            dbName,
            collectionName
        }).then(
            ({ collection, client }) => {
                // 查询
                collection.find(rule, {
                    sort: {
                        [_sort]: -1
                    },
                    skip: _page * _limit, //跳过
                    limit: _limit
                }).toArray((err, result) => {
                    //reslove|reject出去
                    if (!err && result.length > 0) {
                        resolve({
                            err: 0,
                            msg: '成功',
                            data: result
                        })
                    } else {
                        reject({
                            err: 1,
                            msg: '查不到更多数据'
                        })
                    }

                    client.close(); //关库

                })
            }
        ).catch(
            err => {
                reject({
                    err: 1,
                    msg: '库链接失败'
                });
                client.close()
            }
        )


    })
}

// 查详情
let findDetail = ({
    dbName = sql,
    collectionName,
    _id = null
}) => new Promise((reslove, reject) => {
    //开库 open
    open({
        collectionName,
        dbName
    }).then(
        ({ collection, client }) => {
            //查询 条件_id 判断id的合法性
            if (_id && _id.length === 24) {
                collection.find({
                    _id: ObjectId(_id), //mongodb里面的id是经过包装的
                }, { projection: { _id: 0 } }).toArray((err, result) => {
                    //通过resolve和reject把准确||错误的结果丢出去
                    if (!err && result.length > 0) {
                        reslove({
                            err: 0,
                            msg: '成功',
                            data: result[0]
                        })
                    } else {
                        reject({
                            err: 1,
                            msg: '查无数据'
                        })
                    }
                    client.close()
                })
            } else {
                reject({
                    err: 1,
                    msg: 'id有误'
                })

                client.close()
            }
        }
    )

})

exports.open = open;
exports.findList = findList;
exports.findDetail = findDetail;