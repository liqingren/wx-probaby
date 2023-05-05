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
  var yearAge = '';
  var monthAge = '';
  var dayAge = '';
  var birthYear = date.getFullYear();
  var birthMonth = date.getMonth()+1;
  var birthDay = date.getDate();
  var d = new Date(nowDate);
  var nowYear = d.getFullYear();
  var nowMonth = d.getMonth() + 1;
  var nowDay = d.getDate();
  if (nowYear == birthYear) {
    // yearAge = 0; //同年 则为0岁
    var monthDiff = nowMonth - birthMonth; //月之差 
    var dayDiff = nowDay - birthDay;//天之差
    if(monthDiff == 0){
      if(dayDiff>0){
        dayAge = dayDiff + '天';
      }else if(dayDiff == 0){
        yearAge = '刚出生';
      }
    }else if(monthDiff >0){
      if(dayDiff == 0){
        monthAge = monthDiff + '个月';
      }else if(dayDiff>0){
        monthAge = monthDiff + '个月';
        dayAge = dayDiff + '天';
      }else if(dayDiff<0){
        if(monthDiff>1){
          monthAge = monthDiff - 1 + '个月';
        }
        dayAge = 30 + dayDiff + '天';
      }
    }
  } else {
    var ageDiff = nowYear - birthYear; //年之差
    if (ageDiff > 0) {
      var monthDiff = nowMonth - birthMonth; //月之差 
      var dayDiff = nowDay - birthDay;//天之差
      if(monthDiff == 0){
        if(dayDiff>0){
          dayAge = dayDiff + '天';
          yearAge = ageDiff + '岁';
        }else if(dayDiff<0){
          if(ageDiff>1){
            yearAge = ageDiff - 1 + '岁';
          }
          monthAge = '11个月';
          dayAge = 30 + dayDiff + '天';
        }else if(dayDiff == 0){
          yearAge = ageDiff + '岁';
        }
      }else if(monthDiff>0){
        yearAge = ageDiff + '岁';
        if(dayDiff>0){
          dayAge = dayDiff + '天';
          monthAge = monthDiff + '个月';
        }else if(dayDiff<0){
          if(monthDiff>1){
            monthAge = monthDiff - 1 + '个月';
          }
          dayAge = 30 + dayDiff + '天';
        }else if(dayDiff == 0){
          monthAge = monthDiff + '个月';
        }
      }else if(monthDiff<0){
        if(ageDiff>1){
          yearAge = ageDiff -1 + '岁';
        }
        if(dayDiff>0){
          dayAge = dayDiff + '天';
          monthAge = 12 + monthDiff + '个月';
        }else if(dayDiff<0){
          monthAge = 12 + monthDiff - 1 + '个月';
          dayAge = 30 + dayDiff + '天';
        }else if(dayDiff == 0){
          monthAge = 12 + monthDiff - 1 + '个月';
        }
      }
    } else {
      yearAge = -1; //返回-1 表示出生日期输入错误 晚于今天
    }
  }
  return yearAge + monthAge + dayAge; //返回周岁年龄+月份
}





module.exports = {
  formatDateTime,
  formatDate,
  formatTime,
  getAge
}
