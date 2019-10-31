import Request from './Request.js';
//注意变量命名规范
class RequestInter{
  constructor() {
    this._baseUrl = 'https://itstudio.club';
    this._defaultHeader = { 'Content-Type': 'application/json' }
    this._request = new Request; 
    this._request.setErrorHandler(this.errorHander)
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
    header:{
      
    }
  }){
    let data = data;
    let header = {
      'content-type': 'application/json; charset=utf-8',
      'cookie': "token=" + wx.getStorageSync("token")//读取cookie  ??这个放在这里好么
    };
    return this._request({
      url: _baseUrl + '/event',
      data: data,
      header: header,
    })
  }
}

