const express = require('express') // 引入 express
const app = express() // 实例一个 express 对象

app.use(require('cors')()) // 解决跨域
app.use(express.json()) // express处理json数据

const sql = require('mssql') // 调用 SQL server模块

// 创建连接
var dbConfig = {
  server: '47.103.68.175',
  database: 'Admin',
  user: 'sa',
  password: 'Zkjz@123',
  // port: 1433
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
}

sql.connect(dbConfig, (err) => {
  if (err) throw err
  console.log('连接成功')
})

// 监听端口3000
app.listen(3000, () => {
  console.log('http://localhost:3000/')
})

// ---------------------------------------------------

app.get('/api/GetAll', (req, res) => {
  GetALlUser().then((result) => {
    if (result != null) {

      res.send({ result })
    } else {
      res.send({ result: false, message: 'null' })
    }
  }).catch((error) => {
    res.send({ result: false, message: '异常' })
    console.log(error)
  }).finally(() => {

  })
})


async function GetALlUser() {
  await sql.connect(dbConfig)
  let request = new sql.Request()
  const result = await request.query`SELECT * FROM ST_User`
  if (result.recordset.length != 0) {
    return result.recordset
  } else {
    return false
  }
}

