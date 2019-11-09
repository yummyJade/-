// pages/colorPick/colorPick.js
import colorLib from '../class/Constant.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    colorIndex: 0 ,
    colorList: [
      
    ]
  },
  /**
   * 监听颜色切换事件
   */
  changeColorIndex: function(e) {
    // console.log(e)
    this.setData({
      colorIndex: e.currentTarget.dataset.index
    })
    this.bindBackFun();
  },
  /**
   * 绑定返回上一层的函数
   */
  bindBackFun: function() {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2]; //上一个页面
    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      mydata: {
        colorIndex: this.data.colorIndex,
        type:"color"
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
      colorIndex:options.colorIndex || 0,
      colorList: colorLib
    })
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
    //     colorIndex: that.data.colorIndex,
    //     type: "color"
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