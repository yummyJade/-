// 这是一个时间类
class Time{

  constructor() {
    this._nowDate = new Date();
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


  strToDate1(str) {
    if (str) {
      let date = new Date(str.replace(/-/, "/"))
      return date;
    }


  }
  /**
     * 勇于比较date的大小，若当前较小，返回-1,
     */
  // compareDate(anotherDate) {
  //   return (this._nowDate.getTime() - )
  // }
  /**
   * 创建一个数组
   */
  
  buildArr(start,end, step = 1){
    let resultArr = [];
    for (let i = start; i <= end; i=i+step) {
      resultArr.push(i);
    }
    return resultArr;
  }


}
export default Time;