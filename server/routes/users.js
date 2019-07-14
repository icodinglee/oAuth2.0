var express = require('express');
var router = express.Router();
var gravatar = require('gravatar');
const { User, AccessToken } = require('../model');
var  logger = require('debug')('server-oauth:users')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// 用户注册
router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'signup'});
});

router.post('/signup', async function(req, res, next) {
  let body = req.body;
  body.avator = gravatar.url(body.email) // 通过邮箱获取头像
  let user = new User(body);
  await user.save();
  logger('注册用户成功', user)
  res.redirect('/user/signin');
});

// 登录
router.get('/signin',  async function(req, res, next) {
  res.render('signin', { title: 'signin'});
});

// 获取登录
router.post('/signin', async function(req, res, next) {
  let body = req.body;  // {username, passward, email, gender}
  let oldUser = await User.findOne(body);
  if(oldUser){
    req.session.user = oldUser;
    res.redirect('/')
  }else{
    res.redirect('back')
  }
});


// 退出登录
router.get('/signout', async function(req, res, next) {
    req.session.user = '';
    res.redirect('/users/signin')
});

// 获取用户信息
router.get('/get_user_info', async function(req, res, next) {
  const {  access_token, oauth_consumer_key, openid } = req.query; // oauth_consumer_key： appId
  let  item = await AccessToken.findById(access_token).populate('permissions');
  if(!item){ // token 错误
    return res.json({ error: 'access_token错误'})
  }
  console.log('>>>>>>>', item.permissions);
  let findItem = item.permissions.find(item => item.route === 'get_user_info');
  if(findItem){
    let user = await User.findById(openid);
    res.json(user);
  }else{
    return res.json({ error: '无此项访问权限'})
  }
});

module.exports = router;
