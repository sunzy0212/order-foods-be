/**
 * Created by ZhiyuanSun on 15/12/25.
 */
var RestaurantInfoModel = require('../db/restaurant-info-model');
var CommonFun = require('../common/common-func');
var fs = require('fs');
var async = require('async');

function RestaurantInfo(){

}

module.exports = RestaurantInfo;

RestaurantInfo.prototype.getRestaurantInfo = function(callback){
    RestaurantInfoModel.findOne({}, function(err, doc){
        callback(err, doc);
    });
};

RestaurantInfo.prototype.import = function(restaurantInfoFile, callback){
    var that = this;
    fs.readFile(restaurantInfoFile,'utf8',function(err,data){
        if(err){
            callback(err);
        }
        var restaurantInfoData = JSON.parse(data);

        var count=0;
        var length=restaurantInfoData.length;
        async.whilst(
            function(){
                return count<length;
            },
            function(callback){
                that.addAndUpdate(restaurantInfoData[count],callback);
                count++;
            },
            function(err,n){
                callback(err);
            });
    });
};

RestaurantInfo.prototype.addAndUpdate = function(restaurantInfoRecord, callback){
    RestaurantInfoModel.findOne({'restaurantName':restaurantInfoRecord.restaurantName}, function(err, doc){
        if(err){
            callback(err);
        }
        else{
            if(doc){
                try{
                    CommonFun.copyARecordTo(restaurantInfoRecord,doc);
                }
                catch (err){
                    callback(err);
                }
                doc.save();
                callback(null, doc);
            }
            else{
                RestaurantInfoModel.create(restaurantInfoRecord,function(err, ret){
                    callback(err, ret);
                })
            }
        }
    })
};
