const sql = require("mssql"); // 调用 SQL server模块
// 创建连接
var dbConfig = {
  server: " ",
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
    var conn = new sql.ConnectionPool(dbConfig);
    var req = new sql.Request(conn);
    conn.connect(function (err) {
      if (err) {
        console.log(err);
        resolve([err]);
        // return;
      }
      req.query(sqls, function (err, recordset) {
        // if (err) {
        //     console.log(err);
        //     return;
        // }
        // else {
        //     console.log(recordset);
        // }
        conn.close();
        resolve([err, recordset]);
      });
    });
  });
}


module.exports = {  executeSQL };
