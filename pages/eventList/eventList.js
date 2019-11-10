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

    }
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
   * 转换日期格式
   */
  formatTime: function (date) {
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let index = date.getDay();
    let hour = date.getHours();
    let min = date.getMinutes();
    let sec = date.getSeconds();
    if (hour < 10) {
      hour = '0' + hour;  //补齐
    }
    if (min < 10) {
      min = '0' + min;  //补齐
    }
    return month + "月" + day + "日" + " " + "星期" + this.data.daykey[index] + hour + ":" + min;
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
            startTime: this.formatTime(new Date(res.data[i].startTime)),
            endTime: this.formatTime(new Date(res.data[i].endTime)),
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
   * 监听颜色切换事件
   */
  changeCourseIndex: function (e) {
    // console.log(e)
    this.setData({
      courseIndex: e.currentTarget.dataset.index
    })
    this.bindBackFun();
  },
  /**
   * 绑定返回上一层的函数
   */
  bindBackFun: function () {
    // let pages = getCurrentPages();
    // let prevPage = pages[pages.length - 2]; //上一个页面
    // // console.log(this.data.courseList)
    // //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    // prevPage.setData({
    //   mydata: {
    //     courseIndex: this.data.courseIndex,
    //     courseObj: this.data.courseList[this.data.courseIndex],
    //     type: "course"
    //   }
    // })
    // wx.navigateBack({//返回
    //   delta: 1
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    this.setData({
      courseIndex: options.courseIndex || 0,

    })

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
    // let pages = getCurrentPages();
    // let prevPage = pages[pages.length - 2]; //上一个页面
    // let that = this;
    // //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    // prevPage.setData({
    //   mydata: {
    //     courseIndex: that.data.courseIndex,
    //     courseObj: that.data.courseList["courseIndex"]
    //   }
    // })
    // wx.navigateBack({//返回
    //   delta: 1
    // })
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