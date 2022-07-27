const Client = require('ftp');
const fs = require('fs');
exports.AsyncFtp = class{
    constructor(){
        this._ftp = new Client();
    }
    connect(config){
        let _this = this;
        return new Promise(function(resolve,reject){
            try {
                _this._ftp.on('ready',function(){
                    resolve({result:true,data:undefined});
                });
                _this._ftp.on('error',function(err){
                    reject({result:false,data:JSON.stringify(err)});
                });
                _this._ftp.connect(config);
            } catch (error) {
                reject({result:false,data:JSON.stringify(error)});
            }
        });
    }
    checkDir(destDir){
        let _this = this;
        return new Promise(function(resolve,reject){
            _this._ftp.cwd(destDir,function(err){
                if(err){
                    _this._ftp.mkdir(destDir,true,function(err){
                        if(err){
                            reject({result:false,data:JSON.stringify(err)});
                        }else{
                            resolve({result:true,data:err});
                        }
                    });
                }else{
                    resolve({result:true,data:err});
                }
            });
        });
    }
    putFile(file,dest){
        let _this = this;
        return new Promise(function(resolve,reject){
			try{
				_this._ftp.put(file, dest, function (err) {
					if (err) {
						reject({result:false,data:JSON.stringify(err)});
					}else{
						resolve({result:true,data:err});
					}
				});
			}catch(e){
				console.log(e);
			}
        });
    }

    getSize(file){
        
        let _this = this;
        return new Promise(function(resolve,reject){
				_this._ftp.size(file,  function (err,number) {
                    //console.log("size");
					if (err) {
						reject({result:false,data:JSON.stringify(err)});
					}else{
						resolve({result:true,data:number});
					}
				});
        });
    }

    getFile(file,dest){
        let _this = this;
        return new Promise(function(resolve,reject){
				_this._ftp.get(file,  function (err,stream) {
                    console.log(`get file ${file} to ${dest}:${err}`);
					if (err) {
						reject({result:false,data:JSON.stringify(err)});
					}else{

                        let error;
                        stream.once('error',function(e){error=e})
                        stream.once('close', function() { 
                            //_this._ftp.end();
                            if(error){
                                reject({result:false,data:JSON.stringify(error)});
                            }else{
                                resolve({result:true,data:err});
                            }
                        });
                        stream.pipe(fs.createWriteStream(dest));
					}
				});
        });
    }

    end(){
        let _this = this;
        return new Promise(function(resolve,reject){
            try {
                _this._ftp.end();
                resolve({result:true,data:undefined});
            } catch (error) {
                resolve({result:true,data:error});
            }
        });
    }
    
}