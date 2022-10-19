
/**
 * 解压文件，压缩文件
 */
const fs = require("fs")
const path = require('path');
const compressing = require('compressing');

let WinRARPath = "D:/Program Files/WinRAR/WinRAR.exe" //压缩软件WinRAR存放路径
let pathName = "D:/workSpace/renameFile/data1" //原数据储存路径
let pathName_ZIP = "D:/workSpace/renameFile/Packunzip"  //最后压缩 所有文件的路径
let LogFlag = true   // log

/**
* 
* @param {*} tarStream 
* @param {*} compressionFile 
* @returns 
*/
function Streamcompress(tarStream, compressionFile) {
  return new Promise(function (resolve, reject) {
    //创建写入流
    const destStream = fs.createWriteStream(compressionFile + ".zip");
    let handleError = function (err) {
      reject(err);
    }
    let finished = function () {
      resolve(compressionFile);
    }
    tarStream
      .on('error', handleError)//错误
      .on('end', finished)//关闭流
      .pipe(destStream);
  });
}

async function modifyFile() {
  readDirAllFile(pathName)
  for (let index = 0; index < File.Item.length; index++) {
    const element = File.Item[index];
    console.log( LogFlag==true? element: '' )
    let zipPathList = element.zipPath
    const tarStream = new compressing.zip.Stream();
    var filelist = fs.readdirSync(zipPathList)
    for (let i = 0; i < filelist.length; i++) {
      tarStream.addEntry(zipPathList + "\\" + filelist[i]);
    }
    if (fs.existsSync(pathName_ZIP)) {
      if (fs.existsSync(pathName_ZIP + "\\" + element.name + ".zip")) {
        // console.log(`${pathName_ZIP+"\\"+element.name+".zip"}文件已压缩`);
        break
      }
      await Streamcompress(tarStream, pathName_ZIP + "\\" + element.name)

    }
  }
}

let File = { Item: [] }
function readDirAllFile(filePath) {
  let files = fs.readdirSync(filePath);
  for (const file of files) {
    let fileTruePath = path.join(filePath, file);
    if (fs.existsSync(fileTruePath)) {
      let stats = fs.statSync(fileTruePath)
      if (stats.isDirectory()) {
        readDirAllFile(fileTruePath); //递归
      } else if (stats.isFile()) {
        let reg = file.substring(file.length, file.length - 8)
        if (reg === 'dlog.txt') {
          // fixPathName:"4600022105_F18531A-F0BCI01002_UH1160_FT1_18531AF0ACI88TF2003C001_SOM008220909695_FT2_TFZC_643_XJ88_2209180425_20220920070238_dlog"
          const fixPathName = file.substring(0, file.lastIndexOf("."))
          // fixPath: "D:\\workSpace\\renameFile\\data1\\XJ88_F18531A-F0BCI01002_UH1160_909695_2209180425_FT2"
          const fixPath = fileTruePath.substring(0, fileTruePath.lastIndexOf('\\'))
          const _File = { name: '', zipPath: '' }
          _File.name = file
          _File.zipPath = fixPath
          File.Item.push(_File)
          break
        }
      }
    }
  }
}


function init() {
  try {
    if (!fs.existsSync(pathName_ZIP)) {
      fs.mkdirSync(pathName_ZIP);
    }

  } catch (error) {
    console.log('init Folder error')
  }
}
async function main() {
  return await new Promise(async (resolve, reject) => {
    init()
    await modifyFile(pathName)
    resolve('Success')
  })
}

let Task = async () => {
  console.log(`************************************************** \n  
  WinRAR path: ${WinRARPath} \n  
  Path: ${pathName} \n  
  打包路径：${pathName_ZIP} \n
************************************************** `)
  let num = fs.readdirSync(pathName)
  console.log( LogFlag==true? num: '' )
  for (let index = 0; index < num.length; index++) {
    await main()
  }
}

Task()

