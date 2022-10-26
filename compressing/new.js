
/**
 * 解压文件，压缩文件
 */
 const fs = require("fs")
 const path = require('path');
 const compressing = require('compressing');

 let pathName = "D:/workSpace/renameFile/data" //原数据储存路径
 let pathName_ZIP = "D:/workSpace/renameFile/Packunzip"  //最后压缩 所有文件的路径
 let pathName_backup = "D:/workSpace/renameFile/backup"
 let pathName_Exception = "D:/workSpace/renameFile/Exception"


 function compress(compression){
  return new Promise(function (resolve, reject) {
      const tarStream = new compressing.zip.Stream();
//      console.log(path.join(pathName,compression));
      console.log('start--' + new Date());
      var filelist = fs.readdirSync(path.join(pathName,compression))
      let fileName = ''
      for (let i = 0; i < filelist.length; i++) {
        let reg = filelist[i].substring(filelist[i].length, filelist[i].length - 8)
        if (reg === 'dlog.txt') { // size issue
          fileName = filelist[i]
        }
          tarStream.addEntry(path.join(pathName,compression,filelist[i]));
      }
      let compressionFile = ''
      if (fileName === '') {
         compressionFile = path.join(pathName_Exception,compression) + '.zip'  
      } else {
         compressionFile = path.join(pathName_ZIP,fileName) + '.zip'  
      }
      
      const destStream = fs.createWriteStream(compressionFile);
      let handleError = function (err) {
          reject(err);
      }
      let finished = function(){
        filesOperation(compression).then(() => {
          resolve(compressionFile);
        })
      }
      tarStream.on('error', handleError).on('end',finished).pipe(destStream);

  });
}


async function filesOperation(compression) {
  return await new Promise(async (resolve, reject) => {
    try {
                // -------搬

                let files = fs.readdirSync(path.join(pathName,compression));
                if(!fs.existsSync(path.join(pathName_backup,compression)))
                   {
                     fs.mkdirSync(path.join(pathName_backup,compression));
                   }
                
                for (let index = 0; index < files.length; index++) {
                  let fileTruePath = path.join(pathName, compression,files[index]);
                  if (fs.existsSync(fileTruePath)) {
                    let stats = fs.statSync(fileTruePath)//异步返回文件信息
                    if (stats.isDirectory()) {
                       //readDirAllFile(fileTruePath); //递归
                    } else if(stats.isFile()) {
                        fs.rename((path.join(path.join(pathName,compression),files[index])),(path.join(pathName_backup,compression,files[index])) ,(err)=>{
                          if(err){
                            console.log(err)
                          }else{
                            if(index===files.length-1){
                              fs.rmdirSync(path.join(pathName,compression));
                              console.log('end--' + new Date());
                            }
                            //console.log('剪切到js文件夹内了')
                            
                          }
                        })
              
                    }
                  }
                }
      
                //----------

                resolve('Success')
    } catch (error) {
      reject(error)
    }

  })
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
     if(!fs.existsSync(pathName_Exception))
     {
       fs.mkdirSync(pathName_Exception);
     }
  } catch (error) {
    console.log('init Folder error')
  }
}

let Task = async () => {
  console.log(`************************************************** \n  
  Path: ${pathName} \n  
  打包路径：${pathName_ZIP} \n
  ************************************************** `)
  init()
  let  Files  =fs.readdirSync(pathName)  
for (let index = 0; index < Files.length; index++) { 

  compress(Files[index])
}
if (Files.length == 0) {
  console.log("文件夹为空")
} else {
  console.log("正在压缩")
}
}

Task()
 