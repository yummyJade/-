import Request from './Request.js';
//注意变量命名规范
class RequestInter{
  constructor() {
    this._baseUrl = 'https://itstudio.club';
    this._defaultHeader = { 'Content-Type': 'application/json' }
    this._request = new Request(); 
    // this._request.setErrorHandler(this.errorHander);
    this._withTokenHeader = { 'Content-Type': 'application/json; charset=utf-8', 'cookie': "token=" + wx.getStorageSync("token")}
  }

  /**
   * 统一的异常处理方法
   */
  errorHander(res) {
    console.error(res)

  }

  /**
   * 获取事件的接口
   */
  getEventList({
    data:{
      startTime: startTime,
      endTime: endTime
    },
    header: header = this._withTokenHeader
  }){
    let data = {
          startTime: startTime,
          endTime: endTime
        }
  
    return this._request.getRequest({
      url: this._baseUrl + '/event',
      data: data,
      header: header,
    })
      .then(res => res.data)
  }

  /**
   * 创建事件的接口
   */
  createEvent({
    data: data = {
      title: title,
      address: address,
      color: color,
      remark: remark,
      type: type,
      startTime: startTime,
      endTime: endTime,
      shareID: shareID
    },
    header: header = this._withTokenHeader
    
  }){
  // debugger;
    return this._request.postRequest({
      url: this._baseUrl + '/event',
      data: data,
      header: header,
    })
      .then(res => res.data)
  }

  /**
   * 获得课程列表的接口
   *
   */
  getCourseList({
    header: header = this._withTokenHeader
  }){
    return this._request.getRequest({
      url: this._baseUrl + '/jw/stu/timetable/course',
      header: header
    })
    .then(res => res.data)

  }
  
}


export default RequestInter;
