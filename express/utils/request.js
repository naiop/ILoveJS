const axios = require('axios');  

const service = axios.create({
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    config.headers['Authorization'] = 'Basic ZXhwcmVzc19hcGk6MTIzNDU2'
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    console.log(res)
    return res
  },
  error => {
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)


module.exports=  { service }

