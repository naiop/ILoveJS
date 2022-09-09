const mssql = require("mssql"); // 调用 SQL server模块
// 创建连接
var dbConfig = {
server: "",
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
        var conn = new mssql.ConnectionPool(dbConfig);
        var req = new mssql.Request(conn);
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
        return resolve([error])
      }
  
    });
}

function executestoredprocedure(...args) { 
  return new Promise((resolve, reject) => {
    mssql.connect(dbConfig, function (err) {  //连接数据库
        if (err){
        console.log('连接数据库失败');
        return ;
      }else{
        var request = new mssql.Request();	
       
        request.input('name', mssql.VarChar,args[0]);  //传递给存储过程的参数: 名称,类型,值
		  	request.input('username', mssql.VarChar,args[1]);		 
        request.input('password', mssql.VarChar,args[2]);		 
        request.input('msg', mssql.VarChar,'');		

        // 存储过程的入参内容不能是中文，否则乱码。如入参内容是中文，只能使用sql语句。
        request.execute("p_user_register",function (err, recordsets,returnValue) {  //调用 test_user 存储过程 
          if (err){
            resolve([err])
            return;
          }else{		
            resolve([err, recordsets.returnValue])
          }	
        });	
        mssql.end;  //结束连接数据库
      }	
    }); 
})
}


module.exports = {  executeSQL,executestoredprocedure };
