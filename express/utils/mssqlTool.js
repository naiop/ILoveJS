const sql = require("mssql"); // 调用 SQL server模块
var myres = require('./responseMsg')
// 创建连接
var dbConfig = {
  server: "47.103.68.175",
  database: "Admin",
  user: "sa",
  password: "Zkjz@123",
  // port: 1433
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

function executeSQL(sqls) {

    return new Promise((resolve, reject) => {
      try {
  
        var conn = new sql.ConnectionPool(dbConfig);
        var req = new sql.Request(conn);
        conn.connect(function (err) {
          if (err) {
            resolve([err])
            return
          }
          req.query(sqls, function (err, recordset) {
            if (recordset == undefined || recordset == null) {
              throw "abnormal";
            }
            conn.close();
            resolve([err, recordset])
          })
        })
  
  
      } catch (error) {
        myres.response.message = error
        return resolve([error, myres.response])
      }
  
    });


}


module.exports = {  executeSQL };
