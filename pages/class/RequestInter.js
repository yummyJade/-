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
}


export default RequestInter;
