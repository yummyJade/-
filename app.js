//app.js
import RequestInter from './pages/class/RequestInter.js';
App({
  onLaunch: function () {
    //判断是否有token，如果有，说明已经登录，如果没有，打回登录状态
    // let token = wx.getStorage({
    //   key: 'token',
    //   success: function(res) {
    //     console.log(res.data);
    //     if(res.data != []){
    //       wx.redirectTo({
    //         url: '/pages/index/index',
    //       })
    //     }else{
          
    //     }
    //   },
    // })
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  RequestInter: new RequestInter(),   //实例化
  globalData: {
    userInfo: null,
    host: 'https://itstudio.club',
    cookieTest:'xrE7ydtkyqZGlntXsIqzRYsY8SYD'
  }
})