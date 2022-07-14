
/**
 * 解压文件，压缩文件
 */
 const fs = require("fs")
 const path = require('path');
 const cp = require("child_process");
 const { inherits } = require("util");
 
 let WinRARPath = "D:/Program Files/WinRAR/WinRAR.exe"
 let pathName = "D:/workSpace/renameFile/data" //压缩文件路径
 let pathName_backup = "D:/workSpace/renameFile/data/Backup"  //解压过的文件存放路径
 let pathName_Pack = "D:/workSpace/renameFile/data/Pack"  //解压完成 修改文件名  后的文件
 let pathName_ZIP = "D:/workSpace/renameFile/data/Pack/PackZIP"  //最后压缩 所有文件的路径
 
 
 function unZIP(winRarPath, zipFilePath, unZipFolder) {
     return new Promise(async (resolve, reject) => {
         cp.execFile(winRarPath, ["x", "-inul", zipFilePath, unZipFolder], function (err, stdout, stderr) {
             if (err) {
                 reject(err)
             }
             resolve(stdout)
         })
     })
 }
 
 function ZIP(winRarPath, zipFilePath, unZipFolder) {
     return new Promise(async (resolve, reject) => {
         cp.execFile(winRarPath, ["a", "-inul", zipFilePath, unZipFolder], function (err, stdout, stderr) {
             if (err) {
                 reject(err)
             }
             resolve(stdout)
         })
     })
 }
 
 async function unZipToFolderList(){
   return await new Promise(async (resolve , reject) => {
     try {
       let zipPathList = []   //压缩文件集合
       let unzipPathBackcall = []   // 解压完后的文件集合
       let files = fs.readdirSync(pathName)
       for (let i = 0; i < files.length; i++) {
         const fileSuffix=path.extname(files[i])  //Suffix
         if (fileSuffix === '.rar' || fileSuffix === '.zip') {
           let path = pathName + '/' + files[i]
           zipPathList.push(path)
         }
       }
       
       for (let index = 0; index < zipPathList.length; index++) {
           let basename = (path.basename(zipPathList[index])).substring(0,(path.basename(zipPathList[index])).lastIndexOf(".")) //basename 文件全名>>> 截取最后一个点去掉后缀名
           let basenameList = basename.split("_")  //下划线 分割成 List
           let unzipPath = pathName_Pack+"/"+ basenameList[5]+ "_"+basenameList[4]; //
           if (fs.existsSync(zipPathList[index])) {
             if (!fs.existsSync(unzipPath)) {
               fs.mkdirSync(unzipPath);
             }
             await unZIP(WinRARPath,zipPathList[index], unzipPath);
             
             var data = fs.readFileSync(zipPathList[index]);// 读取
             fs.writeFileSync(pathName_backup +"/"+ path.basename(zipPathList[index]), data); //写入
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
 async function modifyFile(filename) {
   for (let index = 0; index < filename.length; index++) {
     readDirAllFile(filename[index])
   }
 
   for (let index = 0; index < File.Item.length; index++) {
     const element = File.Item[index];
     const compress = element.name.substring(0, element.name.lastIndexOf("."))
     const compressPath1 = element.path.substring(0, element.path.lastIndexOf("\\"))
     const compressPath2 = compressPath1.substring(0, compressPath1.lastIndexOf("\\"))
 
     if (fs.existsSync(pathName_ZIP)) {
      await ZIP(WinRARPath, pathName_ZIP + "\\" + compress,compressPath2);
     }
 
   }
 }
 
 const File = { Item: [] }
 function readDirAllFile(filePath) {
     // 待优化 >>> 多个文件已最大那个命名
     let files = fs.readdirSync(filePath);
     for (const file of files) {
       let fileTruePath = path.join(filePath, file);
       if (fs.existsSync(fileTruePath)) {
         let stats = fs.statSync(fileTruePath)
         if (stats.isDirectory()) {
            readDirAllFile(fileTruePath); //递归
         } else if(stats.isFile()) {
           let reg = file.substring(file.length, file.length - 8)
           if (reg === 'dlog.txt') {
               const fixPathName = file.substring(0, file.lastIndexOf("."))
               const fixPath = fileTruePath.substring(0, fileTruePath.lastIndexOf('\\'))
               let fixPathNew = fixPath.substring(0, fixPath.lastIndexOf('\\')) + "\\" + fixPathName
               const _File = { path: '', name: '' }
               _File.name = file
               _File.path = fixPathNew
               File.Item.push(_File)
               fs.renameSync(fixPath,fixPathNew)
             
           }
         }
       }
     }
 }
 
 function init(){
   try {
     console.log(`************************************************** \n  WinRAR path: ${WinRARPath} \n  Path: ${pathName} \n  备份路径: ${pathName_backup} \n  打包路径：${pathName_Pack} \n************************************************** `)
     if(!fs.existsSync(pathName_backup)){
       fs.mkdirSync(pathName_backup);
     }
     if(!fs.existsSync(pathName_Pack)){
       fs.mkdirSync(pathName_Pack);
     }
     if(!fs.existsSync(pathName_ZIP))
      {
        fs.mkdirSync(pathName_ZIP);
      }
   } catch (error) {
     console.log('init Folder error')
   }
 }
 
 async function main(){
     init()
     console.log("解压中>>>")
     const rsp = await unZipToFolderList()
     console.log("解压完成!")
     console.log("打包文件中>>>")
     await modifyFile(rsp)
     console.log("打包压缩成功!")
 }
 main() 
 
 