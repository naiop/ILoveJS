var app = require('express')();
const cp = require("child_process");
var { ResponseMessage } = require('../../utils/ResponseMessage')
const logger = require('../../utils/log4').getLogger('req');
const _ResponseMessage = new ResponseMessage()



/**
* get /vue-admin-template/api/stepscript  
* @summary 刷步数
* @tags Other Management
* @description  小米运动App账号密码刷步数（app类绑定微信，支付宝，QQ，会自动同步）,
  自定义步数支持 微信、QQ、支付宝(使用人多开发自动执行脚本)  步数(66666-88888)之间随机，值太大容易凉凉
* @param {string}  account.query.required  -  account 
* @param {string}  password.query.required -  password
*/
app.get('/api/stepscript', (req, res) => {
    try {
        task(req, res).then((result) => {
            res.send(_ResponseMessage.Success(null, result, null, null))
        })

    } catch (error) {
        res.send(_ResponseMessage.Fail(null, null, null, error.message))
    }

})

async function task(req, res){
    try {
        let  msg = await new Promise(async (resolve, reject) => {
            let stdout = cp.execSync('python E:/SourceCode/ILoveJS/Step/main.py ' + req.query.account + ' ' + req.query.password, {encoding: 'utf8'})
            resolve(stdout)
         }) 
         logger.info(req.query.account+","+req.query.password+",执行结果:"+msg)
    
        return msg

      } catch (error) {
        return _ResponseMessage.Fail(null,null,null,error.message )
      }
}
module.exports = app;