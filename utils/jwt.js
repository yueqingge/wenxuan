let jwt = require('jsonwebtoken');
module.exports = {
    sign: ({ username, _id }) => jwt.sign({ username, _id }, '2107', { expiresIn: 60 * 60 * 24 }),
    verify: token => new Promise((resolve, reject) => {
        jwt.verify(token, '2107', (err, decode) => {
            if (!err) {
                resolve(decode)
            } else {
                reject(err.message)
            }
        })
    })
};