// pages/eventList/eventList.js
import colorLib from '../class/Constant.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseIndex: 0,
    courseList: [

    ],
    daykey: {
      "0": "日",
      "1": "一",
      "2": "二",
      "3": "三",
      "4": "四",
      "5": "五",
      "6": "六",

    },
    hasStart: true,
  },
  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },

  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },
  /**
   * 删除事件
   */
  deleteRemind: function(e){
    let dataset = e.currentTarget.dataset;
    app.RequestInter.dealShareEvent({
      data: {
        eventID: dataset.eventid,
        shareID: dataset.shareid,
        valid: 0
      }
    })
    .then(res => {
      if(res.status == 200) {
        // let arr = this.data.courseList;
        // arr.splice(dataset.index, 1)
        this.onLoad();
      }else {

      }
    })
    .catch(res => {

    })
  },
  
  /**
   * 赞成事件
   */
  approveRemind: function(e){
    let dataset = e.currentTarget.dataset;
    let type = dataset.type;
    let eventid = dataset.eventid;
    let shareid = dataset.shareid;
    let that = this;
    if(type == 1) {
      // 消息模板ID
      let templateID = "r23bQp-E8_EFxh5fgZzRRhqDRCfmWJbuyW91sWqaKBY";
      // 请求订阅消息界面
      wx.requestSubscribeMessage({
        tmplIds: [templateID],
        success(res) {
          let attitude = res[templateID];
          if (attitude == 'accept') {
            that.requestApprove(eventid, shareid);
          } else {
            wx.showToast({
              title: "添加失败",
              icon: 'none'
            })
          }
        }
      })
    }else {
      this.requestApprove(eventid, shareid);
    }
    
  },

  requestApprove:function(eventid, shareid) {
    app.RequestInter.dealShareEvent({
      data: {
        eventID: eventid,
        shareID: shareid,
        valid: 1
      }
    })
      .then(res => {
        if (res.status == 200) {
          this.onLoad();
        } else {

        }
      })
      .catch(res => {

      })
  },

  /**
   * 转换日期格式
   * type 0: 星期某 某月某日 某时:某分
   * type 1: 某时:某分
   */
  formatTime: function (date, type) {
    if(type == 0) {
      return "星期" + this.data.daykey[date.getDay()] + " " + date.Format('MM月dd号 hh:mm')
    }else {
      return date.Format('hh:mm')
    }
  },
  /**
   * 请求课程列表的event
   */
  getCourseList: function() {
    let that = this;
    app.RequestInter.getShareEventList({
      
    })
    .then(res => {
      if (res.message == "success") {
        let data = res.data;
        let arr = [];
        for(let i = 0, len = res.data.length; i < len; i++) {
          let name = res.data[i].title;
          let maxLen = 5;
          if (name.length > maxLen) name = name.substr(0, maxLen) + "..."
          arr.push({
            title: res.data[i].title,
            eventID: res.data[i].eventID,
            address: res.data[i].address,
            color: res.data[i].color,
            remark: res.data[i].remark,
            startTime: this.formatTime(new Date(res.data[i].startTime), 0),
            endTime: this.formatTime(new Date(res.data[i].endTime), ~res.data[i].type + 2),
            shareID: res.data[i].shareID,
            type: res.data[i].type
          })
        }
        this.setData({
          courseList: arr
        })

        
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    // this.setData({
    //   courseIndex: options.courseIndex || 0,

    // })

    //init 初始化数据
    this.getCourseList();
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