/**
 * Created by ZhiyuanSun on 15/12/25.
 */
var RestaurantInfo = require('../../models/app/restaurant-info');

var restaurantInfo = new RestaurantInfo();

restaurantInfo.import('../../data/restaurant-info.json',function(err,data){
    if(err){
        console.log(err);
    }
    console.log(data);
});