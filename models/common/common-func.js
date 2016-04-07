/**
 * Created by ZhiyuanSun on 15/12/25.
 */


module.exports = {
    //复制一条记录信息（从src到dest，属于值复制）
    copyARecordTo:
        function(src, dest){
            for(var key in src){
                if(dest[key] != 'undefined'){
                    dest[key] = src[key];
                }
                else{
                    throw Error('Copy a user order record to ' + dest + ' Failed, it does not contain the key of '+key);
                }
            }
        },
    dateToString :
        function(time){
            var year = time.getFullYear();
            var month = time.getMonth()+1;
            var day = time.getDate();
            var hour = time.getHours();
            var minute = time.getMinutes();
            var second = time.getSeconds();

            var timeString = year.toString();
            timeString += '-' + month.toString();
            timeString += '-' + day.toString();
            timeString += ' ' + hour.toString();
            timeString += ':' + minute.toString();
            timeString += ':' + second.toString();

            return timeString;
        },
    createUserOrderID:
        function(){
            //            构建时间字符串
            var timeNow = new Date();
            var year = timeNow.getFullYear();
            var month = timeNow.getMonth()+1;
            var day = timeNow.getDate();
            var hour = timeNow.getHours();
            var minute = timeNow.getMinutes();
            var second = timeNow.getSeconds();

            var timeString = year.toString();
            timeString += (month < 10 ? '0' + month : month.toString());
            timeString += (day < 10 ? '0' + day : day.toString());
            timeString += (hour < 10 ? '0' + hour : hour.toString());
            timeString += (minute < 10 ? '0' + minute : minute.toString());
            timeString += (second < 10 ? '0' + second : second.toString());

            //            构建4位的随机字符串
            var randNum = Math.round(10000*(Math.random()));
            var randString = null;
            if(randNum<10){
                randString = '000' + randNum.toString();
            }
            else if(randNum<100){
                randString = '00' + randNum.toString();
            }
            else if(randNum<1000){
                randString = '0' + randNum.toString();
            }
            else{
                randString = randNum.toString();
            }

            return {
                userOrderId : timeString + randString,
                time : timeNow
            };
        }
};