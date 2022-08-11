
 const fs = require("fs")
 const path = require('path');
 const cp = require("child_process");
 const {ftpDemo} = require("./ftpDemo");

 let WinRARPath = "D:/rar软件/WinRAR.exe"
 let pathName = "D:/workSpace/fileuploader/data" //压缩文件路径
 let pathName_backup = "D:/workSpace/fileuploader/backups"
 let pathName_unzip = "D:/workSpace/fileuploader/unzipData"  //解压过的文件存放路径

 function unZIP(winRarPath, zipFilePath, unZipFolder) {
  return new Promise(async (resolve, reject) => {
    cp.execFile(winRarPath, ["x", "-inul",  zipFilePath, unZipFolder], function (err, stdout, stderr) {
      if (err) {
        reject(err)
      }
      resolve(stdout)
    })
  })
}
 async function unZipToFolderList() {
   return await new Promise(async (resolve, reject) => {
     try {
       let zipPathList = []   //压缩文件集合
       let unzipPathBackcall = []   // 解压完后的文件集合
       let files = fs.readdirSync(pathName)
       for (let i = 0; i < files.length; i++) {
        //提取文件后缀
        const fileSuffix = path.extname(files[i])  //Suffix
        if (fileSuffix === '.rar' || fileSuffix === '.zip') {
          let path = pathName + '/' + files[i]
          zipPathList.push(path)
        }
      }
       for (let index = 0; index < zipPathList.length; index++) {
        let basename = (path.basename(zipPathList[index])).substring(0, (path.basename(zipPathList[index])).lastIndexOf("."))
        console.log(basename);
        let unzipPath = pathName_unzip + "/" + basename
        console.log(unzipPath);
         if (fs.existsSync(zipPathList[index])) {
           if (!fs.existsSync(unzipPath)) {
             fs.mkdirSync(unzipPath);
           }
           await unZIP(WinRARPath, zipPathList[index], unzipPath);
           var data = fs.readFileSync(zipPathList[index]);// 读取
            // fs.writeFileSync(pathName_backup + "/" + basename , data); //写入
           fs.unlinkSync(zipPathList[index]);// 并且删除原文件
           unzipPathBackcall.push(unzipPath)
         }
       }
       resolve(unzipPathBackcall)  //返回解压的路径集合
     } catch (error) {
       reject(new Error(error))
     }
   })
 }
 
 // Item:变量名[]属性值
 

 function init() {
   try {
     console.log(`************************************************** \n  WinRAR path: ${WinRARPath} \n  Path: ${pathName} \n  ************************************************** `)
     if (!fs.existsSync(pathName_unzip)) {
       fs.mkdirSync(pathName_unzip);
     }
     
   } catch (error) {
     console.log('init Folder error')
   }
 }
 
 async function main() {
   init()
   console.log("解压中>>>")
   const rsp = await unZipToFolderList()
   console.log("解压完成!")
   await ftpDemo(rsp)
  
 }
 main()