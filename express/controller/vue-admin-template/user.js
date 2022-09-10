var app = require('express')();
var sqlConnect = require('../../utils/mssqlTool.js')
var { ResponseMessage } = require('../../utils/ResponseMessage')
const { authorize, base64 } = require('../../utils/Authorize');
const _ResponseMessage = new ResponseMessage()
const _authorize = new authorize()


/**
* get /vue-admin-template/user/GetUser  
* @summary 获取所有用户信息
* @security BasicAuth
* @tags User Management
* @description 获取所有用户 
*/
app.get('/user/GetUser', (req, res) => {
  try {
    if (_authorize.decrypt(req.headers.authorization)) {
      GetUser(req).then((result)=>{res.send(result)})
    }else{
      res.send( _ResponseMessage.Fail(null,null,null,'error authorization' ))
    }
  } catch (error) {
    res.send( _ResponseMessage.Fail(null,null,null,error.message ))
  }

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
  login(req).then(result=>{res.send(result)}).catch(err=>{res.send( _ResponseMessage.Fail(null,null,null,err.message ))})
})

/**
* get /vue-admin-template/user/info  
* @summary 获取当前用户信息
* @tags User Management
* @description token 获取用户信息
* @param {string}  token.query.required  -  token 
*/
app.get('/user/info', (req, res) => {
  try {
    getInfo(req).then(result=>{
      res.send( result )
    }).catch(err=>{
      res.send( _ResponseMessage.Fail(null,null,null,err.message ))
    })
  } catch (error) {
    res.send( _ResponseMessage.Fail(null,null,null,error.message ))
  }
  
})

/**
* post /vue-admin-template/user/logout  
* @summary 登出
* @tags User Management
* @description vue-admin登出
*/
app.post('/user/logout', (req, res) => {
  res.send(_ResponseMessage.Success(20000, 'success' ))
})

/**
* post /vue-admin-template/user/register  
* @summary 用户注册
* @tags User Management
* @param {string}  name.query.required  -  name 
* @param {string}  username.query.required  -  username 
* @param {string}  password.query.required  -  password 
* @description vue-admin注册用户
*/
app.post('/user/register', (req, res) => {
  try {
    register(req).then(result=>{
      res.send( result )
    }).catch(err=>{
      res.send( _ResponseMessage.Fail(null,null,null,err.message ))
    })
  } catch (error) {
    res.send( _ResponseMessage.Fail(null,null,null,error.message ))
  }
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

      let userinfo = recordset.recordsets[0][0]
      // myres.response.data = {
      //   roles: ['admin'],
      //   introduction: 'I am a super administrator',
      //   avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      //   name: 'Super Admin'
      // }
      return  _ResponseMessage.Success(20000, {
        roles: userinfo.roles.split(','),
        introduction: userinfo.introduction,
        avatar: userinfo.avatar,
        name: userinfo.name
      })
    }
  } catch (error) {
    return _ResponseMessage.Fail(null,null,null,error.message )
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
      return _ResponseMessage.Success(20000, {token: token[0].Token})
    }
  } catch (error) {
    return _ResponseMessage.Fail(null,null,null,error.message )
  }
}

async function GetUser(req) {
  try {
    let sql = `SELECT TOP ${req.query.limit} * FROM t_user WHERE  id >
    (
        SELECT ISNULL(MAX(id),0) FROM
        (
            SELECT TOP ((${req.query.page}-1)*${req.query.limit}) id FROM t_user   ORDER BY id 
        ) AS tempTable
    ) 
    ORDER BY id`;
    let [err, recordset] = await sqlConnect.executeSQL(sql);
    let [err_total, recordset_total] = await sqlConnect.executeSQL(`SELECT Id FROM t_user`);
    if (err != undefined || err != null) {
      throw err;
    }
    else {
      return _ResponseMessage.Success(20000, {items: recordset.recordsets[0] , total: recordset_total.recordsets[0].length })
    }
  } catch (error) {
    return _ResponseMessage.Fail(null,null,null,error.message )
  }
}

async function register(req){
  try {

    let [err, str] = await sqlConnect.executestoredprocedure(req.query.name,req.query.username,req.query.password);
    if (str == 20000) {
      return _ResponseMessage.Success(20000, '注册成功', null,`注册成功, ${str}`) // 返回20000注册成功,0 失败
    }
    else if(err != undefined || err != null){
      throw err;
    }
    else{
      return _ResponseMessage.Success(20000, '注册成功', null,`注册失败, ${str}`) // 返回20000注册成功,0 失败
    }
  } catch (error) {
    return _ResponseMessage.Fail(null,null,null,error.message )
  }
}

module.exports = app;
