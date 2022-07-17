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
async function queryUser (username, password) {
  await sql.connect(dbConfig)
  let request = new sql.Request()
  request.input('username', username)
  request.input('password', password)
  const result = await request.query`SELECT * FROM test2 WHERE username=@username AND password=@password`
  if (result.recordset.length === 1) {
    return true
  } else {
    return false
  }
}
/** 登录验证功能,查询用户信息**/
app.get('/login', function (req, res) {
  // 提取输入的用户名和密码

  console.log("123")
  let { username, password } = req.body

  // 判断输入的用户名和密码是否存在于数据库中
  queryUser(username, password).then((result) => {
    // 若正确，则登录成功
    // 否则提示密码或者用户名错误
    if (result) {
      // console.log('登录成功')
      res.send({ result: true, message: '登录成功' })
    } else {
      res.send({ result: false, message: '密码或者用户名错误' })
      // console.log('密码或者用户名错误')
    }
  }).catch((error) => {
    res.send({ result: false, message: '服务器异常，请联系管理员' })
    console.log(error)
  }).finally(() => {

  })
})
// 注册功能
async function registerUser (username, password) {
  // 连接数据库
  await sql.connect(dbConfig)
  // 连接池的全局化
  let request = new sql.Request()
  request.input('username', username)
  request.input('password', password)
  const result = await request.query`insert into  test2 (username ,password ) VALUES (@username,@password)`

  if (result.rowsAffected[0] === 1) {
    return true
  } else {
    return false
  }
}

app.post('/register', function (req, res) {
  let { username, password } = req.body
  console.log(req.body)
  registerUser(username, password).then((result) => {
    if (result) {
      res.send({ result: true, message: '注册成功' })
    } else {
      res.send({ result: false, message: '注册失败，重新注册' })
    }
  }).catch((error) => {
    res.send({ result: false, message: '服务器异常，请联系管理员' })
    console.log(error)
  }).finally(() => {
  })
})

//
async function GetUIDMap () {
  await sql.connect(dbConfig)
  let request = new sql.Request()
  const msg = {
    code: false,
    message: '',
    data: {
      total: '',
      items: []
    }
  }
  const result = await request.query`SELECT * FROM test3`
  if (result.recordset.length !== 0) {
    result.recordset.forEach(element => {
      msg.data.items.push(element)
    })
    msg.code = true
    msg.data.total = result.recordset.length
    return msg
  } else {
    return msg
  }
}
app.post('/GetList', function (req, res) {
  let p = req.body
  GetUIDMap().then((result) => {
    if (result) {
      res.send({ result: result })
    } else {
      res.send({ result: result })
    }
  }).catch((error) => {
    res.send({ result: false, message: '服务器异常，请联系管理员' })
    console.log(error)
  }).finally(() => {

  })
})
