import Axios from 'axios'
import VueCookie from 'vue-cookie'

// let apiV1Prefix = 'https://dev.api.edgescale.org/v1' // dashboard-dev
// let apiV1Prefix = 'http://10.192.209.80:8000'
// let apiV1Prefix = 'https://10.193.20.144:8000'
// let apiV1Prefix = 'http://10.193.20.190:8000'
let apiV1Prefix = 'https://opeie4y2z8.execute-api.us-west-2.amazonaws.com/dev'  // 正式环境
// let apiV1Prefix = 'https://rw0k1jgwug.execute-api.us-west-2.amazonaws.com/dev'  // 开发环境
// let apiV1Prefix = 'https://api.edgescale.org/v1'  //console.edgescale.org
Axios.interceptors.request.use((config) => {
  config.headers.Accept = 'application/json'
  return config
}, (err) => {
  return Promise.reject(err)
})
// const getConfig = (type, url, data) => {
//   let config = {
//     method: type,
//     url: url
//   }
//   if (data) {
//     config.data = data
//   }
//   return config
// }
const getConfigToken = (type, url, data) => {
  let config = {
    method: type,
    url: url
  }
  if (data) {
    config.data = data
  }
  config.headers = {'authorization': VueCookie.get('token')}
  return config
}
// eiq
export const eiqList = (method, Interface, params) => {
  let arr = ''
  for (let key in params) {
    arr += '&' + key + '=' + params[key]
  }
  let config = getConfigToken(method, `${apiV1Prefix}/${Interface}?format=json${arr}`)
  // console.log(arr)
  return Axios(config)
}
export const eiqDetail = (method, Interface, params) => {
  let config = ''
  if (method === 'post') {
    config = getConfigToken(method, `${apiV1Prefix}/${Interface}?format=json`, params)
  } else {
    config = getConfigToken(method, `${apiV1Prefix}/${Interface}/${params.id}?format=json`, params)
  }
  // console.log(params)
  return Axios(config)
}
export const eiqGetTxt = (method, Interface) => {
  let config = getConfigToken(method, Interface)
  // console.log(arr)
  return Axios(config)
}
