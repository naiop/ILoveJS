const schedule = require('node-schedule');
const Queue = require('../utils/queue');


exports.CustomerConfig = class {
    constructor() {
      this.enable = false;//是否使用
      this.taskJs = "";//执行的js脚本
    }
    initBySqlObject(object) {
      this.enabled = object.c_enable;
      this.taskJs = object.c_taskjs;//执行的js脚本
    }
    check() {
      return true;
    }
    testc(){
      return true;
    }
  }

let scheduleTask = () => {
    schedule.scheduleJob('0 0 2,14 * * *',()=>{
      console.log("start exec task!")
      test();
    });
    //每月的5日1点1分30秒
     schedule.scheduleJob('30 1 1 * * 1',()=>{
        console.log("start exec task!")
        test();
     });
  }

let weekday = new Array(7);
weekday[0] = "7";
weekday[1] = "1";
weekday[2] = "2";
weekday[3] = "3";
weekday[4] = "4";
weekday[5] = "5";
weekday[6] = "6";

var taskQueue = new Queue();
var currentList = new Map();

function test(){

    let task = new CustomerConfig();
    task.initBySqlObject(result.data[i]);
    taskQueue.enqueue(task);
}