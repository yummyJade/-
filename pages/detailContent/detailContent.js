// pages/detailContent/detailContent.js
import { formatTime} from '../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    remindBlock:{
      title:"历史",
      eventID:"886677",
      shareID:"88999000",
      address:"这是一个地点",
      remark:"这是一个备注",
      startTime:"2019212",
      endTime:"2232",
      color:[100,100,100]
    },
    daykey:{
      "0":"日",
      "1":"一",
      "2":"二",
      "3":"三",
      "4":"四",
      "5":"五",
      "6":"六",

    }
  },
  /**
   * 转换日期格式
   */
  formatTime: function(date){
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
    return month+"月"+day+"日"+ " " + "星期"+this.data.daykey[index] + hour +":" + min;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(formatTime)
    // debugger;
    if(options != null){
      let remindTemp = JSON.parse(options.remindObj);
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
        remindBlock: obj
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