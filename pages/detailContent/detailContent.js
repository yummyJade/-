// pages/detailContent/detailContent.js
import { formatTime} from '../../utils/util.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    eventStr: "",
    remindBlock:{
      title:"",
      eventID:"",
      shareID:"",
      address:"",
      remark:"",
      startTime:"",
      endTime:"",
      color:[0,0,0]
    },
  },
  /**
   * 用于删除事件
   */
  deleteRemindBlock: function(){
    let that = this;
    wx.showLoading({
      title: '删除中',
      mask: true,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
    // console.log(that.data.remindBlock.eventID)
    app.RequestInter.deleteEvent({
      data:{
        eventID: that.data.remindBlock._eventID,
        
      }

    })
    .then(res => {
      // debugger;
      if(res.status == 200) {
        wx.hideLoading();
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2]; //上一个页面
        wx.navigateBack({//返回
          delta: 1
        });
        wx.showToast({
          title: '删除成功',
        });
        wx.vibrateShort();
       
      }else {
        wx.hideLoading();
        wx.showToast({
          title: '删除失败',
        })
      }
    })
      .catch(err => {
      wx.hideLoading();
      wx.showToast({
        title: '删除失败',
        icon: 'warn'
      })
    })
  },
  /**
   * 转换日期格式
   */
  formatTime: function(date){
    let hour = date.getHours();
    let min = date.getMinutes();
    if (hour < 10) {
      hour = '0' + hour;  //补齐
    }
    if (min < 10) {
      min = '0' + min;  //补齐
    }
    return hour +":" + min;
  },

  /**
   * 绑定更新事件
   */
  updateEvent:function(){
    let that = this;
    wx.navigateTo({
      url: '/pages/updateEvent/updateEvent?eventStr=' + that.data.eventStr,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(formatTime)
    // debugger;
    if(options != null){
      let eventStr = options.remindObj;
      let remindTemp = JSON.parse(eventStr);
      let obj = {
        _title: remindTemp._title,
        _eventID: remindTemp._eventID,
        _shareID: remindTemp._shareID,
        _address: remindTemp._address,
        _remark: remindTemp._remark,
        _startTime: this.formatTime(new Date(remindTemp._startTime)),
        _endTime: this.formatTime(new Date(remindTemp._endTime)),
        _color: remindTemp._color,
        _type: remindTemp._type
      }
      this.setData({
        remindBlock: obj,
        eventStr: eventStr
      })
    }
    
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