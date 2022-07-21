const express = require('express') // 引入 express
const app = express() // 实例一个 express 对象
app.use(require('cors')()) // 解决跨域
app.use(express.json()) // express处理json数据

const arrRoutes = require('./utils/routers');
require('./utils/swaggerUI')(app);

for (const route of arrRoutes) {
  app.use(route.path, require(route.component));
}

app.listen(3001, () => {
  console.log('Web Port 3001');
});

module.exports = app;