import axios from 'axios'
import { Loading } from 'element-ui'

let vue = null
let showToast = true
// request start ,loaing animation,error open animation
axios.interceptors.request.use(config => {
  Loading.service({ fullscreen: true })
  return config
}, error => {
  if (vue && showToast) {
    vue.toast('The request time out')
  }
  Loading.close()
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  Loading.close()
  if (response.data.code === 0) {
    return response.data.data || {}
  } else {
    if (response.data.text != null && response.data.text.length > 0) {
      if (vue && showToast) {
        vue.toast(response.data.text)
      }
    }
  }
}, error => {
  Loading.close()
  if (error.response) {
    if (error.response.data.code === 10 || error.response.data.code === 6) {
      if (vue) {
        vue.$router.replace('/login')
      }
    }
    console.log('response-error-data', error.response.sata)
    if (error.response.data.text != null && error.response.data.text.length > 0) {
      if (vue && showToast) {
        vue.toast(error.response.data.text)
      }
    }
  } else {
    console.log('Error', error.message)
    if (vue && showToast) {
      vue.toast('The network failed and no data was requested')
    }
  }
})

export default class api {
  static get = (url, vueContext, isShow) => {
    showToast = true
    if (vueContext != null) {
      vue = vueContext
    }
    if (isShow === false) {
      showToast = isShow
    }
    return axios({
      method: 'get',
      // url: '${BASE_URL}${url}',
      withCredentials: true,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
  }
}
