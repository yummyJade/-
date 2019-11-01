// pages/adminLogin/adminLogin.js
let app = getApp();
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    ip: app.globalData.host,
    inputValue:''
  },
  /**
   * 处理登录
   */
  loginSubmit:function(e){
    let data = e.detail.value;
    let that = this;
    //简单做一下为空的判断
    if(data.username == "" || data.password == ""){
      wx.showModal({
        title: '提示',
        content: '账号或密码不可为空！',
      })
      return false;
    }else{
      this.setData({
        loadModal: true
      });
      let header={
        'content-type': 'application/x-www-form-urlencoded'
      }
      wx.request({
        url: that.data.ip +'/jw/login',
        method:'POST',
        header:header,
        data:{
          'userCode':data.username,
          'password':data.password
        },
        success(res){
          that.setData({
            loadModal: false
          });
          if(res.data.status == 200){
            wx.setStorageSync("token", res.data.data);
            //强行登录
            wx.redirectTo({
              url: '/pages/index/index',
            })
          }else{
            wx.showModal({
              title: '提示',
              content: '账号或密码错误！'
            })
            that.setData({
              inputValue:''
            })
          }
        },
        
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let token = wx.getStorage({
      key: 'token',
      success: function (res) {
        if (res.data != []) {
          wx.redirectTo({
            url: '/pages/index/index',
          })
        } else {

        }
      },
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