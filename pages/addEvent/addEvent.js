// pages/addEvent/addEvent.js
import Time from '../class/Time.js';
Page({

  /**
   * 页面的初始数据
   */
  //将time换成当前时间
  data: {
    eventTypeIndex: 1,
    eventType: ["提醒", "活动"],

    chooseDate: '2016-09-01',
    multiStartArray: [],
    multiStartIndex: [0, 0],
    
    multiEndArray: [],
    multiEndIndex: [0, 0],

    startTimeStr: "07:00",
    startHour: 7,
    startMinute: 0,

    endTimeStr: "08:00",
    endHour:8,
    endMinute: 0,
  },

  /**
   * 监听事件类型改变
   */
  eventTypePickerChange: function(e) {
      this.setData({
        eventTypeIndex: parseInt(e.detail.value)
      })
  },

  /**
   * 监听日期更改
   */
  bindDateChange: function(e) {
    let newDate = e.detail.value
    this.setData({
      chooseDate: newDate,
    });
    this.initStartPicker(new Date(newDate));
  },

  /**
   * 监听开始时间更改
   */
  bindStartPickerChange: function(e) {
      let indexArr = e.detail.value;
      let startArr = this.data.multiStartArray;
      let startHour = startArr[0][indexArr[0]];
      let startMinute = startArr[1][indexArr[1]];
      let intHour = parseInt(startHour);
      let intMinute = parseInt(startMinute);
      this.setData({
        startTimeStr: startHour + ":" + startMinute,
        startHour: intHour,
        startMinute: intMinute,
      })
      this.initEndPicker(intHour, intMinute);
  },

  /**
   * 监听开始时间列更改
   */
  startPickerColumnChange: function(e) {
    let date = new Date(this.data.chooseDate);
    let column = e.detail.column;
    let value = e.detail.value;
    // 更改小时列
    if (column == 0) {
      // 更改到第一行
      if (value == 0) {
        if (!this.isFullChoice(date)) {
          let now = new Date();
          let mod = 5 - now.getMinutes() % 5;
          let minute = now.getMinutes() + 5 + mod;
          let minuteList = this.getList(minute, 55, 5);
          let startArr = this.data.multiStartArray;
          startArr[1] = minuteList;
          this.setData({
            multiStartArray: startArr
          })
        }
      }else {
        let minuteList = this.getList(0, 55, 5);
        let startArr = this.data.multiStartArray;
        startArr[1] = minuteList;
        this.setData({
          multiStartArray: startArr
        })
      }
    }
  },

  /**
   * 监听截止时间改变
   */
  bindEndPickerChange: function (e) {
    let indexArr = e.detail.value;
    let endArr = this.data.multiEndArray;
    let endHour = endArr[0][indexArr[0]];
    let endMinute = endArr[1][indexArr[1]];
    let intHour = parseInt(endHour);
    let intMinute = parseInt(endMinute);
    this.setData({
      endTimeStr: endHour + ":" + endMinute,
      endHour: intHour,
      endMinute: intMinute
    })
  },

  /**
   * 监听截止时间列改变
   */
  bindEndPickerColumnChange: function(e) {
      let column = e.detail.column;
      let value = e.detail.value;
      if(column == 0) {
        let endArr = this.data.multiEndArray;
        let endHour = parseInt(endArr[0][value]);
        let minuteList;
        let startHour = this.data.startHour;
        if (startHour == endHour) {
          let endMinute = this.data.startMinute + 5;
          let minuteList = this.getList(endMinute, 55, 5);
          endArr[1] = minuteList;
        }else if(endHour == 23){
          minuteList = ['00'];
          endArr[1] = minuteList;
        }else {
          minuteList = this.getList(0, 55, 5);
          endArr[1] = minuteList;
        }
        this.setData({
          multiEndArray: endArr
        });
      }
  },

  /**
   * 判断时间是否超过22:50
   */
  isEndTime: function (date) {
    return date.getHours() > 22 || (date.getHours() == 22 && date.getMinutes() >= 50)
  },

  /**
   * 开始时间是否可以全选
   */
  isFullChoice: function(date) {
    let now = new Date();
    return date.Format('yyyy-MM-dd') != now.Format('yyyy-MM-dd') || date.getHours() < 7 ||
      this.isEndTime(date)
  },


  /**
   * 获取0补充的列表
   */
  getList: function(start = 7, end = 23, step = 1) {
    let list = [];
    for (; start <= end; start+= step) 
      list.push(("0" + start).substr(-2));
    return list;
  },

  /**
   * 根据日期初始化开始时间
   * @param date: 选择的日期
   */
  initStartPicker: function(date) {
    let now = new Date();
    let startHour, startMinute;
    let startArr;
    // 日期不同或七点以前或22:50以后，开始时间是都可以全选的
    if (this.isFullChoice(date)) {
      startArr = [this.getList(7, 22), this.getList(0, 55, 5)];
      startHour = 7,
      startMinute = 0;
    }else{ // 今天7:00～22:50之间
      let mod = 5 - now.getMinutes() % 5;
      now.setMinutes(now.getMinutes() + 5 + mod);
      startHour = now.getHours();
      startMinute = now.getMinutes();
      startArr = [this.getList(startHour, 22), this.getList(startMinute, 55, 5)];
    }

    this.setData({
      multiStartArray: startArr,
      startTimeStr: startArr[0][0] + ":" + startArr[1][0],
      multiStartIndex: [0, 0],
      startHour: startHour,
      startMinute: startMinute,
    });

    this.initEndPicker(startHour, startMinute);
  },

  /**
   * 根据开始时间初始化截止时间
   * @param startHour: 开始时间
   * @param endHour: 截止时间
   */
  initEndPicker: function(startHour = 7, startMinute = 0) {
      
      let endHourList, minuteList;
      let hourIndex = 0, minuteIndex = 0;
      
      // 初始化时钟列
      if (startMinute == 55) {
        endHourList = this.getList(startHour + 1);
      }else {
        endHourList = this.getList(startHour);
      }

      // 初始化分钟列
      if (startHour != 22) {
        if (startMinute != 55) {
          hourIndex = 1;
        }
        minuteIndex = startMinute / 5;
        minuteList = this.getList(0, 55, 5);
      }else {
        if(startMinute != 55) hourIndex = 1;
        minuteList = ['00'];
      }

      let endArr = [endHourList, minuteList];

      this.setData({
        multiEndArray: endArr,
        multiEndIndex: [hourIndex, minuteIndex],
        endTimeStr: endArr[0][hourIndex] + ":" + endArr[1][minuteIndex],
        endHour: parseInt(endArr[0][hourIndex]),
        endMinute: parseInt(endArr[1][minuteIndex]),
      })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let date = new Date();
    let endDate = new Date(date.getFullYear() + 1, date.getMonth(), date.getDate());

    //检查是否大于22:50，大于则日期加一
    if (this.isEndTime(date)) {
      date.setDate(date.getDate() + 1);
    }
    
    this.setData({
      setStartDate: date.Format('yyyy-MM-dd'),
      chooseDate: date.Format('yyyy-MM-dd'),
      setEndDate: endDate.Format('yyyy-MM-dd'),
    })

    this.initStartPicker(date);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})



// 日期格式化
Date.prototype.Format = function (fmt) { 
  var o = {
    "M+": this.getMonth() + 1, //月份 
    "d+": this.getDate(), //日 
    "h+": this.getHours(), //小时 
    "m+": this.getMinutes(), //分 
    "s+": this.getSeconds(), //秒 
    "q+": Math.floor((this.getMonth() + 3) / 3),  
    "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}