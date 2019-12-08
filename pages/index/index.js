//index.js
import Time from '../class/Time.js';
import colorLib from '../class/Constant.js';
import Event from "../class/Event.js"
import WeekEventView from "../class/WeekEventView.js"

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
    ]
    
    ,
    nowTimeLine:{   //记录当前时间线
      left:-100,
      top:-100
    },

    /**
     * 记录轮播所需信息
     */
    currentIndex: 0,  // 当前轮播的索引

    // 记录当前周次的开始时间的时间戳

    firstTimeOfCurrentWeek: new Time().getDaysAfterTime(-(new Date().getDay()), 0),
    swiperSize: 3,
    open: false,
    // mark 是指原点x轴坐标
    mark: 0,
    // newmark 是指移动的最新点的x轴坐标 
    newmark: 0,
    istoright: true,

    hiddenMenu: true



  },
  /**
   * 共享事件跳转
   */
  navigateShareList: function(){
    wx.navigateTo({
      url: '/pages/eventList/eventList',
    })
  },

  /**
   * 提醒列表跳转
   */
  toNoticeList: function(){
    wx.navigateTo({
      url: '/pages/noticeList/noticeList',
    })
  },
  /**
   * 左侧导航栏的代码
   */
  // 点击左上角小图标事件
  tap_ch: function (e) {
      this.setData({
        open: !this.data.open,
        hiddenMenu: !this.data.hiddenMenu
      })
  },

  /**
   * 点击查看详情
   */
  bindReminderBlock: function(e) {
    let eventID = e.currentTarget.dataset.id;
    let remindObj;
    for(let i = 0; i < this.data.eventList.length; i++) {
      if (this.data.eventList[i].length != 0) {
        for (let j = 0; j < this.data.eventList[i].length; j++) {
          if (this.data.eventList[i][j]["_eventID"] == eventID) {
            remindObj = this.data.eventList[i][j];
            break;
          }
        }
      }
      
    }
    let remindBlock = JSON.stringify(remindObj);
    wx.navigateTo({
      url: '../detailContent/detailContent?remindObj='+ remindBlock,
    })
    
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
    }
    return calcuBodyHeight();
   
  },
  /**
   * 处理一下缓存事宜
   */
  IsStorage: function(key){
    //先判断有无该键值的缓存
    let val = wx.getStorageSync(key);
    return !(val == "");
  },
  renderByStorage: function(){
    //先判断有无该键值的缓存
    // eventList
    let key = this.data.firstTimeOfCurrentWeek;
    let val = wx.getStorageSync(key);
    if(val == "") {
      return false;
    }else {
      // for(let i = 0; i < )
    }
    
  },
  /**
   * 更新缓存
   */
  updateStorage: function(){

  },
  /**
   * 做一些初始化
   */
  init:function(){
    let that = this;
      const f1 = async function(){
        let { f1, f2 } = await that.calcu();
        that.setData({
          headerHeight:f2,
          scrollHeight: f1 ,
          lineHeight: (f1 - f2) / 16
        })
        that.renderWeek(that.data.currentIndex, that.data.firstTimeOfCurrentWeek);
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
      this.renderWeek(currentIndex, firstTimeOfCurrentWeek + 7 * 24 * 60 * 60 * 1000);
    }else {
      this.renderWeek(currentIndex, firstTimeOfCurrentWeek - 7 * 24 * 60 * 60 * 1000);
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
  renderWeek: function (index, firstTimeOfWeek) {
    let that = this;
    that.renderDate(index, firstTimeOfWeek);
    wx.getStorage({
      key: 'week-' + firstTimeOfWeek,
      success: function(res) {
        that.rendEvents(index, firstTimeOfWeek, res.data);
      },
    }),
    app.RequestInter.getEventList({
      data: {
        startTime: firstTimeOfWeek,
        endTime: firstTimeOfWeek + 7 * 24 * 60 * 60 * 1000
      }
    })
      .then(res => {
        if (res.message == "success") {
          wx.setStorage({
            key: 'week-' + firstTimeOfWeek,
            data: res.data,
          })
          that.rendEvents(index, firstTimeOfWeek, res.data);
        }
      })
  },

  // 渲染日期
  renderDate: function(index, firstTimeOfWeek) {
    let lastWeekIndex = this.getLastWeekIndex(index);
    let nextWeekIndex = this.getNextWeekIndex(index);
    let firstDate = new Date(firstTimeOfWeek - 7 * 24 * 60 * 60 * 1000);
    let dateNameArrList = this.data.weekName;

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

    this.setData({
      weekName: dateNameArrList,
      firstTimeOfCurrentWeek: firstTimeOfWeek
    })
  },

  // 渲染事件
  rendEvents: function (index, firstTimeOfWeek, events) {
      let that = this;
      // 若要渲染的周次时间与当前显示的周次时间不一致，则不渲染，网络延迟时容易发生
      let realCurrentFirstTime = that.data.firstTimeOfCurrentWeek;
      if(realCurrentFirstTime !== firstTimeOfWeek) return;

      
      let eventListArr = that.data.eventList,

        data, topDis, leftDis, heightDis, bottomDis,
        startHour = 7,
        endHour = 23,
        blockWidth = 92,
        minBlockHeight = 16,    //px
        lineWidth = 1.5,
        blockHeight = that.data.lineHeight,
        fixLeft = 0,
        nowTime = new Date();

      eventListArr = [[], [], []];

      //添加当前时间线，只显示6点到22点，好的偷偷的说现在23点了
      let timeLineLeft, timeLineTop;
      // 当前时间到该周次起始时间的天数
      let distance = Math.floor((new Date().getTime() - firstTimeOfWeek) / (24 * 60 * 60 * 1000));
      if (nowTime.getHours() >= endHour || nowTime.getHours() <= startHour || distance < 0 || distance > 6) {
        timeLineLeft = -100;
        timeLineTop = -100;
      } else {
        // 获取该周第一天到现在的天数
        timeLineLeft = fixLeft + (nowTime.getDay()) * blockWidth + lineWidth * distance;
        timeLineTop = ((nowTime.getHours() - startHour) * 60 + (nowTime.getMinutes())) * blockHeight / 60;
      }

    for (let i = 0, len = events.length; i < len; i++) {
        data = events[i];


        let startTime = new Date(data.startTime);
        let endTime = new Date(data.endTime);

        //距离上方的距离
        if (data.type == 2 || data.type == 0) {
          // console.log(endTime.getHours())
          // heightDis = ((endTime.getHours() * 60 + endTime.getMinutes()) - (startTime.getHours() * 60 + startTime.getMinutes())) * blockHeight / 60;
          topDis = ((startTime.getHours() - startHour) * 60 + (startTime.getMinutes())) * blockHeight / 60;
          bottomDis = ((endTime.getHours() - startHour) * 60 + (endTime.getMinutes())) * blockHeight / 60;
          heightDis = bottomDis - topDis;
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

        let event = new Event(
          data.eventID,
          data.shareID,
          data.title,
          data.address,
          data.remark,
          colorLib[data.color]["rgb"],
          data.startTime,
          data.endTime,
          data.type,
          topDis,
          leftDis,
          heightDis
        );
        eventListArr[index].push(event);
      }

      let weekEventView = new WeekEventView();
      eventListArr[index] = weekEventView.process(firstTimeOfWeek, eventListArr[index]);
      that.setData({
        eventList: eventListArr,
        dateNameIndex: distance,
        nowTimeLine: {
          left: timeLineLeft,
          top: timeLineTop
        },
        currentIndex: index,
      })
  },


  /**
   * 触发添加事件/提醒的功能
   */
  addBtnEvent: function(options){
    wx.navigateTo({
      url: '/pages/addEvent/addEvent',
    })
  },

  /**
   * 退出登录
   */
  logout: function(){
    wx.clearStorage();
    wx.reLaunch({
      url: '/pages/adminLogin/adminLogin',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 未登录返回登录界面
    wx.getStorage({
      key: 'token',
      fail: function(e) {
        wx.reLaunch({
          url: '/pages/adminLogin/adminLogin'
        })
      }
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
    this.init();
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
