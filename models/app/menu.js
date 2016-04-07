/**
 * Created by ZhiyuanSun on 15/12/3.
 */
var menuModel=require('../db/menu-model');
var foodTypeModel=require('../db/food-type-model');
var OrderException=require('./order-exception');
var fs=require('fs');
var EventProxy=require('eventproxy');
var FoodType=require('./food-type');
var async=require('async');
var Q = require('q');

function Menu(){

};

module.exports=Menu;

//获取所有的菜
Menu.prototype.getAllFoods=function(callback){
    menuModel.find({},function(err,doc){
        if(err){
            callback(err);
        }
        else{
            callback(null,doc)
        }
    });
};

//获取n个项
Menu.prototype.getNFoods=function(n){

};

Menu.prototype.getFood = function(foodName){
    var deferred = Q.defer();
    menuModel.findOne({'name':foodName},function(err, ret){
        if(err){
            deferred.reject(new Error(err));
        }
        else{
            deferred.resolve(ret);
        }
    });
    return deferred.promise;
};

Menu.prototype.importMenu=function(menufile,callback){
    fs.readFile(menufile,'utf8',function(err,data){
        if(err){
            callback(err);
        }
        var menuData = JSON.parse(data);

        var count=0;
        var length=menuData.length;
        async.whilst(
            function(){
                return count<length;
            },
            function(callback){
                addMenuRecord(menuData[count],callback);
                count++;
            },
            function(err,n){
                callback(err);
            });
    });
};

Menu.prototype.addFood = function(food,callback){
    menuModel.findOne({'name':food.name},function(err,doc){
        if(err){
            callback(err);
        }
        if(doc){
            throw new OrderException(10001,'该菜已经在我们的菜单数据库中了，请您选择更新该菜。');
        }
        menuModel.create(food,callback);
    });
};

Menu.prototype.addAndUpdateFood=function(food,callback){
    menuModel.findOne({'name':food.name},function(err,doc){
        if(err){
            callback(err);
        }
        if(doc){
            doc.description=food.description;
            doc.save();
        }
        else{
            menuModel.create(food,callback);
        }
    });
};

Menu.prototype.getFoodsByType = function(type,callback){
    menuModel.find({'type':type},function(err,doc){
        callback(err,doc);
    });
};

function addAndUpdateFood(food,callback){
    var foodType=new FoodType();
    menuModel.findOne({'name':food.name},function(err,findRet){
        if(err){
            callback(err);
        }
        if(findRet){
            for(var key in food){
                findRet[key]=food[key];
            }
            findRet.save(function(err,saveRet){
                 callback(err,saveRet);
            });
        }
        else{
            menuModel.create(food,function(err,createRet){
                callback(err,createRet);
            });
        }
    });

    /*foodType.addFoodType({'name':food.type},function(err,ret){
        callback(err,ret);
    });*/
};

function addMenuRecord(food,callback){
    var ep = new EventProxy();
    var foodType = new FoodType();

    ep.all('add-food','add-type',function(checkName,checkType){
        callback(null);
    });

    ep.fail(callback);

    addAndUpdateFood(food,ep.done('add-food'));
    foodType.addFoodType(food.type,ep.done('add-type'));
}



