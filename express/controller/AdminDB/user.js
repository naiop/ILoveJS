var app = require('express')();
var sqlConnect  = require('../../utils/mssqlTool.js')

/**
 * get /api/GetAllUser
 * @summary 获取所有用户
 * @tags GetAllUser
 * @description 获取所有用户 
 */
app.get('/', (req, res) => {
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
    let sql = `SELECT * FROM ST_User`;
    let [err,recordset]=await sqlConnect.executeSQL(sql)
    if (recordset.length != 0) {
      return recordset
    } else {
      return false
    }
  }

  module.exports = app;