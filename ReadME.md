### 基于oAuth2.0的简单实现， client客户端资源服务器   server第三方授权服务器. 模拟登录oAuth授权的各个流程

#### 使用说明

作为管理授权服务者应先设置应用权限咯IE表

1. 先在server进行用户注册   --->  类比注册QQ
2. 在server端配置应用权限和路径
3. 创建要接入应用的名称、回调域  ——————>  类比在qq第三方授权网站填写的信息，填完之后可拿到 appId  和appKey
4. 在client中把appId， appKey填入config.js中
