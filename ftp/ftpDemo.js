const { AsyncFtp } = require('./asyncFTP');
const fs = require("fs")
const ftp = new AsyncFtp(); 
const remoteDir = '/test'
const currentPath = { path: ''}
const taskList ={ dir: [],file :[]}

async function ftpDemo(value) {
    try {
        let ftpConfig = {  
            host: " ",
            user: "test",
            password: "123456",
            port: 21
        };
        let connect = await ftp.connect(ftpConfig); // 连接 (连接地址传进去)
        if (!connect.result) throw "connect ftp fail.";

        let checkDir = await ftp.checkDir(remoteDir);  //判断远程目录存在否
        if (!checkDir.result) throw "check dir fail.";

        for (let index = 0; index < value.length; index++) {
            const element = value[index];
            currentPath.path = element
            await readDir(element)
        }

        console.log(taskList)
        console.log('上次文件中......');
        for (let index = 0; index < taskList.dir.length; index++) {
            const element = taskList.dir[index];
            await ftp.checkDir(element)
        }
        let promiseList = []
        for (let index = 0; index < taskList.file.length; index++) {
            const element = taskList.file[index];

            promiseList.push(ftp.putFile(element.local,element.remote))
            
        }
        Promise.all(promiseList).then((values) => {
            console.log(values);
       });
        //console.log('上传完成！');
         await ftp.end();  //断开连接

    } catch (error) {
        console.log(error)
        await ftp.end();  // 出现任何程序异常都要断开ftp连接
    }

}

  function readDir(path){
    return new Promise(function (resolve, reject) {
        readDirSync(path)  
          function readDirSync(path){
            var pa = fs.readdirSync(path);
            pa.forEach(function(ele,index){
                var info = fs.statSync(path+"/"+ele)	
                if(info.isDirectory()){
                   // console.log("dir: "+ele)
                    let fixpath = (path+"/"+ele).replace(currentPath.path.substring(0,currentPath.path.lastIndexOf('/')),'')
                   // console.log("dir------fix: "+fixpath)
                    taskList.dir.push(remoteDir+ fixpath)
                    readDirSync(path+"/"+ele);
                }else{
                    //console.log("file: "+path+"/"+ele)
                    let fixpath = (path+"/"+ele).replace(currentPath.path.substring(0,currentPath.path.lastIndexOf('/')),'')
                    //console.log("file------fix: "+fixpath)
                    let l = {
                        local:'',remote: ''
                    }
                    l.local = path+"/"+ele
                    l.remote = remoteDir+fixpath
                    taskList.file.push(l)
                }	
            })
        }
        resolve('OK')
    })
}

module.exports = {ftpDemo}
