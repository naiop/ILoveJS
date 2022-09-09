const express = require('express') // 引入 express
const app = express() // 实例一个 express 对象
const bodyParser = require('body-parser'); // express框架中用req.body接收post客户端的数据,
const schedule = require('node-schedule'); //定时服务
const request = require('./utils/request');   
app.use(require('cors')()) // 解决跨域
app.use(express.json()) // express处理json数据

app.use(bodyParser.json());
app.use(bodyParser.urlencoded())
app.use(bodyParser.urlencoded({ extended: false }))

const arrRoutes = require('./utils/routers');
require('./utils/swaggerUI')(app);

for (const route of arrRoutes) {
  app.use(route.path, require(route.component));
}

app.listen(3001, () => {
  console.log('localhost:3001');
  scheduleTask()
});

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




module.exports = app;