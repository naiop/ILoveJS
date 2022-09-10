const schedule = require('node-schedule'); //定时服务
const request = require('./request');  

let scheduleTask = () => {
    //每天的凌晨1点1分30秒触发
    schedule.scheduleJob('30 1 1 * * *', () => {
      console.log('schedule:' + new Date());
      let select = {
        account: '17797518122',
        password: 'step124578'
      }
      request.service({
        url: 'http://47.103.68.175:3001/vue-admin-template/api/stepscript',
        method: 'get',
        params: select
      })
    });
  }

  module.exports=  { scheduleTask }