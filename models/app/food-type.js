/**
 * Created by ZhiyuanSun on 15/12/4.
 */
var foodTypeModel=require('../db/food-type-model');
var OrderException=require('./order-exception');
var async = require('async');

function FoodType(){

};

module.exports=FoodType;

FoodType.prototype.getFoodTypeByName=function(typeName,callback){
    foodTypeModel.findOne({'name':typeName},function(err,doc){
        if(err){
            callback(err);
        }
        callback(err,doc);
    });
};

FoodType.prototype.getAllFoodType=function(callback){
    var fields={
        name: 1
    };
    foodTypeModel.find({},fields,function(err,doc){
        if(err){
            callback(err);
        }
        var typeRet=new Array();
        doc.forEach(function(foodTypeItem){
            typeRet.push(foodTypeItem.name);
        });
        callback(err,typeRet);
    });
};

FoodType.prototype.addFoodType=function(foodTypes, callback){
    var length = foodTypes.length;
    var count = 0;
    async.whilst(
        function(){
            return count < length;
        },
        function(callback){
            addOneFoodType(foodTypes[count], callback);
            count++;
        },
        function(err){
            callback(err);
        }
    )
};

function addOneFoodType(foodType, callback){
    foodTypeModel.findOne({'name':foodType},function(err,doc){
        if(err){
            callback(err);
        }
        if(!doc){
            foodTypeModel.create({'name':foodType},function(err,createRet){
                callback(err,createRet);
            });
        }
        else{
            callback(null);
        }
    });
}