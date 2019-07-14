const mongoose = require('mongoose');
let connection = mongoose.createConnection('mongodb://localhost/oauth');
let Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

// 用户信息
exports.User = connection.model('User', new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    avator: String,
    gender: { type: Number, default: 1} // 1 男 0 女
}))

// 应用信息  存放第三方的信息  appId appKey  _id = appId
exports.Application = connection.model('Application', new Schema({
    appKey: {type: String, required: true}, 
    website: {type: String, required: true},  // 网站名称
    redirect_url: {type: String, required: true} //此应用的回调地址
}))

// 授权码 -- 登录之后授权码 把mongdb生成的id 当初授权码 _id = code 有效期 10 分钟
exports.AuthorizationCode = connection.model('AuthorizationCode', new Schema({
    appId: {type: String, required: true}, // 来自哪个客户端需要我的授权   appId
    createAt: {type: Date, default: Date.now}, // 创建时间
    user: {type: ObjectId, ref: 'User'},  // 外链 用户
    isUsed: { type: Boolean, default: false}, // 授权码只能被使用一次
    permissions: [{type: ObjectId, ref: 'Permission'}]     // 外键的数组
}))

// access_token 有效期三个月
exports.AccessToken = connection.model('AccessToken', new Schema({
    appId: {type: String, required: true}, // 客户端appId
    refresh_token: {type: String, required: true}, // 刷新token
    createAt: {type: Date, default: Date.now}, // 创建时间
    user: {type: ObjectId, ref: 'User'}, // 外链 用户
    permissions: [{type: ObjectId, ref: 'Permission'}]     // 外键的数组
}))

// 权限
exports.Permission = connection.model('Permission', new Schema({
    name: {type: String, required: true}, // 权限名称 昵称 头像 
    route: {type: String, required: true} // 相应权限的数据请求地址  /user/get_user_info
}))

