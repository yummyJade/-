import Request from './Request.js';
//注意变量命名规范
class RequestInter{
  constructor() {
    this._baseUrl = 'https://itstudio.club';
    this._defaultHeader = { 'Content-Type': 'application/json' }
    this._request = new Request; //没看懂这个是什么意思
    // this._request.setErrorHandler(this.errorHander)
  }
}

