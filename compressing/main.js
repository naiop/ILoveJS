
// 解压文件，压缩文件
const fs = require("fs")
const path = require('path');
let pathName = "D:/workSpace/renameFile/data"
const cp = require("child_process");

function unZIP(winRarPath, zipFilePath, unZipFolder) {
    console.log(winRarPath+'\n'+ zipFilePath+'\n'+ unZipFolder)
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
    //zipFilePath 压缩path   unZipFolder 压缩文件
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
    let paths = []
    let pathscallback = []
    let files = fs.readdirSync(pathName)
    for (let i = 0; i < files.length; i++) {
      const fileArr = files[i].split('.');
      if (fileArr[1] == 'rar' || fileArr[1] == 'zip') {
        let path = pathName + '/' + files[i]
        paths.push(path)
        //console.log(path);
      }
      else {
        //console.log(pathName +files[i] +"------------"+ pathName +"/"+ "backup");
        //fs.copyFile(pathName +"/"+files[i], pathName +"/"+ "backup")
        var deletFile = pathName + '/' + files[i]
        //fs.unlinkSync(deletFile)
        console.log(`${files[i]}文件不符合压缩要求，已经被成功删除`);
      }
    }
    
    for (let index = 0; index < paths.length; index++) {
        let pathundecompress
        let pathSummary = []
        let configStr = paths[index].split("\n")
        //console.log(configStr);
        for (let index = 0; index < configStr.length; index++) {
          let str1 = configStr[index].substring(0, configStr[index].lastIndexOf("_"))
          let str2 = str1.substring(str1.length, str1.lastIndexOf("_") + 1)
          let str3 = configStr[index].substring(configStr[index].lastIndexOf("."), configStr[index].lastIndexOf("_"))
          pathundecompress =paths[index].substring(0,paths[index].lastIndexOf("/")) + "/" +str2 + str3
        
          if (fs.existsSync(paths[index])) {
            if (!fs.existsSync(pathundecompress)) {
              fs.mkdirSync(pathundecompress);
              pathSummary.push(pathundecompress)
            }
            await unZIP("D:/rar软件/WinRAR.exe",configStr[index], pathundecompress);
            pathscallback.push(pathundecompress)
          }
        }
    }
    resolve(pathscallback)
  })
}


function modifyFile(filename){
    for (let index = 0; index < filename.length; index++) {
        readDirAllFile(filename[index])
      }
      console.log(File.Item)
    
      for (let index = 0; index < File.Item.length; index++) {
        const element = File.Item[index];
        const compress =  element.name.substring(0,element.name.lastIndexOf("."))
        const compressPath1 = element.
        path.substring(0,element.path.lastIndexOf("\\"))
        const compressPath2 = compressPath1.substring(0,compressPath1.lastIndexOf("\\"))
        const compressPath3 = compressPath2.substring(0,compressPath2.lastIndexOf("\\"))
        const compressPath4 = compressPath3.substring(0,compressPath3.lastIndexOf("\\"))
    
        //console.log(compressPath2 + compress); //压缩路径                 compressPath3 压缩文件路径
        console.log(compressPath2 +"------" + compressPath4 + "\\" +"backup"+ "\\"+compress+'.zip');
    
        if (!fs.existsSync(compressPath4 + "\\backup")) {
          fs.mkdirSync(compressPath4 + "\\backup");
        }
        if(fs.existsSync(compressPath4 + "\\backup")) {
          ZIP("D:/rar软件/WinRAR.exe",
          compressPath4 +  "\\" +"backup"+ "\\" + compress,
          compressPath2);
          }
      } 
}


const File = {
    Item: []
  }

function readDirAllFile(filePath) {

    let allFile = {};
    let files = fs.readdirSync(filePath);
  
    for (const file of files) {
      let fileTruePath = path.join(filePath, file);
      if (fs.existsSync(fileTruePath)) {
        let stats = fs.statSync(fileTruePath)
  
        if (stats.isDirectory()) {
          allFile[file] = readDirAllFile(fileTruePath);
        } else if(stats.isFile()) {
          let reg = file.substring(file.length, file.length - 8)
          if (reg === 'dlog.txt') {
            const fixPathName = file.substring(0, file.lastIndexOf("."))
            const fixPath = fileTruePath.substring(0, fileTruePath.lastIndexOf('\\'))
            //解压的路径应存放在数组中,循环改文件名字以及压缩文件路径
            let fixPathNew = fixPath.substring(0, fixPath.lastIndexOf('\\')) + "\\" + fixPathName
            const _File = {
              path: '',
              name: ''
            }
  
            _File.name = file
            _File.path = fixPathNew
            File.Item.push(_File)
            
            
            fs.renameSync(
              fixPath,
              fixPathNew
            )
          }
        }
  
      }
    }
  }


async function test(){

    const re = await unZipToFolderList()
    console.log(re)
    modifyFile(re)
}
test() 

