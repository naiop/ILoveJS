
/**
 * 解压文件，压缩文件
 */
 const fs = require("fs")
 const path = require('path');
 const compressing = require('compressing');

 let WinRARPath = "C:/Program Files/WinRAR/WinRAR.exe" //压缩软件WinRAR存放路径
 let pathName = "D:/workSpace/renameFile/data1" //原数据储存路径
 let pathName_ZIP = "D:/workSpace/renameFile/Packunzip"  //最后压缩 所有文件的路径
 let pathName_backup = "D:/workSpace/renameFile/backup"
 /**
 * 
 * @param {*} tarStream 
 * @param {*} compressionFile 
 * @returns 
 */
function Streamcompress(tarStream ,compressionFile){
  return new Promise(function (resolve, reject) {
 //创建写入流
    const destStream = fs.createWriteStream(compressionFile+".zip");
    let handleError = function (err) {
        reject(err);
    }
    let finished = function(){
        resolve(compressionFile);
    }
    tarStream
    .on('error', handleError)//错误
    .on('end',finished)//关闭流
    .pipe(destStream);
});
}


/**
 * 将指定src目录下的所有文件剪切到指定目标dest目录下  copyDirectory('D:\\NodeJs\\node-demo\\abc', 'G:\\Trash\\files\\abc');
 * @param src 源目录
 * @param dest 目标目录
 */
//  async function copyDirectory(src, dest) {
//   //logger(src + '---------' + dest, 'log');
//   return await new Promise(async (resolve, reject) => {
//     try {
//       var files = fs.readdirSync(src);
//       files.forEach((item, index) => {
//         var itemPath = path.join(src, item);
//         var itemStat = fs.statSync(itemPath);// 获取文件信息
//         var savedPath = path.join(dest, itemPath.replace(src, ''));
//         var savedDir = savedPath.substring(0, savedPath.lastIndexOf('\\'));
//         logger(savedPath + 'savedPath---------savedDir' + savedDir, 'log');
//         if (itemStat.isFile()) {
//           // 如果目录不存在则进行创建
//           if (!fs.existsSync(savedDir)) {
//             fs.mkdirSync(savedDir, { recursive: true });
//           }
//           // 写入到新目录下
//           var data = fs.readFileSync(itemPath);
//           fs.writeFileSync(savedPath, data);
//           // 并且删除原文件
//           fs.unlinkSync(itemPath);
//           logger(itemPath + 'itemPath---------', 'log');
//         } else if (itemStat.isDirectory()) {
//          //copyDirectory(itemPath, path.join(savedDir, item));
//          //logger(itemPath + 'itemPath---------' + path.join(savedDir, item), 'log');
//         }
//       });
//       // 并且删除原目录
//       fs.rmdirSync(src);
//       resolve('Success')
//     } catch (error) {
//       reject(error)
//     }
//   })

// }

async function modifyFile() {
 readDirAllFile(pathName)
   for (let index = 0; index < File.Item.length; index++) {
     const element = File.Item[index];
     let zipPathList = element.zipPath
     const tarStream = new compressing.zip.Stream();
     var filelist = fs.readdirSync(zipPathList)
     let oldPath1 = []
     for (let i = 0; i < filelist.length; i++) {
         tarStream.addEntry(zipPathList + "\\"+filelist[i]);
         oldPath1 = zipPathList + "\\"+filelist[i]
     }
     if (fs.existsSync(pathName_ZIP)) {
      if (fs.existsSync(pathName_ZIP+"\\"+element.name+".zip")) {
       // console.log(`${pathName_ZIP+"\\"+element.name+".zip"}文件已压缩`);
      }

      console.log('--------'+ new Date())
      await Streamcompress(tarStream,pathName_ZIP+"\\"+element.name )
      console.log(new Date())
      //var oldPath= 'D:\\workSpace\\renameFile\\data1\\test.txt'
      console.log(oldPath1);
      var newPath = 'D:\\workSpace\\renameFile\\backup\\testbak.txt'




          // fs.rename(oldPath1,newPath ,(err)=>{
          //   if(err){
          //     console.log(err)
          //   }else{
          //     console.log('剪切到js文件夹内了')
          //   }
          // })

      // fs.writeFileSync(pathName_backup +"/"+zipPathList[index], data)
      // fs.unlinkSync(zipPathList[index]);
     }
   }
 }
 
 let  File = { Item: [] }
 function readDirAllFile(filePath) {   
     let files = fs.readdirSync(filePath);
     for (const file of files) {
       let fileTruePath = path.join(filePath, file);
       if (fs.existsSync(fileTruePath)) {
         let stats = fs.statSync(fileTruePath)//异步返回文件信息
         if (stats.isDirectory()) {
            readDirAllFile(fileTruePath); //递归
         } else if(stats.isFile()) {
          // let pathList = fileTruePath.split("\\")
          // let destPath =  pathName_backup + "\\" + pathList[4] +"\\" + pathList[5]
          // fs.rename(destPath,fileTruePath ,(err)=>{
          //   if(err){
          //     console.log(err)
          //   }else{
          //     console.log('剪切到js文件夹内了')
          //   }
          // })
           let reg = file.substring(file.length, file.length - 8)
           if (reg === 'dlog.txt') {
            // fixPathName:"4600022105_F18531A-F0BCI01002_UH1160_FT1_18531AF0ACI88TF2003C001_SOM008220909695_FT2_TFZC_643_XJ88_2209180425_20220920070238_dlog"
               const fixPathName = file.substring(0, file.lastIndexOf("."))
            // fixPath: "D:\\workSpace\\renameFile\\data1\\XJ88_F18531A-F0BCI01002_UH1160_909695_2209180425_FT2"
               const fixPath = fileTruePath.substring(0, fileTruePath.lastIndexOf('\\'))
               const fixPathNew  = path.basename(fixPath)
               const fixPathNew1 = path.join(pathName_backup,fixPathNew)
               const _File = { name: '' ,zipPath:''}
               _File.name = file
               _File.zipPath = fixPath
               File.Item.push(_File) 
               break
           }
         }
       }
     }
 }

 function init(){
   try {
  
     if(!fs.existsSync(pathName_ZIP))
      {
        fs.mkdirSync(pathName_ZIP);
      }
      if(!fs.existsSync(pathName_backup))
      {
        fs.mkdirSync(pathName_backup);
      }


   } catch (error) {
     console.log('init Folder error')
   }
 }
 async function main(){
  return await new Promise(async (resolve , reject) => {
    init()
     await modifyFile(pathName)
     resolve('Success')
  })
 }

let Task = async () => {
  console.log(`************************************************** \n  
  Path: ${pathName} \n  
  打包路径：${pathName_ZIP} \n
  ************************************************** `)
  let  num  =fs.readdirSync(pathName)  
 for (let index = 0; index < num.length; index++) {  
    await main()
 }
console.log("打包压缩成功!") 
}

Task()
 
 