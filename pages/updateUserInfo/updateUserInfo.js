// pages/addEvent/addEvent.js
import Time from '../class/Time.js';
import colorLib from '../class/Constant.js';
const app = getApp();
Page({

  data: {
    userNameInput:"",
    emailInput:"",
    grade: "",
    specialty: "",
  },

  /**
   * 绑定用户名输入
   */
  bindUserNameInput:function(e) {
    this.setData({
      userNameInput: e.detail.value.trim()
    })
  },

  /**
   * 绑定邮箱输入
   */
  bindEmailInput: function(e) {
    this.setData({
      emailInput: e.detail.value.trim()
    })
  },

  /**
   * 检查用户名格式
   */
  checkUserName: function() {
    let len = this.data.userNameInput.length;
    if(len < 2 || len > 8){
      wx.showToast({
        title: '用户名长度2-8位',
        icon: "none"
      })
      return false;
    };
    return true;
  },

  /**
   * 检查邮箱格式
   */
  checkEmail: function() {
    let reg = /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/; 
    if(!reg.test(this.data.emailInput)) {
      wx.showToast({
        title: '邮箱格式有误',
        icon: "none"
      })
      return false;
    }
    return true;
  },
 

  /**
   * 绑定保存用户信息按钮
   */
  bindSaveFun: function() {
    if(this.checkUserName() && this.checkEmail()) {
      wx.showLoading({
        title: '保存中',
      });
      let that = this;
      app.RequestInter.updateUserInfo({
        data: {
          userName: that.data.userNameInput,
          email: that.data.emailInput,
          grade: that.data.grade,
          specialty: that.data.specialty
        }
      }).then(res => {
        wx.hideLoading();
        if(res.status == 200) {
          wx.reLaunch({
            url: '/pages/index/index'
          })
          wx.showToast({
            title: '保存成功',
          })
        }else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.getStorage({
      key: 'userInfo',
      success(res) {
        let userInfo = res.data;
        that.setData({
          userNameInput: userInfo.userName,
          emailInput: userInfo.email,
          grade: userInfo.grade,
          specialty: userInfo.specialtyCode
        })
      }
    })

    app.RequestInter.getUserInfo({})
    .then(res => {
      that.setData({
        userNameInput: res.data.userName,
        emailInput: res.data.email,
        grade: res.data.grade,
        specialty: res.data.specialtyCode
      })
      wx.setStorage({
        key: "userInfo",
        data: res.data
      })
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