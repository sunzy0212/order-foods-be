/**
 * Created by zhiyuans on 12/4/2015.
 */
var express = require('express');
var router = express.Router();
var Menu = require('../../models/app/menu');
var FoodType = require('../../models/app/food-type');

var app = require('../../app');

router.post('/GetMenu',function(req,res){
    var menu=new Menu();
    menu.getAllFoods(function(err,doc){
        if(err){
            res.status(500).send(err);
        }
        res.status(200).send(doc);
    });
});

router.get('/GetFoodType',function(req,res){
    var foodType=new FoodType();
    foodType.getAllFoodType(function(err,foodTypeRet){
        if(err){
            res.status(500).send(err);
        }
        res.status(200).send(foodTypeRet);
    });
});

router.post('/GetFoodsByType',function(req,res){
    var menu = new Menu();
    menu.getFoodsByType(req.body.foodType,function(err,doc){
        if(err){
            res.status(500).send(err);
        }
        res.status(200).send(doc);
    });
});

module.exports=router;
