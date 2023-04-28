const formatDateTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

 /**
     * 
     * @param {*} times  时间戳
     * 转换为  yyyy-MM-dd HH:MM:SS 格式的日期
     */
 const formatDate = date => {
      var date = new Date(date);
      var year = date.getFullYear(); //年份
      var month = date.getMonth() + 1; //月份
      var day = date.getDate(); //日
      if(month<10){
        month = '0'+month;
      }
      if(day<10){
        day = '0'+day;
      }
      return year + '-' + month + '-' + day
  }

  /**
   * 转换为时刻
   * @param {*} date 
   */
  const formatTime = date =>{
    var date = new Date(date);
    var hour = date.getHours(); //小时
    var minute = date.getMinutes(); //分钟
    if(minute<10){
      minute = "0" + minute;
    }
    if(hour<10){
      hour = "0" + hour;
    }
    return hour + ":" + minute;
  }

  // 根据出生日期计算年龄周岁
const getAge = (birth,nowDate) => {
  var date = new Date(formatDate(birth));
  // console.log(date);
  var returnAge = '';
  var mouthAge = '';
  var dayAge = '';
  var birthYear = date.getFullYear();
  var birthMonth = date.getMonth()+1;
  var birthDay = date.getDate();
  var d = new Date(nowDate);
  var nowYear = d.getFullYear();
  var nowMonth = d.getMonth() + 1;
  var nowDay = d.getDate();
  if (nowYear == birthYear) {
    // returnAge = 0; //同年 则为0岁
    var monthDiff = nowMonth - birthMonth; //月之差 
    if (monthDiff < 0) {
    }else {
      if(monthDiff == 0){
        mouthAge = '';
      }else{
        mouthAge = monthDiff + '个月';
      }
      var dayDiff = nowDay - birthDay;
      if(dayDiff <0){
        if((monthDiff-1)>0){
          mouthAge = monthDiff-1 + '个月';
        }else{
          mouthAge = '';
        }   
        dayAge = 30 + dayDiff + '天'; 
      }else{
        if(dayDiff == 0){
          dayAge = '';
        }else{
          dayAge = dayDiff + '天';
        }
      }
    }
  } else {
    var ageDiff = nowYear - birthYear; //年之差
    if (ageDiff > 0) {
      if (nowMonth == birthMonth) {
        var dayDiff = nowDay - birthDay; //日之差 
        if (dayDiff < 0) {
          dayAge = 30 + dayDiff + '天';
          if((ageDiff - 1)>0){
            returnAge = ageDiff - 1 + '岁';
          }else{
            mouthAge = '11个月';
            returnAge = '';
          }
        } else {
          if(dayDiff == 0){
            dayAge = '';
          }else{
            dayAge = dayDiff + '天';
          }
          returnAge = ageDiff + '岁';
        }
      } else {
        var monthDiff = nowMonth - birthMonth; //月之差 
        if (monthDiff < 0) {
          var dayDiff = nowDay - birthDay; //天之差
          if(dayDiff<0){
            mouthAge = 12 + monthDiff - 1 + '个月';
            dayAge = 30 + dayDiff + '天'; 
          }else{
            mouthAge = 12 + monthDiff + '个月';
            if(dayDiff == 0){
              dayAge = '';
            }else{
              dayAge = dayDiff + '天';
            }
            
          }
          if((ageDiff - 1)>0){
            returnAge = ageDiff - 1 + '岁';
          }else{
            returnAge = '';
          }
        } else {
          var dayDiff = nowDay - birthDay; //天之差
          if(dayDiff<0){
            dayAge = 30 + dayDiff + '天'; 
          }else{
            if(dayDiff == 0){
              dayAge = '';
            }else{
              dayAge = dayDiff + '天';
            }
          }
          if(monthDiff == 0){
            mouthAge = '';
          }else{
            mouthAge = monthDiff + '个月';
          }
          returnAge = ageDiff + '岁';
        }
      }
    } else {
      returnAge = -1; //返回-1 表示出生日期输入错误 晚于今天
    }
  }
  return returnAge + mouthAge + dayAge; //返回周岁年龄+月份
}





module.exports = {
  formatDateTime,
  formatDate,
  formatTime,
  getAge
}
