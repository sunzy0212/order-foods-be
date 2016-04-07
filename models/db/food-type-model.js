/**
 * Created by ZhiyuanSun on 15/12/4.
 */
var mongodb=require('./mongodb');
var Schema=mongodb.mongoose.Schema;

var foodTypeSchema=new Schema({
    name:{
        type : String,
        required : true,
        unique : true
    }
});

var foodTypeModel=mongodb.mongoose.model('FoodType',foodTypeSchema);

module.exports=foodTypeModel;