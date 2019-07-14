var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('user/login')
 //  res.render('index', { title: 'oAuth模拟' });
});

module.exports = router;
