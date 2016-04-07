//lib modules
var express = require("express");
var logger=require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');
var wechat=require('wechat');
var oauth=require('./models/common/global-values').oauthClient;
var async=require('async');

/*var session = require('express-session');
 var MongoStore = require('connect-mongo')(session);*/

//modules defined by myself
var getMenu=require('./api/menu/get-menu');
var getRestaurantInfo = require('./api/restaurant-info/restaurant-info');
var userOrder = require('./api/user-order/user-order');
var globalValue=require('./models/common/global-values');

var app = express();

// Configuration
app.use(express.static(path.join(__dirname, 'app')));
app.set('views', __dirname + '/app');
app.engine('html', require('ejs').renderFile);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.query());
/*app.use(bodyParser());*/

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:9000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use('/menu',getMenu);
app.use('/restaurantInfo', getRestaurantInfo);
app.use('/userOrder', userOrder);

//微信访问
app.get('/app', function(req, res) {
    var code=req.query.code;
    if(code == undefined){
        res.render('404.html');
    }

    var maxTime = 3;
    var count = 0;
    var accessToken = null
    var openId = null;
    async.whilst(
        function(){
            return (accessToken == null) && count<maxTime;
        },
        function(callback){
            //从微信获取最新的access token，并以store[openId]的形式存储在内存中，可以通过getToken(openId)的形式获取。
            oauth.getAccessToken(code, function(err, ret){
                count++;
                if(ret.data !=undefined && ret.data.access_token !=undefined){
                    accessToken = ret.data.access_token;
                    openId = ret.data.openid;
                    callback(null, openId);
                }
            });
        },
        function(err){
            if(err || count >= maxTime){
                res.render('404.html');
            }
            //获取微信用户的其它个人信息
            /*oauth.getUser(openId, function (err,ret) {
             if(err){

             }
             else{
             res.render('index.html',{
             openId:openId
             });
             }
             });*/
            res.render('index.html',{
                openId:openId
            });
        });


});

//浏览器访问
app.get('/bowser', function(req, res) {
    var openId='os1N1v1asWV4hAzEqANL-e2c4E5E';
    res.render('index.html',{
        openId:openId
    });

});


app.use('/wechat', wechat(globalValue.wechatConfig,function(req,res,next){
    // 微信输入信息都在req.weixin上
    var message=req.weixin;

}));

module.exports = app;