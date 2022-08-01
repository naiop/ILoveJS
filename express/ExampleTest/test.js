// 定时 进程 任务
const schedule = require('node-schedule');
const Queue = require('../utils/queue');
const child_process = require('child_process');

const errLog = require('../utils/log4').getLogger('req');


var path = __dirname;
var pathName = __filename;

var taskQueue = new Queue();
var currentList = new Map();
var i =0




let weekday = new Array(7);
weekday[1] = "1";
weekday[2] = "2";
weekday[3] = "3";
weekday[4] = "4";
weekday[5] = "5";
weekday[6] = "6";



class CustomerConfig {
  constructor() {
    this.taskName = "";
    this.enable = false;
    this.taskJs = "";
  }
  initObject(object) {
    this.taskName = object.taskName;
    this.enable = object.enable;
    this.taskJs = object.taskJs;
  }
}

let scheduleTask = (task) => {
  //每5秒
  schedule.scheduleJob('0/5 * * * * ?', () => {
    i =+ i + 1
    console.log(`start exec task!${i}` )
    errLog.info(`start exec task!${i}`)
    errLog.info(`${path}\\${task.taskJs}`)
    //child_process fork子进程运行的模块。
    let worker = child_process.fork(`${path}\\${task.taskJs}`, [task.taskName]);
    worker.on('message', (msg) => {
		  try{
      console.log(`message:${JSON.stringify(msg)}`);
      errLog.info(`message:${JSON.stringify(msg)}`)
			currentStatus.get(msg.taskName).push(msg);
		  }catch(error){
        console.log(error);
        errLog.info(error)
        errLog.info(error.message)
		  }
      });
      worker.on('close', (msg) => {
        console.log(`closed:${task.taskName}`);
        errLog.info(`closed:${task.taskName}`)
        currentList.delete(task.taskName);
        // endCallback();
      });
      currentList.set(task.taskName, worker);

  });
}



(function test(){

    let data={
      taskName: '测试',
      enable: true,
      taskJs: "main.js"
    }
    let task = new CustomerConfig();
    task.initObject(data);
    taskQueue.enqueue(task);
    scheduleTask(task)
})()
