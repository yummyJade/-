import Request from './Request.js';
//注意变量命名规范
class RequestInter{
  constructor() {
    this._baseUrl = 'https://itstudio.club';
    this._defaultHeader = { 'Content-Type': 'application/json' }
    this._request = new Request(); 
    this._request.setErrorHandler(this.errorHander);
    this._withTokenHeader = { 'Content-Type': 'application/json; charset=utf-8', 'cookie': "token=" + wx.getStorageSync("token")};
    this._withTokenHeaderInForm = { 'Content-Type': 'application/x-www-form-urlencoded', 'cookie': "token=" + wx.getStorageSync("token") }
  }

  /**
   * 统一的异常处理方法
   */
  errorHander(res) {
    debugger;
    let status = res.data.status;
    switch(status) {
      case 400: {
        wx.showModal({
          title: res.data.message,
          content: '',
          showCancel: false
        })
        break;
      }
      case 401: {
        wx.clearStorage();
        wx.reLaunch({
          url: '/pages/adminLogin/adminLogin',
        })
        break;
      }
      case 402: {
        wx.showModal({
          title: '教务系统连接失败，请稍后再试',
          content: '',
          showCancel: false
        })
        break;
      }
      case 403: {
        wx.showModal({
          title: '账号或密码错误',
          content: '',
          showCancel: false
        })
        break;
      }
    }
  }

  tokenHeader(){
    return { 
      'Content-Type': 'application/json; charset=utf-8', 
      'cookie': "token=" + wx.getStorageSync("token") }
  }
  tokenHeaderInForm() {
    return { 
      'Content-Type': 'application/x-www-form-urlencoded', 
      'cookie': "token=" + wx.getStorageSync("token") }
  }

  /**
   * 获取事件的接口
   */
  getEventList({
    data: data ={
      startTime: startTime,
      endTime: endTime
    },
    header: header = this.tokenHeader()
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
    header: header = this.tokenHeader()
    
  }){
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
    header: header = this.tokenHeaderInForm()
   
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
    header: header = this.tokenHeader()
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
    header: header = this.tokenHeader()
  }){
    return this._request.getRequest({
      url: this._baseUrl + '/event/share/list',
      header: header
    })
    .then(res => res.data)
    .catch(err => err)
  }

  /**
   * 处理他人共享事件的接口
   */
  dealShareEvent({
    
    data: data = {
      shareID: shareID,
      eventID: eventID,
      valid: valid
    },
    header: header = this.tokenHeaderInForm()
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
    header: header = this.tokenHeader()
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
    header: header = this.tokenHeader()
  }){
    return this._request.getRequest({
      url: this._baseUrl + '/jw/stu/info',
      header: header
    })
      .then(res => res.data)
      .catch(err => err)
  }

  /**
   * 更新用户信息
   */
  updateUserInfo({
    data: data = {
      userName: userName,
      email: email,
      grade: grade,
      specialty: specialty
    },
    header: header = this.tokenHeader()
  }) {
    return this._request.postRequest({
      url: this._baseUrl + '/jw/stu/info',
      header: header,
      data: data
    }).then(res => res.data)
    .catch(err => err)
  }

  /**
   * 获取提醒列表
   */
  getNoticeList({
    header: header = this.tokenHeader()
  }) {
    return this._request.getRequest({
      url: this._baseUrl + '/event/notice',
      header: header
    })
      .then(res => res.data)
      .catch(err => err)
  }
}


export default RequestInter;
