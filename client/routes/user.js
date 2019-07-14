var express = require('express');
var router = express.Router();
var queryString = require('querystring');
var request = require('request-promise');
const { AuthorizationUrl, appId, redirect_url, fecthTokenUrl, fecthMeUrl, fecthUserInfo } = require('../config.js');

/* GET users listing. */
router.get('/login', function(req, res, next) {
  var options = {
    response_type: 'code',
    client_id: appId,
    redirect_url,
    state: Date.now(),
    scope: 'get_user_info,list_album'
  }
  const fullAuthorizationUrl = AuthorizationUrl + queryString.stringify(options);
  res.render('login', {title: '登录', fullAuthorizationUrl});
});


router.get('/callback', async function(req, res, next) {
  const { code } = req.query;

  // 获取token
  let options = {
    grant_type: 'authorization_code',
    client_id: appId,
    code,
    redirect_url
  }
  let fullFetchTokenUrl = fecthTokenUrl + queryString.stringify(options);
  let fecthTokenUrlRes = await request(fullFetchTokenUrl);
  let { access_token, expires_in, refresh_token } = queryString.parse(fecthTokenUrlRes);


  // 获取openid
  let fullFetchMeUrl = fecthMeUrl + queryString.stringify({ access_token});
  let fecthMeResult = await request(fullFetchMeUrl);
  // 返回值为 callback( {"client_id":"YOUR_APPID","openid":"YOUR_OPENID"} )， 需要清洗一下数据
  const { openid } = JSON.parse( fecthMeResult.slice(fecthMeResult.indexOf('{'),  fecthMeResult.lastIndexOf('}') + 1) );

  // return res.send(openid);

  // 获取userInfo
  const op = {
      access_token,
      oauth_consumer_key: appId,
      openid
  };
  const fullFecthUserInfoUrl = fecthUserInfo + queryString.stringify(op);
  const userInfo = await request(fullFecthUserInfoUrl); 
  res.send(userInfo)
});

module.exports = router;
