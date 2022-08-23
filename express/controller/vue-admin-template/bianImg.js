var app = require('express')();
var sqlConnect = require('../../utils/mssqlTool.js')
var { ResponseMessage } = require('../../utils/ResponseMessage')
const { authorize, base64 } = require('../../utils/Authorize');
const _ResponseMessage = new ResponseMessage()
const _authorize = new authorize()
const cheerio = require('cheerio');
const request = require('request');
const Iconv = require('iconv-lite');


/**
* get /vue-admin-template/api/imgList  
* @summary 获取imgList
* @security BasicAuth
* @tags Other Management
* @description 获取图片集合
* @param {number}  page.query.required  -  page 
*/
app.get('/api/imgList', (req, res) => {
  try {
    //_authorize.decrypt(req.headers.authorization)
    if (true) {
      GetImgList(req, res).then((result)=>{
        res.send(_ResponseMessage.Success(null,result,null,null))
    })
    }else{
      res.send( _ResponseMessage.Fail(null,null,null,'error authorization' ))
    }
  } catch (error) {
    res.send( _ResponseMessage.Fail(null,null,null,error.message ))
  }

})


async function GetImgList(req, res) {
  try {
    const tmp = [];
    const page1 = req.query.page == 1 ? '' : '_' + req.params.page;
    const page = req.query.page == 1 ?'_2': '_' + req.query.page;
    let url = `http://www.netbian.com/meinv/index${page}.htm`;
    let headers = {
      'Proxy-Connection': 'keep-alive',
      Host: 'www.netbian.com',
      Referer: 'http://www.netbian.com/meinv/index.htm',
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      'Upgrade-Insecure-Requests': 1,
      Connection: 'keep-alive',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36'
    };

    return new Promise(function (resolve, reject) { 
        request(
            {
              url: url,
              encoding: null,
              headers: headers
            },
            function (error, response, body) {
              if (response && response.statusCode === 200) {
                body = Iconv.decode(body, 'gb2312');
                const $ = cheerio.load(body, { decodeEntities: false });
                
                $('.list li').each(function (i, ele) {
                  let img = $(ele).find('img').attr('src');
                  let bigImg = img.replace('small', '').split('16')[0] + '.jpg';
                  let title = $(ele).text();
                  let imgList = {
                    img,
                    bigImg,
                    title
                  };
                  tmp.push(imgList);
                });
                resolve(tmp);
              } else {
                  return '数据请求异常';
              }
            }
          );

    });


    request(
      {
        url: url,
        encoding: null,
        headers: headers
      },
      function (error, response, body) {
        if (response && response.statusCode === 200) {
          body = Iconv.decode(body, 'gb2312');
          const $ = cheerio.load(body, { decodeEntities: false });
          
          $('.list li').each(function (i, ele) {
            let img = $(ele).find('img').attr('src');
            let bigImg = img.replace('small', '').split('16')[0] + '.jpg';
            let title = $(ele).text();
            let imgList = {
              img,
              bigImg,
              title
            };
            tmp.push(imgList);
          });
         
        } else {
            return '数据请求异常';
        }
      }
    );
    return tmp;
  } catch (error) {
    return _ResponseMessage.Fail(null,null,null,error.message )
  }
}



//========================重定向demo 





/**
* get /vue-admin-template/api/bz  
* @summary 获取bz
* @tags Other Management
* @description 获取背景图片
*/
app.get('/api/bz', (req, res) => {
  try {

    var options = {
      method: 'GET',
      url: 'https://tiebapic.baidu.com/forum/w%3D580%3B/sign=f88eb0f2cf82b9013dadc33b43b6ab77/562c11dfa9ec8a135455cc35b203918fa1ecc09c.jpg',
      headers: {
          'Referer': '',
      }
  };
  // res.type('.html')
  // res.type('html')
  // res.header('Content-Type', 'text/html;charset=utf-8')
  res.location('https://tiebapic.baidu.com/forum/w%3D580%3B/sign=f88eb0f2cf82b9013dadc33b43b6ab77/562c11dfa9ec8a135455cc35b203918fa1ecc09c.jpg');

 res.redirect('https://tiebapic.baidu.com/forum/w%3D580%3B/sign=f88eb0f2cf82b9013dadc33b43b6ab77/562c11dfa9ec8a135455cc35b203918fa1ecc09c.jpg' )
 request(options).pipe(res)
      //GetImgList(req, res).then((result)=>{ res.send(_ResponseMessage.Success(null,result,null,null))})

  } catch (error) {
    res.send( _ResponseMessage.Fail(null,null,null,error.message ))
  }

})

module.exports = app;
