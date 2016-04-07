/**
 * Created by ZhiyuanSun on 15/12/13.
 */
function UserOrderRecord(foods, status, money, time){
    if(foods instanceof String){
        this.foods = new Array(foods);
    }
    else{
        this.foods = foods;
    }

    this.status = status;
    this.money = money;
    if(time == 'undefined'){
        this.time = new Date().now;
    }
    else{
        this.time = time;
    }
};

UserOrderRecord.prototype.addFood = function(){

};