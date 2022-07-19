/**
 * 对象关系映射（ORM）
 */
 const Sequelize = require('sequelize');
 // new Sequelize("表名","用户名","密码",配置)
 const sequelize = new Sequelize('database', 'username', 'password', {
   host: process.env.host,
   dialect: 'mssql',
   timezone: '+08:00'
 });
 sequelize
   .authenticate()
   .then(function () {
     console.log('Database connection has been established successfully.');
   })
   .catch(function (err) {
     console.log('Unable to connect to the database:', err);
   });
 
 module.exports = sequelize;