import Request from './Request.js';
//注意变量命名规范
class RequestInter{
  constructor() {
    this._baseUrl = 'https://itstudio.club';
    this._defaultHeader = { 'Content-Type': 'application/json' }
    this._request = new Request(); 
    // this._request.setErrorHandler(this.errorHander);
    this._withTokenHeader = { 'Content-Type': 'application/json; charset=utf-8', 'cookie': "token=" + wx.getStorageSync("token")};
    this._withTokenHeaderInForm = { 'Content-Type': 'application/x-www-form-urlencoded', 'cookie': "token=" + wx.getStorageSync("token") }
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
    data: data ={
      startTime: startTime,
      endTime: endTime
    },
    header: header = this._withTokenHeader
  }){
   
  
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
   * 删除事件的接口
   */
  deleteEvent({
    data: data = {
      eventID: eventID
    },
    header: header = this._withTokenHeaderInForm
   
  }){
    return this._request.postRequest({
      url: this._baseUrl + '/event/delete',
      data: data,
      header: header
    })
    .then(res => res.data)
    .catch(res => res.data)
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

  /**
   * 获得他人共享事件的接口
   */
  getShareEventList({
    header: header = this._withTokenHeader
  }){
    return this._request.getRequest({
      url: this._baseUrl + '/event/share/list',
      header: header
    })
    .then(res => res.data)
    .catch(err => err)
  }

  /**
<<<<<<< HEAD
   * 处理他人共享事件的接口
   */
  dealShareEvent({
    
    data: data = {
      shareID: shareID,
      eventID: eventID,
      valid: valid
    },
    header: header = this._withTokenHeaderInForm
  }){
    // debugger;
    return this._request.postRequest({
        url: this._baseUrl + '/event/share/deal',
        data: data,
        header: header
    })
    .then(res => res.data)
    .catch(err => err)
  }
  /** 
   * 更新事件接口
   */
  updateEvent({
    data: data = {
      title: title,
      address: address,
      color: color,
      remark: remark,
      type: type,
      startTime: startTime,
      endTime: endTime,
      shareID: shareID,
      eventID: eventID
    },
    header: header = this._withTokenHeader
  }) {
    return this._request.postRequest({
      url: this._baseUrl + '/event/update',
      data: data,
      header: header,
    })
      .then(res => res.data)
  }

  /**
   * 获取个人信息
   */
  getUserInfo({
    header: header = this._withTokenHeader
  }){
    return this._request.getRequest({
      url: this._baseUrl + '/jw/stu/info',
      header: header
    })
      .then(res => res.data)
      .catch(err => err)
  }

  updateUserInfo({
    data: data = {
      userName: userName,
      email: email,
      grade: grade,
      specialty: specialty
    },
    header: header = this._withTokenHeader
  }) {
    return this._request.postRequest({
      url: this._baseUrl + '/jw/stu/info',
      header: header,
      data: data
    }).then(res => res.data)
    .catch(err => err)
  }
  

}


export default RequestInter;
