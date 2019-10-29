// 这是一个时间类
class Time{
  constructor(){

  }

  getNowTime(){
    // let nowTime = Date.parse(new Date());
    let nowTime = (new Date()).getTime();
    // nowTime = nowTime / 1000;
    return nowTime;
    // console.log("当前时间戳为：" + timestamp);
  }

  /**
   * 获取数天后的时间戳，默认为时间向后
   * @param day表示天数
   */
  getDaysAfterTime(day,endHours,endMins = 0, endSecs = 0, endMs = 0){
    let nowDate = new Date();
    let nowDayTime = (new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate(), endHours,
      endMins, endSecs, endMs)).getTime();

    let afterDaysTime = nowDayTime + 24 * 60 * 60 * 1000 * day;
    // console.log(afterDaysTime)
    return afterDaysTime;
  }

}
export default Time;