module.exports = {
    appId: '5d295f679ed76434cd723656',
    appKey: '4b74b4f7-6dbf-4202-9d05-bcaf4c2a3456',
    redirect_url: 'http://localhost:4000/user/callback',      // 重定向URL(授权登录之后会浏览器会跳转的Url, 跳转时获取的code会附在这个url后面)
    fecthTokenUrl: 'http://localhost:3000/oauth2.0/token?',   // 根据code、appId、appKey、redirect_url 获取access_token
    AuthorizationUrl: 'http://localhost:3000/oauth2.0/authorize?', // 认证、跳转到授权登录页, 获取code
    fecthMeUrl: 'http://localhost:3000/oauth2.0/me?',  // 根据access_token 获取openid
    fecthUserInfo: 'http://localhost:3000/users/get_user_info?' // 根据openid、access_token、appId获取用户信息
} 