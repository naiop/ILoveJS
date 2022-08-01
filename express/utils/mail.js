const EWS = require('nodemailer');  //node.js 基于 STMP 协议 发送邮件


/**
 * 使用 Nodemailer 发送 STMP 邮件
 * @param {Object} opts 邮件发送配置
 * @param {Object} smtpCfg smtp 服务器配置
 */
 async function sendMail(opts, smtpCfg) {
    const resultInfo = { code: 0, msg: '', result: null };
    if (!smtpCfg) {
    resultInfo.msg = '未配置邮件发送信息';
    resultInfo.code = - 1009;
    return resultInfo;
    }
    
    // 创建一个邮件对象
    const mailOpts = Object.assign(
    {
    // 发件人
    from: `Notify <${smtpCfg.auth.user}>`,
    // 主题
    subject: 'Notify',
    // text: opts.content,
    // html: opts.content,
    // 附件内容
    // /*attachments: [{
    // filename: 'data1.json',
    // path: path.resolve(__dirname, 'data1.json')
    // }, {
    // filename: 'pic01.jpg',
    // path: path.resolve(__dirname, 'pic01.jpg')
    // }, {
    // filename: 'test.txt',
    // path: path.resolve(__dirname, 'test.txt')
    // }],*/
    },
    opts
    );
    
    if (!mailOpts.to) mailOpts.to = [];
    if (!Array.isArray(mailOpts.to)) mailOpts.to = String(mailOpts.to).split(',');
    mailOpts.to = mailOpts.to.map(m => String(m).trim()).filter(m => m.includes('@'));
    
    if (!mailOpts.to.length) {
    resultInfo.msg = '未配置邮件接收者';
    resultInfo.code = - 1010;
    return resultInfo;
    }
    
    const mailToList = mailOpts.to;
    const transporter = nodemailer.createTransport(smtpCfg);
    
    // to 列表分开发送
    for (const to of mailToList) {
    mailOpts.to = to.trim();
    try {
    const info = await transporter.sendMail(mailOpts);
    console.log('mail sent to:', mailOpts.to, ' response:', info.response);
    resultInfo.msg = info.response;
    } catch (error) {
    console.log(error);
    resultInfo.code = -1001;
    resultInfo.msg = error;
    }
    }
    
    return resultInfo;
   }


   const opts = {
    subject: 'subject for test',
    /** HTML 格式邮件正文内容 */
    html: `email content for test: <a href="https://lzw.me" rel="external nofollow" rel="external nofollow" >https://lzw.me</a>`,
    /** TEXT 文本格式邮件正文内容 */
    text: '',
    to: 'xxx@lzw.me',
    // 附件列表
    // attachments: [],
   };
   const smtpConfig = {
    host: 'smtp.qq.com', //QQ: smtp.qq.com; 网易: smtp.163.com
    port: 465, //端口号。QQ邮箱 465，网易邮箱 25
    secure: true,
    auth: {
    user: 'xxx@qq.com', //邮箱账号
    pass: '', //邮箱的授权码
    },
   };
   sendMail(opts, smtpConfig).then(result => console.log(result));