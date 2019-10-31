//index.js
import Time from '../class/Time.js';
import colorLib from '../class/Constant.js'
//获取应用实例
const app = getApp()


Page({
  data: {
    ip: app.globalData.host,
    cookieTest: app.globalData.cookieTest,
    weekName:[
      {
        title:"日",
        dateName:20
      },
      {
        title:"一",
        dateName:21
      },
      {
        title:"二",
        dateName:22
      },{
        title:"三",
        dateName:23,
      },{
        title:"四",
        dateName:24
      },{
        title:"五",
        dateName:25
      },{
        title:"六",
        dateName:26
      }
    
    ],
    dateNameIndex:-1,
    timeTitle: ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00","14:00",
      "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00","22:00"],
    sideWidth:100,    //记录侧边栏的宽度
    lineWidth:0,
    lineHeight:60,
    lineArr:[1,2,3,4,5,6,7],
    lineArr2:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
    scrollHeight:0,
    courseList: [],   //记录课程表信息
    eventList:[
    ],
    nowTimeLine:{   //记录当前时间线
      left:-100,
      top:-100
    }
  },
  calcu:function(){
    let linewidth = (750 - this.data.sideWidth)/7;
    this.setData({
      lineWidth:linewidth
    })
    
   
    //获取header高度
    let headerHeight = 0;
    const getHeaderHeight = function(){
      return new Promise(function(resolve,reject){
        let query = wx.createSelectorQuery();
        query.select('.header').boundingClientRect(rect => {
          headerHeight = rect.height;
          resolve(headerHeight);
          // console.log(headerHeight)
        }).exec();
      })
    }
    //获取视口高度
    let that = this;
    const getClientHeight = function(){
      return new Promise((resolve,reject) =>{
        wx.getSystemInfo({
          success: function (res) {
            let clientHeight = res.windowHeight;
            let clientWidth = res.windowWidth;
            // let ratio = 750 / clientWidth;
            // let height = clientHeight * ratio;
            // that.setData({
            //   height: height
            // });
            resolve(clientHeight);
            
           
          }
        });
      })
    }
    //计算底下那个body部分的高度
    const calcuBodyHeight = async function(){
      const f1 = await getClientHeight();
      const f2 = await getHeaderHeight();
      that.setData({
        scrollHeight: f1-f2,
        lineHeight: (f1-f2)/16
      })

    }
    calcuBodyHeight();
  },
//   //事件处理函数
//   bindViewTap: function() {
//     wx.navigateTo({
//       url: '../logs/logs'
//     })
//   },
//   onLoad: function () {
//     if (app.globalData.userInfo) {
//       this.setData({
//         userInfo: app.globalData.userInfo,
//         hasUserInfo: true
//       })
//     } else if (this.data.canIUse){
//       // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
//       // 所以此处加入 callback 以防止这种情况
//       app.userInfoReadyCallback = res => {
//         this.setData({
//           userInfo: res.userInfo,
//           hasUserInfo: true
//         })
//       }
//     } else {
//       // 在没有 open-type=getUserInfo 版本的兼容处理
//       wx.getUserInfo({
//         success: res => {
//           app.globalData.userInfo = res.userInfo
//           this.setData({
//             userInfo: res.userInfo,
//             hasUserInfo: true
//           })
//         }
//       })
//     }
//   },
//   getUserInfo: function(e) {
//     console.log(e)
//     app.globalData.userInfo = e.detail.userInfo
//     this.setData({
//       userInfo: e.detail.userInfo,
//       hasUserInfo: true
//     })
//   }
  /**
   * 做一些初始化
   */
  init:function(){
    // wx.setStorageSync("token", res.data["key"])
    // wx.setStorageSync("token", this.data.cookieTest);
    this.getEventList()
  },
  /**
   * 获取事件列表相关的函数
   */
  getEventList:function(){
    let that = this;
    let header = {
      'content-type': 'application/json; charset=utf-8',
      'cookie': "token=" + wx.getStorageSync("token")//读取cookie
    };
    let time = new Time();
    let nowTime = new Date();
    // let a = time.getNowTime();
    // console.log(a)
    
    console.log("可使用高度：" + wx.getSystemInfoSync().windowHeight);

    wx.request({
      url: that.data.ip + '/event',
      method: 'GET',
      header: header,
      data: {
        startTime: time.getDaysAfterTime(-(nowTime.getDay()-0), 6),
        endTime:time.getDaysAfterTime(7-nowTime.getDay(),23)
      },
      success(res){
        if(res.data.message == "success"){
          let eventListArr = [],
            temp, data, topDis, leftDis, heightDis,
            startHour = 7,
            endHour = 23,
            blockWidth = 92,
            lineWidth = 1.5,
            blockHeight = that.data.lineHeight,
            fixLeft = 100,
            nowTime = new Date();
          //设置标题栏
          let nowDay = nowTime.getDay();
          let firstDate = new Date();
          firstDate.setDate(firstDate.getDate() - nowDay);
          let dateNameArr = that.data.weekName;
          for(let i = 0, len = 7; i < len; i++){
            dateNameArr[i].dateName = firstDate.getDate();
            firstDate.setDate(firstDate.getDate() + 1);
          }
          // console.log(dateNameArr)
          //添加当前时间线，只显示6点到22点，好的偷偷的说现在23点了
          let timeLineLeft, timeLineTop;
          // console.log("8888")
          if(nowTime.getHours() >= endHour || nowTime.getHours() <= startHour){
            
            timeLineLeft = -100;
            timeLineTop = -100;
          }else{
            timeLineLeft = fixLeft + (nowTime.getDay()) * blockWidth + lineWidth * nowTime.getDay();
            timeLineTop = ((nowTime.getHours() - startHour) * 60 + (nowTime.getMinutes())) * blockHeight / 60;
          }
          
         
          // console.log(timeLineLeft)
            for(let i = 0, len = res.data.data.length; i < len;  i++){
              data = res.data.data[i];

              
              let startTime = new Date(data.startTime);
              let endTime = new Date(data.endTime);
              // console.log(colorLib[0])
              // let colorIndex = 0;
              // if (!data.color){
              //   colorIndex = Math.floor(Math.random() * colorLib.length);
              // }
              
              //距离上方的距离
              heightDis = ((endTime.getHours() * 60 + endTime.getMinutes()) - (startTime.getHours() * 60 + startTime.getMinutes())) * blockHeight / 60;
              topDis = ((startTime.getHours() - startHour) * 60 + (startTime.getMinutes())) * blockHeight / 60;
              leftDis = fixLeft + (startTime.getDay()) * blockWidth + lineWidth * startTime.getDay(); 
              temp = {
                title : data.title,
                address: data.address,
                top: topDis,
                left: leftDis,
                height: heightDis,
                color: colorLib[data.color]["rgb"]
              }
              // temp = data;
              eventListArr.push(temp);
              
            }
            that.setData({
              eventList:eventListArr,
              weekName:dateNameArr,
              dateNameIndex: nowTime.getDay(),
              nowTimeLine:{
                left:timeLineLeft,
                top:timeLineTop
              }
            })

        }
      }
    })

  },
  /**
   * 获取课程列表相关的函数
   */
  getCourseList:function(options) {
    let that = this;

    // wx.getStorageSync("sessionid")
    let header = {
      'content-type': 'application/json; charset=utf-8',
      'cookie': "token="+ wx.getStorageSync("token")//读取cookie
    };
    // 是否应该找一个地方把所有的请求信息都以json的形式存下来方便管理
    //进行请求,一般外层都有一个封装,然后放在公共类里边
    wx.request({
      url: that.data.ip + '/jw/stu/timetable/course',
      method:'GET',
      header:header,
      data:{

      },
      success(res){
        if(res.data.message == "success"){
          let data = res.data;
          let courseListArr = [];

        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.calcu();
    this.init();
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
