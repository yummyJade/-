//index.js
import Time from '../class/Time.js';
import colorLib from '../class/Constant.js';

//获取应用实例
const app = getApp()


Page({
  data: {
    ip: app.globalData.host,
    cookieTest: app.globalData.cookieTest,
    weekName:[
      [{
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
      }],
      [{
        title: "日",
        dateName: 20
      },
        {
          title: "一",
          dateName: 21
        },
        {
          title: "二",
          dateName: 22
        }, {
          title: "三",
          dateName: 23,
        }, {
          title: "四",
          dateName: 24
        }, {
          title: "五",
          dateName: 25
        }, {
          title: "六",
          dateName: 26
        }],
      [{
        title: "日",
        dateName: 20
      },
        {
          title: "一",
          dateName: 21
        },
        {
          title: "二",
          dateName: 22
        }, {
          title: "三",
          dateName: 23,
        }, {
          title: "四",
          dateName: 24
        }, {
          title: "五",
          dateName: 25
        }, {
          title: "六",
          dateName: 26
        }],
    ],
    dateNameIndex:-1,
    timeTitle: ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00","14:00",
      "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00","22:00"],
    sideWidth:100,    //记录侧边栏的宽度
    lineWidth:0,
    lineHeight:60,
    headerHeight:0,
  
    lineArr:[1,2,3,4,5,6,7],
    lineArr2:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
    scrollHeight:0,
    courseList: [],   //记录课程表信息
    eventList:[[],[],[]
    ],
    nowTimeLine:{   //记录当前时间线
      left:-100,
      top:-100
    },

    /**
     * 记录轮播所需信息
     */
    currentIndex: 0,  // 当前轮播的索引

    // 记录当前周次的开始时间的时间戳
    firstTimeOfCurrentWeek: new Time().getDaysAfterTime(-(new Date().getDay()), 7),


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
        query.select('.header-bottom').boundingClientRect(rect => {
          headerHeight = rect.height;
          resolve(headerHeight);
          console.log(headerHeight)
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
            // console.log(clientHeight)
            resolve(clientHeight);
            
           
          }
        });
      })
    }
    //计算底下那个body部分的高度
    const calcuBodyHeight = async function(){
      const f1 = await getClientHeight();
      const f2 = await getHeaderHeight();
      return {f1, f2};
      // that.setData({
      //   scrollHeight: f1-f2,
      //   lineHeight: (f1-f2)/16
      // })
      // that.init();
    }
    return calcuBodyHeight();
   
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
    let that = this;
      const f1 = async function(){
        let { f1, f2 } = await that.calcu();
        that.setData({
          headerHeight:f2,
          scrollHeight: f1 ,
          lineHeight: (f1 - f2) / 16
        })

        // 初始化本周次
        that.renderWeek();
      }
      
      f1();
      
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
   * 根据索引判断是切换到下周还是上周
   */
  isNextWeek: function (lastIndex, currentIndex) {
    if (lastIndex == 2 && currentIndex == 0) return true
    return currentIndex - lastIndex == 1;
  },

  /**
   * 监听轮播切换
   */
  bindchange:function(e){
    // 获取上一个索引
    let lastIndex = this.data.currentIndex;
    // 获取当前索引
    let currentIndex = e.detail.current;
    // 获取上个周次的起始时间
    let firstTimeOfCurrentWeek = this.data.firstTimeOfCurrentWeek;

    if(this.isNextWeek(lastIndex, currentIndex)) {
      this.setData({
        currentIndex: currentIndex,
        firstTimeOfCurrentWeek: firstTimeOfCurrentWeek + 7 * 24 * 60 * 60 * 1000
        })
      this.renderWeek();
    }else {
      this.setData({
        currentIndex: currentIndex,
        firstTimeOfCurrentWeek: firstTimeOfCurrentWeek - 7 * 24 * 60 * 60 * 1000
      })
      this.renderWeek();
    }
  },

  /**
   * 根据索引获得上下周次的索引
   */
  getLastWeekIndex:function(index) {
    return (index + 2) % 3;
  },

  getNextWeekIndex:function(index) {
    return (index + 1) % 3;
  },

  /**
   * 渲染周次
   * @param:index 轮播的索引
   * @param:firstTimeOfWeek 周次的起始时间戳
   */
  renderWeek:function() {
    let index = this.data.currentIndex,
    firstTimeOfWeek = this.data.firstTimeOfCurrentWeek;
    let that = this;
    let header = {
      'content-type': 'application/json; charset=utf-8',
      'cookie': "token=" + wx.getStorageSync("token")//读取cookie
    };
  
    app.RequestInter.getEventList({
      data: {
        startTime: firstTimeOfWeek,
        endTime: firstTimeOfWeek + 7 * 24 * 60 * 60 * 1000
      }
    })
      .then(res => {
        if (res.message == "success") {
          let eventListArr = that.data.eventList,
            temp, data, topDis, leftDis, heightDis,
            startHour = 7,
            endHour = 23,
            blockWidth = 92,
            minBlockHeight = 16,    //px
            lineWidth = 1.5,
            blockHeight = that.data.lineHeight,
            fixLeft = 100,
            nowTime = new Date();

          let lastWeekIndex = that.getLastWeekIndex(index);
          let nextWeekIndex = that.getNextWeekIndex(index);

          eventListArr = [[], [], []];
          //设置标题栏
          let nowDay = nowTime.getDay();
          let firstDate = new Date(firstTimeOfWeek - 7 * 24 * 60 * 60 * 1000);
          let dateNameArrList = that.data.weekName;
          for (let i = 0, len = 7; i < len; i++) {
            dateNameArrList[lastWeekIndex][i].dateName = firstDate.getDate();
            firstDate.setDate(firstDate.getDate() + 1);
          }
          for (let i = 0, len = 7; i < len; i++) {
            dateNameArrList[index][i].dateName = firstDate.getDate();
            firstDate.setDate(firstDate.getDate() + 1);
          }
          for (let i = 0, len = 7; i < len; i++) {
            dateNameArrList[nextWeekIndex][i].dateName = firstDate.getDate();
            firstDate.setDate(firstDate.getDate() + 1);
          }
          
          //添加当前时间线，只显示6点到22点，好的偷偷的说现在23点了
          let timeLineLeft, timeLineTop;
          // 当前时间到该周次起始时间的天数
          let distance = parseInt((new Date().getTime() - firstTimeOfWeek) / (24 * 60 * 60 * 1000));
          if (nowTime.getHours() >= endHour || nowTime.getHours() <= startHour || distance < 0 || distance > 6) {
            timeLineLeft = -100;
            timeLineTop = -100;
          } else {
            // 获取该周第一天到现在的天数
            
            timeLineLeft = fixLeft + (nowTime.getDay()) * blockWidth + lineWidth * distance;
            timeLineTop = ((nowTime.getHours() - startHour) * 60 + (nowTime.getMinutes())) * blockHeight / 60;
          }

          for (let i = 0, len = res.data.length; i < len; i++) {
            data = res.data[i];


            let startTime = new Date(data.startTime);
            let endTime = new Date(data.endTime);

            //距离上方的距离
            if (data.type == 2 || data.type == 0) {
              heightDis = ((endTime.getHours() * 60 + endTime.getMinutes()) - (startTime.getHours() * 60 + startTime.getMinutes())) * blockHeight / 60;
              topDis = ((startTime.getHours() - startHour) * 60 + (startTime.getMinutes())) * blockHeight / 60;
              leftDis = fixLeft + (startTime.getDay()) * blockWidth + lineWidth * startTime.getDay();

            } else if (data.type == 1) {
              topDis = ((endTime.getHours() - startHour) * 60 + (endTime.getMinutes())) * blockHeight / 60;
              leftDis = fixLeft + (endTime.getDay()) * blockWidth + lineWidth * endTime.getDay();
              heightDis = 0;
              //考虑23点情况
              if (topDis + minBlockHeight > that.data.lineHeight * 16) {
                topDis = that.data.lineHeight * 16 - minBlockHeight;
                heightDis = 16;
              }

            }
            temp = {
              title: data.title,
              address: data.address,
              top: topDis,
              left: leftDis,
              height: heightDis,
              color: colorLib[data.color]["rgb"],
              type: data.type
            }
            eventListArr[index].push(temp);
          }
        
          console.log(eventListArr);
          that.setData({
            eventList: eventListArr,
            weekName: dateNameArrList,
            dateNameIndex: distance,
            nowTimeLine: {
              left: timeLineLeft,
              top: timeLineTop
            }
          })

      

        }
      })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
