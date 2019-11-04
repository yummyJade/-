// pages/addEvent/addEvent.js
import Time from '../class/Time.js';
Page({

  /**
   * 页面的初始数据
   */
  //将time换成当前时间
  data: {
    eventTypeIndex: 1,
    eventType: ["提醒", "活动"],
    time: '12:01',
    endTime: '12:01',
    startTime: '12.01',
    setStartDate:'',
    setEndDate:'',
    serEndTime:'',
    setStartTime:'',
    setEndTime:'',
    chooseDate: '2016-09-01',
    multiStartArray: [],
    multiStartIndex: [0, 0, 0],
    
    multiEndArray: [],
    multiEndIndex: [0, 0, 0],

  },
  updateEndTime: function (startHour, startMin, len){
    // let time = new Time();
    // let startDate = time.strToDate1(startTime);   //转
    // let endDate
    let date = new Date();
    let startDate = new Date(date.getFullYear(),date.getMonth(),date.getDate(),startHour,startMin).getTime();
    let endDate = new Date(startDate + len* 60 * 1000);
    //如果大于23：00，设为23：00
    // console.log(endDate)
    let that = this;
    if (endDate > new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23)) {
      let mutiEndArr = [];
      let minArr = [];
      minArr.push("00");
      mutiEndArr = [[23], minArr];
      let mutiEndIndex = [0,0];
      return [mutiEndArr, mutiEndIndex];
    }else{
      let mutiEndIndex = [0, 0];
      // for(let j = 0; j < 2; j++){
        for (let i = 0; i < that.data.multiEndArray[0].length; i++) {
          if (that.data.multiEndArray[0][i] == endDate.getHours()) {
            mutiEndIndex[0] = i;
          }
        }
      for (let i = 0; i < that.data.multiEndArray[1].length; i++) {
        if (that.data.multiEndArray[1][i] == endDate.getMinutes()) {
          mutiEndIndex[1] = i;
        }
      }
      // }
      
      return [this.data.multiEndArray, mutiEndIndex];
    }


  },
  bindMultiPickerColumnChange: function (e) {
    let date = new Date();
    let nowHour = date.getHours();
    let nowChooseHour ;
    // let nowHour = 18;
    // let nowHour;
    let startHour = 7;    //不可早于7点
    let endHour = 23;     //亦不可晚于23点，考虑边界情况
    let hourArr = [];
    let minArr = [];
    let multiStartArr= [], multiEndArr = [];
    let multiEndIndex ;
    let multiStartIndex = this.data.multiStartIndex;
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
   
    multiStartIndex[e.detail.column] = e.detail.value;
    

    nowChooseHour = this.data.multiStartArray[0][multiStartIndex[0]];
    //判断当前选择小时的情况
    //考虑16：57情况
    //7:00
    if (nowChooseHour == date.getHours()){     //如果选择为当前小时
      for (let i = this.getNearMin(date.getMinutes(), 5); i < 60; i = i + 5) {
          minArr.push(this.zeroFill(i, 2));
      }
      
    }else if(nowChooseHour >= startHour && nowChooseHour < endHour){          //选中的不为当前小时
      for (let i = 0; i < 60; i = i + 5) {
        minArr.push(this.zeroFill(i, 2));
      }
    }else if(nowChooseHour == endHour){
      minArr.push("00");
    }
    multiStartArr = [this.data.multiStartArray[0], minArr];
    // multiEndArr = [this.data.multiStartArray[0], minArr];
    //16:57
    if (this.getNearMin(date.getMinutes(), 5) == 60 && nowChooseHour == date.getHours()) {
      hourArr = time.buildArr(nowHour+1, endHour);    //!!修改
      multiStartArr = [hourArr, minArr];
    }
    // console.log(multiStartArr[0][data.multiStartIndex[0]]);
    [multiEndArr, multiEndIndex] = this.updateEndTime(multiStartArr[0][multiStartIndex[0]], multiStartArr[1][multiStartIndex[1]],60);
    console.log(multiEndIndex);
    this.setData({
      multiStartArray: multiStartArr,
      multiStartIndex: multiStartIndex,
      multiEndArray: multiEndArr,
      multiEndIndex: multiEndIndex
    });
  },
  bindMultiPickerColumnChange2: function (e) {
    let date = new Date();
    let nowHour = date.getHours();
    let nowChooseHour;
    // let nowHour = 18;
    // let nowHour;
    let startHour = 7;    //不可早于7点
    let endHour = 23;     //亦不可晚于23点，考虑边界情况
    let hourArr = [];
    let minArr = [];
    let multiEndArr = [];
    let multiEndIndex = [0,0];
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    // let data = {
    //   multiEndArray: multiEndArr,
    //   multiEndIndex: this.data.multiEndIndex
    // };
    multiEndIndex[e.detail.column] = e.detail.value;
    console.log(e.detail.column)

    let time = new Time();
    nowChooseHour = this.data.multiEndArray[0][this.data.multiEndIndex[0]];
    //非当天的情况
    if (time.strToDate1(this.data.chooseDate) > new Date(date.getFullYear(), date.getMonth(), date.getDate())) {   //选定大于当前
      //此时显示最大的范围
      hourArr = time.buildArr(startHour, endHour);
      // this.data.multiStartArray[1]
      for (let i = 0; i < 60; i = i + 5) {
        minArr.push(this.zeroFill(i, 2));
      }

      if (nowChooseHour == endHour) {
        minArr.push("00");
      }
      multiEndArr = [hourArr, minArr];
    }else{

   
      //考虑当天的情况
      //判断当前选择小时的情况
      //考虑16：57情况
      //7:00
      if (nowChooseHour == date.getHours()) {     //如果选择为当前小时
        for (let i = this.getNearMin(date.getMinutes(), 5); i < 60; i = i + 5) {
          minArr.push(this.zeroFill(i, 2));
        }

      } else if (nowChooseHour >= startHour && nowChooseHour < endHour) {          //选中的不为当前小时
        for (let i = 0; i < 60; i = i + 5) {
          minArr.push(this.zeroFill(i, 2));
        }
      } else if (nowChooseHour == endHour) {
        minArr = ["00"];
      }
      multiEndArr = [this.data.multiEndArray[0], minArr];
      //16:57
      if (this.getNearMin(date.getMinutes(), 5) == 60 && nowChooseHour == date.getHours()) {
        hourArr = time.buildArr(nowHour+1, endHour);    //!!修改
        multiEndArr = [hourArr, minArr];
      }
    }
      //如果小于开始时间
    
    if (new Date(date.getFullYear(), date.getMonth(), date.getDate(), multiEndArr[0][multiEndIndex[0]], 
      multiEndArr[1][multiEndIndex[1]]) < new Date(date.getFullYear(), date.getMonth(), date.getDate(), this.data.multiStartArray[0][this.data.multiStartIndex[0]],
        this.data.multiStartArray[1][this.data.multiEndIndex[1]])) {
          multiEndIndex = this.data.multiStartIndex;
        }
    let data = {
      multiEndArray: multiEndArr,
      multiEndIndex: multiEndIndex
    };
    this.setData(data);
  },

  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      chooseDate: e.detail.value
    }) 
    //刷新
    let date = new Date();
    
    let multiStartArr = this.flushPickerHour(0);
    let multiEndArr = this.flushPickerHour(1);
    
    this.setData({
      multiStartArray: multiStartArr,
      multiEndArray: multiEndArr,
      multiEndIndex:[0,0],
      multiStartIndex: [0,0]
    })
  },
  /**
   * 事件类型选择，触发事件
   */
  eventTypePickerChange:function(e){
    this.setData({
      eventTypeIndex: e.detail.value
    })
  },
  startTimeChange:function(e){
    console.log("8888")
    this.setData({
      startTime: e.detail.value
    })
  },
  /**
   * 求最近的min
   * n为时间步长
   */
  getNearMin(min,n) {
    // let count = min % n; 
    return Math.ceil(min/n)*n;
  },

  /**
   * 刷新pickerHour
   * 1 start
   * 2 end
   */
  flushPickerHour(type){
    let date = new Date();
    let nowHour = date.getHours();
    // let nowHour = 18;
    let startHour = 7;    //不可早于7点
    let endHour = 23;     //亦不可晚于23点，考虑边界情况
    let nowMinute = date.getMinutes();
    let hourArr = [];
    let minArr = [];
    let multiStartArr = [];

    //考虑情况如下：
    //如果是日期
    //接下来应该判断时间大小问题，应该判断当前时间是否在可选择时间之内
    //判断情况如下
    //1
    //如果日期为当天，那么可选定范围为在可允许时间内，当前时间到最晚时间的距离
    //如果日期不为当天，那么可选定范围为整一天

    //2
    //如果时间为当前小时，那么可选定范围仅为该小时，否则为全部时间
    //注意 当前时间要和5取模或其他方法求最近的5的倍数
    let time = new Time();
    if (time.strToDate1(this.data.chooseDate) > new Date(date.getFullYear(), date.getMonth(), date.getDate())) {   //选定大于当前
      //此时显示最大的范围
      
      hourArr = time.buildArr(startHour, endHour);
      // this.data.multiStartArray[1]
      for (let i = 0; i < 60; i = i + 5) {
        minArr.push(this.zeroFill(i, 2));
      }
      
    }else {
      
      if(nowHour >= startHour && nowHour <= endHour){   //在允许范围内
        hourArr = time.buildArr(nowHour, endHour);    //!!修改
        for (let i = this.getNearMin(nowMinute, 5); i < 60; i = i + 5) {
          minArr.push(this.zeroFill(i, 2));
        }
      }else if(nowHour < startHour) {        //如果处在凌晨
        hourArr = time.buildArr(startHour, endHour);
        for (let i = 0; i < 60; i = i + 5) {
          minArr.push(this.zeroFill(i, 2));
        }
      }       
     
      
    }
    multiStartArr = [hourArr, minArr];
    
    this.setData({
      multiEndIndex: [type, 0],
      multiStartArr: [0, 0],

    })
    return multiStartArr;

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let date = new Date();
    let startHour = 7;    //不可早于7点
    let endHour = 23;     //亦不可晚于23点，考虑边界情况

    

    //检查是否大于22:55，大于则
    if (date > new Date(date.getFullYear(), date.getMonth(), date.getDate(),22,55)) {
      //设置
      this.setData({
        setStartDate: date.getFullYear() + '-' + (date.getMonth()+1) + '-' + (date.getDate()+1),
        setEndDate: (date.getFullYear() + 1) + '-' + (date.getMonth() + 1) + '-' + (date.getDate() + 1),
        chooseDate: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + (date.getDate() + 1),
      })
      // console.log(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + (date.getDate() + 1))
    }else{
      this.setData({
        
        setStartDate: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
        chooseDate: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
        setEndDate: (date.getFullYear() + 1) + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
      })
    }
    let multiStartArr = this.flushPickerHour(0);
    let multiEndArr = this.flushPickerHour(1);
    this.setData({
      multiStartArray: multiStartArr,
      multiEndArray: multiEndArr,
    })

  },
  /**
   * 补0函数
   * num:数字
   * n:位数
   */
  zeroFill(num, n) {
    //-n取后面的几位
    return (Array(n).join(0) + num).slice(-n);
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