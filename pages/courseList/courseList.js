// pages/courseList/courseList.js
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
    courseName: ""
  },
  /**
   * 请求课程列表的event
   */
  getCourseList: function() {
    let that = this;
    app.RequestInter.getCourseList({
      
    })
    .then(res => {
      if (res.message == "success") {
        let data = res.data;
        wx.setStorage({
          key: "userCourseList",
          data: data
        });
        let arr = [{
          className:"无"
        }];
        for(let i = 0, len = res.data.length; i < len; i++) {
          let name = res.data[i].className;
          if(name == that.data.courseName) {
            that.setData({
              courseIndex: i + 1
            })
          }
          let maxLen = 10;
          if (name.length > maxLen) name = name.substr(0, maxLen) + "..."
          arr.push({
            
            classNum: res.data[i].classNum,
            className: name
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
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2]; //上一个页面
    // console.log(this.data.courseList)
    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      mydata: {
        courseIndex: this.data.courseIndex,
        courseObj: this.data.courseList[this.data.courseIndex],
        type: "course"
      }
    })
    wx.navigateBack({//返回
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    this.setData({
      courseIndex: options.courseIndex || 0,
      courseName: options.courseName || ""
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