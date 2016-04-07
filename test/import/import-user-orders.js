/**
 * Created by ZhiyuanSun on 15/12/12.
 */
var UserOrders = require('../../models/app/user-order');

var userOrder = new UserOrders();

userOrder.import('../../data/user-orders.json',function(err,data){
    if(err){
        console.log(err);
    }
    console.log(data);
});