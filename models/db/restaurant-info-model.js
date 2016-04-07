/**
 * Created by ZhiyuanSun on 15/12/25.
 */
var mongodb=require('./mongodb');
var Schema=mongodb.mongoose.Schema;

var SeatSchema = new Schema({
    A   :   Number,
    B   :   Number,
    C   :   Number
});

var RestaurantInfoSchema = new Schema({
    restaurantName  :   String,
    seats           :   SeatSchema,
    maxNumPerOrder  :   Number
});


var RestaurantInfo=mongodb.mongoose.model('RestaurantInfo',RestaurantInfoSchema);

module.exports=RestaurantInfo;