/**
 * Created by ZhiyuanSun on 16/1/2.
 */
var express = require('express');
var router = express.Router();
var CommonFun = require('../../models/common/common-func');
var UserOrder = require('../../models/app/user-order');

/*
 @params:    {
                 openId     :   ***
                 foods      :   ***
                 status     :   ***
                 money      :   ***
                 userInfo   :   ***
             }
 */
router.post('/conformUserOrder',function(req, res, next){
    var userOrderIdObj = CommonFun.createUserOrderID();

    var userOrderData = req.body;

    //设置userOrderId和time
    userOrderData.userOrderId = userOrderIdObj.userOrderId;
    userOrderData.time = userOrderIdObj.time;
    userOrderData.paymentMethod = -1;

    //修改status为1: Conformed
    userOrderData.status = 1;

    UserOrder.addAndUpdate(userOrderData)
        .then(function(userOrderId){
            console.log('*************************');
            console.log('*************************');
            console.log('*************************');
            console.log(userOrderId);
            res.status(200).send(userOrderId);
        })
        .catch(function(err){
            console.log('catched the error: ',err);
            res.status(500).send(err);
        });

    console.log(userOrderData);

});

router.post('/conformPayment',function(req, res, next){
    var newProperties = {

    };
    //设置userOrderId和time
    newProperties.time = new Date();

    //修改status为2: paid
    newProperties.status = 2;

    //支付方式
    newProperties.paymentMethod = req.body.paymentMethod;

    UserOrder.update(req.body.userOrderId,newProperties)
        .then(function(userOrderId){
            res.status(200).send(userOrderId);
        })
        .catch(function(err){
            console.log('catched the error: ',err);
            res.status(500).send(err);
        });
});

/*
 @params:    {
                 userOrderId  :   ***
                 status :   ***
             }
 */
router.post('/setUserOrderStatus',function(req, res, next){

    UserOrder.setUserOrderStatus(req.body.userOrderId, req.body.status)
        .then(function(ret){
            console.log(ret);

            res.status(200).send("OK");
        })
        .catch(function(err){
            console.log('catched the error: ',err);

            res.status(500).send("OK");
        });
});

/*
@params:    {
                openId  :   ***
                skipNum :   ***
                limitNum:   ***
            }
*/
router.post('/getUserOrderByOpenIdAndStatus', function(req, res, next){
    UserOrder.getUserOrderByOpenIdAndStatus(req.body.openId, req.body.status, req.body.skipNum, req.body.limitNum)
        .then(function(ret){
            return UserOrder.prototype.createUserOrderAbstract(ret);
        })
        .then(function(ret){
            res.status(200).send(ret);
        })
        .catch(function(err){
            console.log('catched the error: ',err);
            res.status(500).send("Failed");
        });
});

module.exports = router;
