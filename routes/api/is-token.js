var express = require('express');
var router = express.Router();

//token校验
router.get('/', function(req, res, next) {
  res.send({err:0,msg:'tokenok'})
});

module.exports = router;
