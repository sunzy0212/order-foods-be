var OAuth=require('wechat-oauth')
var WechatApi=require('wechat-api');

var config={
    token:          'order_food_wechat_hybrid_app',
    appid:          'wx8802127829e580bb',
    encodingAESKey: 'k2XZcERrRAaqKA4gFu0O6mSar61bVa8ZvYWTto9Zhbj',
    appsecret:      'd4624c36b6795d1d99dcf0547af5443d'
};

var oauth = new OAuth(config.appid,config.appsecret);
var api = new WechatApi(config.appid,config.appsecret);

module.exports={
    wechatConfig:   config,
    oauthClient:    oauth,
    wechatApi:      api
};