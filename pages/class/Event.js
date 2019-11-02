class Event{
  constructor(eventID, shareID, title, address, remark, color, startTime, endTime, type, top, lineLeft, height){
    this._eventID = eventID,      // 事件ID，唯一标志事件
    this._shareID = shareID,      // 事件共享ID
    this._title = title,          // 标题
    this._address = address,      // 地点
    this._remark = remark,        // 备注
    this._color = color,          // 颜色
    this._startTime = startTime,  // 起始时间
    this._endTime = endTime,      // 截止时间
    this._type = type,            // 事件类型
    this._top = top,              // 标志位置：top
    this._LeftLine = lineLeft,    // 标志位置：左竖线的位置
    this._height = height,        // 标志高度：height
    this._bottom = top + height,  // 标志高度：底部高度，
    this._parallel = 1,           // 并行事件数
    this._parallelIndex = 0;      // 事件的时间范围内，并行事件的索引
  }
}

export default Event;