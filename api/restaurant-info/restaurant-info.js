/**
 * Created by ZhiyuanSun on 15/12/25.
 */

var express = require('express');
var router = express.Router();
var RestaurantInfo = require('../../models/app/restaurant-info');

var app = require('../../app');

router.get('/GetRestaurantInfo', function(req, res, next){
    var restaurantInfo = new RestaurantInfo();
    restaurantInfo.getRestaurantInfo(function(err, data){
        if(err){
            res.status(500).send('获取餐厅数据失败');
        }
        else{
            res.status(200).send(data);
        }
    });
});

module.exports = router;