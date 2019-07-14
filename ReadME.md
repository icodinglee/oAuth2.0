###基于oAuth2.0的简单实现

#### client客户端资源服务器, server第三方授权服务器. 模拟登录oAuth授权的各个流程

#### 启动
** 该项目基于node及mongodb， 启动前请先安装**
```
cd client
npm install && npm start

cd server
npm install && npm start
```

#### 使用说明

1. 启动后先在server进行用户注册   --->  类比注册QQ
2. 在server端配置应用权限和路径
3. 创建要接入应用的名称、回调域  ——————>  类比在qq第三方授权网站填写的信息，填完之后可拿到 appId  和appKey
4. 在client中把appId， appKey填入config.js中
5. 在client登录页面，点击第三方登录，进行第三方授权页面
6. sever使用了sesssion保持会话，如果用户已登录，可点击头像下按钮直接登录，如果未登录，需填写在第一步注册的账号密码进行登录  ————————> 类比qq授权登录
7. 授权成功后可拿到用户的信息json

注： 前端表单还未做相关验证

#### 授权流程
