/**
 * Created by ZhiyuanSun on 15/12/12.
 */
var userOrderModel = require('../db/user-order-model');
var CommonFun = require('../common/common-func');
var Menu = require('./menu');
var fs = require('fs');
var async=require('async');
var Q = require('q');
var EventProxy = require('eventproxy');

function UserOrder(){

};

module.exports = UserOrder;

//从json文件中导入用户的订单记录到数据库
UserOrder.prototype.import = function(path, callback){
    var that = this;
    fs.readFile(path,'utf8',function(err, data){
        if(err){
            callback(err);
        }
        var UserOrderData = JSON.parse(data);

        var count = 0;
        var length = UserOrderData.length;
        async.whilst(
            function(){
                return count < length;
            },
            function(callback){
                that.addAndUpdate(UserOrderData[count], callback);
                count++;
            },
            function(err, n){
                if(err){
                    callback(err);
                }
                else{
                    callback(null,true);
                }
            });
    });
};

//添加新纪录，如果userOrderId已经存在，则修改原有的记录
UserOrder.addAndUpdate = function(userOrder){
    var query = {
        userOrderId : userOrder.userOrderId
    };

    var options = {
        upsert      : true,
        multi       : false,
        overwrite   : true      //update-only
    };

    var deferred = Q.defer();

    userOrderModel.update(query, userOrder, options, function(err, raw){
        if(err){
            deferred.reject(new Error(err));
        }
        else{
            deferred.resolve(userOrder.userOrderId);
        }
    });

    return deferred.promise;
};

UserOrder.update = function(userOrderId, newProperties){
    var query = {
        userOrderId     :   userOrderId
    };

    var options = {
        upsert      : true,
        multi       : false,
        overwrite   : true      //update-only
    };

    var deferred = Q.defer();

    userOrderModel.update(query, {$set: newProperties}, options, function(err, raw){
        if(err){
            deferred.reject(new Error(err));
        }
        else{
            deferred.resolve(userOrderId);
        }
    });

    return deferred.promise;
};

UserOrder.setUserOrderStatus = function(parUserOrderId, parStatus){
    var query = {
        userOrderId : parUserOrderId
    };

    var options = {
        upsert      : true,
        multi       : false,
        overwrite   : true      //update-only
    };

    var updates = {
        $set : {
            status : parStatus
        }
    };

    var deferred = Q.defer();

    userOrderModel.update(query, updates, options, function(err, raw){
        if(err){
            deferred.reject(new Error(err));
        }
        else{
            deferred.resolve(raw);
        }
    });

    return deferred.promise;
};

UserOrder.getUserOrderByOpenIdAndStatus = function(parOpenId, status, skipNum, limitNum){
    var query = {
        openId : parOpenId
    };
    if(status !== 0){
        query.status = status
    }

    var sortObj = {
        status : -1,
        time : -1
    };

//    var selectFeilds = '';

    var deferred = Q.defer();

    userOrderModel.find(query).sort(sortObj).skip(skipNum).limit(limitNum).exec(function(err, ret){
        if(err){
            deferred.reject(new Error(err));
        }
        else{
            deferred.resolve(ret);
        }
    });

    return deferred.promise;
};

UserOrder.prototype.createUserOrderAbstract = function(userOrders){
    var ret = [];
    var ep = new EventProxy();
    var deferred = Q.defer();
    ep.after('construct_abstract_item', userOrders.length, function(list){
        console.log(list);
        deferred.resolve(list);
    });
    userOrders.forEach(function(item){
        if(item.foods.length == 0){
            deferred.reject(new Error('空订单'));
        }

        Menu.prototype.getFood(item.foods[0].foodName)
            .then(function(food){
                var ORDER_PROCESS_TYPE = [
                    "未确认",
                    "未付款",
                    "待评价",
                    "交易完成"
                ];

                var orderAbstractItem = {
                    orderId : item.userOrderId,
                    status : ORDER_PROCESS_TYPE[item.status],
                    orderTime : CommonFun.dateToString(item.time),
                    totalMoney : item.money.beforeDiscountMoney - item.money.discountMoney,
                    totalNum : item.totalNum,
                    displayFoodName : food.name,
                    displayFoodImg : food.img
                };

                ret.push(orderAbstractItem);
                ep.emit('construct_abstract_item', orderAbstractItem);
            },function(err){
                deferred.reject(err);
            });
    });
    return deferred.promise;
};
