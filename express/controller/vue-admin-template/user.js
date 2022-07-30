var app = require('express')();
var sqlConnect = require('../../utils/mssqlTool.js')
var myres = require('../../utils/responseMsg')

/**
* get /vue-admin-template/user/GetUser  
* @summary 获取所有用户信息
* @tags User Management
* @description 获取所有用户 
*/
app.get('/user/GetUser', (req, res) => {
  GetUser().then((result)=>{res.send(result)})
})
//-----------------登录 权限--------------------------

/**
* post /vue-admin-template/user/login  
* @summary 登录
* @tags User Management
* @description vue-admin登录 
* @param {string}  request.body.required  -  账号   密码    
*/
app.post('/user/login', (req, res) => {
  login(req).then(result=>{res.send(result)}).catch(err=>{res.send(err)})
})

/**
* get /vue-admin-template/user/info  
* @summary 获取当前用户信息
* @tags User Management
* @description token 获取用户信息
* @param {string}  token.query.required  -  token 
*/
app.get('/user/info', (req, res) => {
  getInfo(req).then(result=>{res.send(result)}).catch(err=>{res.send(err)})
})

/**
* post /vue-admin-template/user/logout  
* @summary 登出
* @tags User Management
* @description vue-admin登出
*/
app.post('/user/logout', (req, res) => {
  myres.response.code = 20000
  myres.response.data = 'success'
  res.send(myres.response)
})
//----------------------------------------------------

async function getInfo(req) {
  try {
  // console.log(req.body)  // body
  // console.log(req.params) //
  // console.log(req.query) // URL ? params
    let sql = `SELECT * FROM t_user T WHERE Token= '${req.query.token}'`;
    let [err, recordset] = await sqlConnect.executeSQL(sql);
    if (err != undefined || err != null) {
      throw err;
    }
    else {
      myres.response.code = 20000
      let userinfo = recordset.recordsets[0][0]
      myres.response.data = {
        roles: userinfo.roles.split(','),
        introduction: userinfo.introduction,
        avatar: userinfo.avatar,
        name: userinfo.name
      }
      // myres.response.data = {
      //   roles: ['admin'],
      //   introduction: 'I am a super administrator',
      //   avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      //   name: 'Super Admin'
      // }
      return myres.response
    }
  } catch (error) {
    myres.response.message = error.message
    myres.response.data = null
    return myres.response
  }
}

async function login(req) {
  try {
    if (req.body.username == null || req.body.username.length <= 0) {
      throw "用户名不能为空";
    }
    if (req.body.password == null || req.body.password.length <= 0) {
      throw "密码不能为空";
    }
    let sql = `SELECT T.Token FROM t_user T WHERE UserName= '${req.body.username}' AND Password = '${req.body.password}'`;
    let [err, recordset] = await sqlConnect.executeSQL(sql);
    if (err != undefined || err != null) {
      throw err;
    }
    else {
      let token = recordset.recordsets[0]
      myres.response.code = 20000
      myres.response.data = {token: token[0].Token}
      return  myres.response
    }
  } catch (error) {
    myres.response.message = error.message
    myres.response.data = null
  }
}

async function GetUser() {
  try {
    let sql = `SELECT * FROM t_user`;
    let [err, recordset] = await sqlConnect.executeSQL(sql);
    if (err != undefined || err != null) {
      throw err;
    }
    else {
      let dataItem = { items: [], total: 0 }
      dataItem.items = recordset.recordsets[0]
      dataItem.total = recordset.recordsets[0].length
      myres.response.data = dataItem
      return myres.response
    }
  } catch (error) {
    myres.response.message = error.message
    myres.response.data = null
  }
}

module.exports = app;
