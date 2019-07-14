var express = require('express');
var router = express.Router();
var querystring = require('querystring');
const { Application, Permission, AuthorizationCode, AccessToken, User} = require('../model');
const uuid = require('uuid');

//< ------授权服务器构建授权应用相关部分--------->

// 创建应用
router.get('/application', function(req, res, next) {
  res.render('application', { title: '创建客户端应用'});
});

router.post('/application', async function(req, res, next) {
  let body = req.body // website redirect_url
  body.appKey = uuid.v4();
  let application = new Application(body);
  await application.save();
  res.redirect('/');
});

// 查看应用
router.get('/applications', async function(req, res, next) {
  let applications = await Application.find();
  res.render('applications', { title: '查看客户端应用', applications});
});


// 获取权限
router.get('/permissions', async function(req, res, next) {
  let permissions = await Permission.find();
  res.render('permissions', { title: '查看权限', permissions});
});


// 创建权限页面
router.get('/permission', async function(req, res, next) {
  res.render('permission', { title: '添加权限'});
});

// 生成权限
router.post('/permission', async function(req, res, next) {
  let body = req.body;
  await Permission.create(body)
  res.redirect('/oauth2.0/permissions');
});


// <------------授权流程相关-------------->

/* GET users listing. */
router.get('/authorize', async function(req, res, next) {
  // scope get_user_info, 
  let { client_id, redirect_url, scope = 'get_user_info' } = req.query;
  let application = await Application.findById(client_id);
  if(application.redirect_url !== redirect_url){
    return next(new Error('参数中的url与注册时不匹配'))
  }
  // 根据scope查询 persmission
  let query = {$or: scope.split(',').map(route => ({route}) )};
  let permissions = await Permission.find(query);
  res.render('oauth', { title: 'oAuth', permissions, website: application.website});
});

router.post('/authorize', async function(req, res, next) {
  // scope get_user_info, 
  let {permissions = [], username, password} = req.body;
  let { client_id, redirect_url } = req.query;
  if(!Array.isArray(permissions)){
    permissions = [permissions]
  }
  let user;
  if(username && password){ // 未登录
    user = await User.findOne({username, password});
    req.session.user = user;
  }else if(req.session.user){ // 已登录
    user = req.session.user._id; // 从会话中获取用户id
  }
  if(!user){
    return res.json({error: '用户名和密码错误！'})
  }

  // 生成授权码
  let authorizationCode = await AuthorizationCode.create({
    appId: client_id,
    permissions,
    user
  });

  redirect_url = decodeURIComponent(redirect_url);
  let redirectTo = redirect_url + (redirect_url.indexOf('?') === -1 ? '?' : '') + 'code=' + authorizationCode._id;
  res.redirect(redirectTo);
});

// 获取token
router.get('/token', async function(req, res, next) {
  let {  client_id, code, redirect_url } = req.query
  let authorizationCode = await AuthorizationCode.findById(code)
   // 需要校验 授权码是否正确
   if(!authorizationCode ||  Date.now() - authorizationCode.createAt.getTime() > 10 * 60 * 10000 || authorizationCode.isUsed){ // 授权码无效
    return next(new Error('授权码失效或者已被使用'))
   }
   let accessToken = new AccessToken({
     appId: client_id,
     refresh_token: uuid.v4(),
     permissions: authorizationCode.permissions,
     user: authorizationCode.user
   })
   await accessToken.save();
   authorizationCode.isUsed = true; //把授权码设置为已使用
   await authorizationCode.save();

   // 返回token   access_token=Gghgjh&expires_in=729481398&refresh_token=7878899
   let options = {
     access_token: accessToken._id.toString(),
     expires_in: 60 * 60 * 24 * 30 * 3,
     refesh_token: accessToken.refresh_token
   }
   res.send(querystring.stringify(options));
});

// 获取openid
router.get('/me', async function(req, res, next) {
  let { access_token } = req.query;
  let accessToken = await AccessToken.findById(access_token);
  // callback({client_id: 'appid', openid: 'openid'})
  let options = {
    client_id: accessToken.appId,
    openid: accessToken.user.toString() // 用户的真实id
  }
  res.send(`callback(${JSON.stringify(options)})`);
});


module.exports = router;
