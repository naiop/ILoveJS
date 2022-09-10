const express = require('express') // 引入 express
const app = express() // 实例一个 express 对象
const bodyParser = require('body-parser'); // express框架中用req.body接收post客户端的数据, 
app.use(require('cors')()) // 解决跨域
app.use(express.json()) // express处理json数据

app.use(bodyParser.json());
app.use(bodyParser.urlencoded())
app.use(bodyParser.urlencoded({ extended: false }))


const Task = require('./utils/task');
const arrRoutes = require('./utils/routers');
require('./utils/swaggerUI')(app);

for (const route of arrRoutes) {
  app.use(route.path, require(route.component));
}

app.listen(3001, () => {
  console.log('localhost:3001');
  Task.scheduleTask()
});

module.exports = app;