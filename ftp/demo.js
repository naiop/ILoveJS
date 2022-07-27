const { AsyncFtp } = require('../AsyncFtp');
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

    let checkDir = await ftp.checkDir("/");
    if (!checkDir.result) throw "check dir fail.";
    let ftpPath = config.ftpPath.endsWith("/") ? config.ftpPath : (config.ftpPath + "/");
    let tuploads = [];
    for (let j = 0; j < compressFiles.length; j++) {
        tuploads.push(compressFiles[j].name);
        let putFile = await ftp.putFile(compressFiles[j].filePath, ftpPath + compressFiles[j].name);
        if (!putFile.result) throw "upload fail.";
    }
    await ftp.end();

} catch (error) {

}
