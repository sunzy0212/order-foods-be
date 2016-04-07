/**
 * Created by ZhiyuanSun on 15/12/10.
 */
var oauthClient = require('../common/global-values').oauthClient;
var wechatApi = require('../common/global-values').wechatApi;
var fs=require('fs');

function WechatMenu(path){
    this.menuFilePath = path;
};

module.exports = WechatMenu;


WechatMenu.prototype.createMenu = function(callback){
    fs.readFile(this.menuFilePath,'utf8',function(err,data){
        if(err){
            callback(err);
        }
        var wechatMenuData = JSON.parse(data);

        //遍历保存微信菜单的json对象
        var firstLevelObj = wechatMenuData.button;
        for(var i_first = 0; i_first < firstLevelObj.length; i_first++){
            if(firstLevelObj[i_first].hasOwnProperty("sub_button")){
                var secondLevelObj = firstLevelObj[i_first].sub_button;
                for(var i_second = 0; i_second < secondLevelObj.length; i_second++){
                    //设置view事件的Url
                    if(secondLevelObj[i_second].type == "view"){
                        secondLevelObj[i_second].url = oauthClient.getAuthorizeURL(secondLevelObj[i_second].url,'','snsapi_userinfo');
                    }
                }
            }
        }

        //获取access_token
        wechatApi.getLatestToken(function(err,token){
            if(err){
                callback(err);
            }
            wechatApi.createMenu(wechatMenuData,function(err,ret){
                callback(err,ret);
            });
        });
    });
};