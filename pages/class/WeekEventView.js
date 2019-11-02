/**
 * 周次事件处理类
 */

class WeekEventView {

  constructor(){}

  process(weekStartTime, eventList) {
    let weekEvent = [[], [], [], [], [], [], []];
    // 按星期几分类
    eventList.forEach(function(event){
      let index = Math.floor((event._endTime - weekStartTime) / (24 * 60 * 60 * 1000));
      weekEvent[index].push(event);
    });
    // 排序并处理
    weekEvent.forEach(function(everyDay){
      everyDay.sort(sortEvent);

      var stack = new Stack();
      everyDay.forEach(function(event){
        // 栈空直接压栈
        if(stack.isEmpty()) {
          stack.push(event);
        }else {
          // 栈不空，不断出栈，直到栈空或遇到栈顶事件的截止时间大于时间的开始时间
          while(!stack.isEmpty()) {
            var lastEvent = stack.peek();
            if(lastEvent._bottom <= event._top) {
              stack.pop();
            }else{
              break;
            }
          }
          // 栈空则压栈
          if(stack.isEmpty()) {
            stack.push(event);
          }else {
            // 根据上个事件获取并行索引
            var lastEvent = stack.peek();
            event._parallelIndex = lastEvent._parallelIndex + 1;
            event._parallel = event._parallelIndex + 1;

            // 将并行的事件根据条件加一
            let inRangeStack = new Stack();
            inRangeStack.push(event);
            let top = event._top;
            while(!stack.isEmpty()) {
              inRangeStack.push(stack.pop());
              let peek = inRangeStack.peek();
              if(peek._bottom > top) {
                peek._parallel = Math.max(peek._parallel, event._parallel);
                top = peek._top;
              }else {
                break;
              }
            }
            // 弹回原来的栈
            while(!inRangeStack.isEmpty()) {
              stack.push(inRangeStack.pop());
            }
          }
        }
      });
    });

    let sortedList = [];
    weekEvent.forEach(function(everyDay){
      everyDay.forEach(function(event){
        sortedList.push(event);
      });
    })
    return sortedList;
  }  

  
}


function sortEvent(event1, event2) {
  if (event1._top == event2._top)
    return event1._bottom - event2._bottom;
  else return event1._top - event2._top;
}


function Stack() {

  var items = [];

  this.push = function (element) {
    items.push(element);
  };

  this.pop = function () {
    return items.pop();
  };

  this.peek = function () {
    return items[items.length - 1];
  };

  this.isEmpty = function () {
    return items.length == 0;
  };

  this.size = function () {
    return items.length;
  };

  this.clear = function () {
    items = [];
  };

  this.print = function () {
    console.log(items.toString());
  };

  this.toString = function () {
    return items.toString();
  };
}

export default WeekEventView;