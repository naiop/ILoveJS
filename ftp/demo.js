const { AsyncFtp } = require('./asyncFTP');

async function ftpDemo(){
    try {
        //ftp上传文件
        let ftp = new AsyncFtp();
        let ftpConfig = {
            host: "",
            user: "test",
            password: "123456",
            port: 21
        };
        let connect = await ftp.connect(ftpConfig);
        if (!connect.result) throw "connect ftp fail.";
    
        let checkDir = await ftp.checkDir("/test");
        if (!checkDir.result) throw "check dir fail.";

        let putFile = await ftp.putFile("D:/workSpace/renameFile/data/Backup/test.rar","/test/uploadTest.rar");
        if (!putFile.result) throw "upload fail.";
       
        await ftp.end();
    
    } catch (error) {
      console.log(error)
    }

}

ftpDemo()
