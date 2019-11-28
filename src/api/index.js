import axios from 'axios'
import VueCookie from 'vue-cookie'
import { Message } from 'element-ui'
import Vue from 'vue'

let apiV1Prefix = ''
if (process.env.NODE_ABS === undefined) {
  apiV1Prefix = `https://dev.api.edgescale.org/v1/`
  // const apiV1Prefix = `https://api.edgescale.org/v1/`
  // const apiV1Prefix = `https://test.api.edgescale.org/v1/`
} else {
  apiV1Prefix = `https://${process.env.NODE_ABS}/v1/`
}

const Axios = axios.create({
  timeout: 30000
})

Axios.interceptors.request.use((config) => {
  config.headers.Accept = 'application/json'
  return config
}, (err) => {
  return Promise.reject(err)
})

Axios.interceptors.response.use(response => {
  return response
}, err => {
  if (err && err.response) {
    switch (err.response.status) {
      case 400: err.message = Vue.$t('error_400'); break
      case 401:
        // err.message = Vue.$t('error_401')
        VueCookie.$cookie.delete('username')
        VueCookie.$cookie.delete('token')
        if (!VueCookie.$cookie.get('username')) {
          Message({message: Vue.$t('login_out_success'), type: 'success'})
          Vue.$router.push('/login')
        }
        break
      case 403: err.message = Vue.$t('error_403'); break
      case 404: err.message = Vue.$t('error_404'); break
      case 408: err.message = Vue.$t('error_408'); break
      case 500: err.message = Vue.$t('error_500'); break
      case 501: err.message = Vue.$t('error_501'); break
      case 502: err.message = Vue.$t('error_502'); break
      case 503: err.message = Vue.$t('error_503'); break
      case 504: err.message = Vue.$t('error_504'); break
      case 505: err.message = Vue.$t('error_505'); break
      default: err.message = Vue.$t('error_0') + `(${err.response.status})!`
    }
  } else {
    err.message = Vue.$t('error_0')
  }
  Message.error({message: err.message})
  return Promise.reject(err)
})

const getConfigToken = (type, url, data, responseType, contentType) => {
  let config = {
    method: type,
    url: apiV1Prefix + url,
    responseType
  }
  if (data) {
    if (type === 'get') {
      config.params = data
    } else {
      config.data = data
    }
  }
  if (responseType === 'blob') {
    config.headers = {'content-type': contentType}
  }
  config.headers = {'dcca_token': VueCookie.get('token')}
  return config
}
// upload file
export const comUploadFile = (method, url, data, uploadFun) => { let conf = {method, url, data, onUploadProgress: uploadFun, timeout: 3000000}; return Axios(conf) }

// login
export const loginApi = (params) => { let conf = {method: 'post', url: `${apiV1Prefix}users/login`, data: params}; return Axios(conf) }

export const getPermission = () => { let conf = getConfigToken('get', `permissions`); return Axios(conf) }

export const getSelfUser = () => { let conf = getConfigToken('get', `users/self`); return Axios(conf) }

export const applyAccount = (params) => { let conf = {method: 'post', url: `${apiV1Prefix}accounts`, data: params}; return Axios(conf) }

export const forgetPwd = (params) => { let conf = {method: 'put', url: `${apiV1Prefix}users/password/reset`, data: params}; return Axios(conf) }

export const forgetPwdEmail = (params) => { let conf = {method: 'post', url: `${apiV1Prefix}users/password/reset`, data: params}; return Axios(conf) }

export const editSelfUser = (params) => { let conf = getConfigToken('put', `users/self`, params); return Axios(conf) }

export const changeUserPwd = (params) => { let conf = getConfigToken('put', `users/password`, params); return Axios(conf) }

// management user
export const userList = (params) => { let conf = getConfigToken('get', `users`, params); return Axios(conf) }

export const userInfo = (id) => { let conf = getConfigToken('get', `users/${id}`); return Axios(conf) }

export const userCreate = (params) => { let conf = getConfigToken('post', `users`, params); return Axios(conf) }

export const userUpdate = (params) => { let conf = getConfigToken('put', `users`, params); return Axios(conf) }

export const userOperation = (params) => { let conf = getConfigToken('post', `users/operations`, params); return Axios(conf) }

export const getUserLimit = () => { let conf = getConfigToken('get', `users/limits`); return Axios(conf) }

export const userLimit = (params) => { let conf = getConfigToken('put', `users/limits`, params); return Axios(conf) }

export const userLimitType = () => { let conf = getConfigToken('get', `users/limits/types`); return Axios(conf) }

// user audit
export const accountList = (params) => { let conf = getConfigToken('get', `accounts`, params); return Axios(conf) }

export const accountAudit = (id, params) => { let conf = getConfigToken('post', `accounts/${id}/manage`, params); return Axios(conf) }

// management  vender
export const vendorList = (params) => { let conf = getConfigToken('get', `vendors`, params); return Axios(conf) }

export const vendorInfo = (id) => { let conf = getConfigToken('get', `vendors/${id}`); return Axios(conf) }

export const vendorDelete = (params) => { let conf = getConfigToken('delete', `vendors`, params); return Axios(conf) }

export const vendorCreate = (params) => { let conf = getConfigToken('post', `vendors`, params); return Axios(conf) }

export const vendorUpdate = (id, params) => { let conf = getConfigToken('put', `vendors/${id}`, params); return Axios(conf) }

// api usage
export const apiUsageSts = (params, url) => { let conf = getConfigToken('get', url, params); return Axios(conf) }

// management--config page
export const userCertificate = () => { let conf = getConfigToken('get', `users/certificate`); return Axios(conf) }

export const userCertificateDelete = () => { let conf = getConfigToken('delete', `users/certificate`); return Axios(conf) }

export const userCertificateOpr = (type, params) => { let conf = getConfigToken(type, `users/certificate`, params); return Axios(conf) }

export const serviceList = () => { let conf = getConfigToken('get', `services/common`); return Axios(conf) }

export const serviceDelete = (id) => { let conf = getConfigToken('delete', `services/${id}/common`); return Axios(conf) }

export const serviceCreate = (params) => { let conf = getConfigToken('post', `services/common`, params); return Axios(conf) }

export const serviceUpdate = (params) => { let conf = getConfigToken('put', `services/${params.id}/common`, params); return Axios(conf) }

// management --mirror
export const mirrorList = (params) => { let conf = getConfigToken('get', `registry`, params); return Axios(conf) }

export const mirrorCreate = (params) => { let conf = getConfigToken('post', `registry`, params); return Axios(conf) }

export const mirrorUpdate = (id, params) => { let conf = getConfigToken('put', `registry/${id}`, params); return Axios(conf) }

export const mirrorDelete = (params) => { let conf = getConfigToken('delete', `registry`, params); return Axios(conf) }

// upload
export const uploadSigner = (params) => { let conf = getConfigToken('get', `storage/signer`, params); return Axios(conf) }

export const fileContent = (url) => { let conf = {method: 'get', url}; return Axios(conf) }

// dashboard
export const deviceMapPos = (params) => { let conf = getConfigToken('get', `devices/positions`, params); return Axios(conf) }

export const devicelifeStatistics = () => { let conf = getConfigToken('get', `devices/statistics`); return Axios(conf) }

export const devicePosStatistics = () => { let conf = getConfigToken('get', `devices/positions/statistics`); return Axios(conf) }

export const getDevByLocation = (params) => { let conf = getConfigToken('get', `devices/locations`, params); return Axios(conf) }    // ???

// device
export const getDevList = (params) => { let conf = getConfigToken('get', `devices`, params); return Axios(conf) }

export const getDevInfo = (id) => { let conf = getConfigToken('get', `devices/${id}`); return Axios(conf) }

export const getDevCert = (params) => { let conf = getConfigToken('get', `devices/certificates`, params); return Axios(conf) }

export const getDevLogUrl = (params) => { let conf = getConfigToken('get', `devices/logs`, params); return Axios(conf) }

export const getDevLogTxt = (url) => { let conf = {method: 'get', url, dataType: 'text'}; return Axios(conf) }

export const devEnroll = (params) => { let conf = getConfigToken('patch', `enroll/device/${params.name}`, {status: params.status}); return Axios(conf) }

export const changeDevStatus = (params) => { let conf = getConfigToken('get', `devices/operation`, params); return Axios(conf) }

export const devCreate = (params) => { let conf = getConfigToken('post', `devices`, params); return Axios(conf) }

export const devUpdate = (id, params) => { let conf = getConfigToken('put', `devices/${id}`, params); return Axios(conf) }

export const devFuidCreate = (params) => { let conf = getConfigToken('get', `est/device`, params); return Axios(conf) }

export const devDelete = (params) => { let conf = getConfigToken('delete', `devices`, params); return Axios(conf) }

export const devDisplayNameUpdate = (id, params) => { let conf = getConfigToken('put', `devices/${id}`, params); return Axios(conf) }

export const devTagAdd = (params) => { let conf = getConfigToken('post', `devices/tags`, params); return Axios(conf) }

export const devTagDelete = (params) => { let conf = getConfigToken('delete', `devices/${params.devId}/tags`, {name: params.name}); return Axios(conf) }

export const getDevTagList = () => { let conf = getConfigToken('get', `devices/tags`); return Axios(conf) }

export const getDevAttrsList = () => { let conf = getConfigToken('get', `devices/filter/attributes`); return Axios(conf) }

export const getDevAttrName = (params) => { let conf = getConfigToken('get', `devices/filter/attributes/name`, params); return Axios(conf) }

// subdev
export const getSubdev = (params) => { let conf = getConfigToken('get', `devices/subdev`, params); return Axios(conf) }

export const updateSubdev = (params) => { let conf = getConfigToken('put', `devices/subdev`, params); return Axios(conf) }

export const deleteSubdev = (params) => { let conf = getConfigToken('delete', `devices/subdev?id=${params}`); return Axios(conf) }

export const getSubdevAttr = (params) => { let conf = getConfigToken('get', `devices/subdev/attributes`, params); return Axios(conf) }

export const changeSubdevAttr = (params) => { let conf = getConfigToken('put', `devices/subdev/attributes`, params); return Axios(conf) }

export const getSubdevOta = (params) => { let conf = getConfigToken('get', `devices/subdev/ota`, params); return Axios(conf) }

export const changeSubdevOta = (params) => { let conf = getConfigToken('post', `devices/subdev/ota`, params); return Axios(conf) }

// model
export const getModelList = (params) => { let conf = getConfigToken('get', `models`, params); return Axios(conf) }

export const getModelInfo = (params) => { let conf = getConfigToken('get', `models/${params.id}`); return Axios(conf) }

export const modelCreate = (params) => { let conf = getConfigToken('post', `models`, params); return Axios(conf) }

export const modelUpdate = (params) => { let conf = getConfigToken('put', `models/${params.id}`, params); return Axios(conf) }

export const modelDelete = (params) => { let conf = getConfigToken('delete', `models`, params); return Axios(conf) }

// device group
export const saveAsGroup = (params) => { let conf = getConfigToken('post', `device-group/devices`, params); return Axios(conf) }

export const getDevGroupList = (params) => { let conf = getConfigToken('get', `device-group`, params); return Axios(conf) }

export const devGroupInfo = (params) => { let conf = getConfigToken('get', `device-group/${params.id}`, params); return Axios(conf) }

export const groupModelList = () => { let conf = getConfigToken('get', `device-group/model-devices`); return Axios(conf) }

export const groupChartInfo = (params) => { let conf = getConfigToken('get', `device-group/statistics`, params); return Axios(conf) }

export const groupDelete = (params) => { let conf = getConfigToken('delete', `device-group`, params); return Axios(conf) }

export const groupBindDev = (id, params) => { let conf = getConfigToken('post', `device-group/${id}/devices`, params); return Axios(conf) }

export const removeDevFromGroup = (id, params) => { let conf = getConfigToken('delete', `device-group/${id}/devices`, params); return Axios(conf) }

export const groupOpr = (type, url, params) => { let conf = getConfigToken(type, url, params); return Axios(conf) }

export const deployGroup = (params) => { let conf = getConfigToken('post', `device-group/tasks`, params); return Axios(conf) }

// customer
export const getCustomerList = (params) => { let conf = getConfigToken('get', `customers`, params); return Axios(conf) }

export const customerDelete = (params) => { let conf = getConfigToken('delete', `customers/${params.customer_id}`, params); return Axios(conf) }

export const customerOpr = (type, url, params) => { let conf = getConfigToken(type, url, params); return Axios(conf) }

export const getCustomerInfo = (params) => { let conf = getConfigToken('get', `customers/${params.id}`); return Axios(conf) }

export const getCustomerDev = (params) => { let conf = getConfigToken('get', `customers/${params.id}/devices`, params); return Axios(conf) }

// app
export const applicationList = (params) => { let conf = getConfigToken('get', `applications`, params); return Axios(conf) }

export const applicationFilter = (params) => { let conf = getConfigToken('get', `applications/filter`, params); return Axios(conf) }  // ???

export const appStoreList = (params) => { let conf = getConfigToken('get', `applications/store`, params); return Axios(conf) }

export const appMirrorsList = () => { let conf = getConfigToken('get', `applications/mirrors`); return Axios(conf) }

export const applicationUpdate = (id, params) => { let conf = getConfigToken('put', `applications/${id}`, params); return Axios(conf) }

export const applicationCreate = (params) => { let conf = getConfigToken('post', `applications`, params); return Axios(conf) }

export const appInfo = (id) => { let conf = getConfigToken('get', `applications/${id}`); return Axios(conf) }

export const appDocInfo = (id) => { let conf = getConfigToken('get', `applications/${id}/documents`); return Axios(conf) }

export const appDocUpdate = (id, params) => { let conf = getConfigToken('put', `applications/${id}/documents`, params); return Axios(conf) }

export const appVersionList = (id) => { let conf = getConfigToken('get', `applications/${id}/versions`); return Axios(conf) }

export const appDeployStat = (params) => { let conf = getConfigToken('get', `applications/statistics`, params); return Axios(conf) }

export const appDockerConfig = (params) => { let conf = getConfigToken('post', `deployment/applications/params`, params); return Axios(conf) }

export const appBinidDocker = (id, params) => { let conf = getConfigToken('post', `applications/${id}/images`, params); return Axios(conf) }

export const appDockerInfo = (id) => { let conf = getConfigToken('get', `applications/${id}/images`); return Axios(conf) }

export const appDockerDelete = (appId, id) => { let conf = getConfigToken('delete', `applications/${appId}/images/${id}`); return Axios(conf) }

export const appAddTags = (id, params) => { let conf = getConfigToken('post', `applications/${id}/tags`, params); return Axios(conf) }

export const appDeleteTags = (id, params) => { let conf = getConfigToken('delete', `applications/${id}/tags`, params); return Axios(conf) }

export const appDelete = (id) => { let conf = getConfigToken('delete', `applications/${id}`); return Axios(conf) }

export const applicationCopy = (params) => { let conf = getConfigToken('post', `applications/copy`, params); return Axios(conf) }

export const getAppDeploy = (params) => { let conf = getConfigToken('get', `deployment/applications`, params); return Axios(conf) }

export const getAppInDevice = (params) => { let conf = getConfigToken('get', `deployment/applications/bydevice`, params); return Axios(conf) }

export const appDeployDelete = (params) => { let conf = getConfigToken('delete', `deployment/applications`, params); return Axios(conf) }

// solution
export const solutionList = (params) => { let conf = getConfigToken('get', `solutions`, params); return Axios(conf) }

export const solutionInfo = (id) => { let conf = getConfigToken('get', `solutions/${id}`); return Axios(conf) }

export const solutionCreate = (params) => { let conf = getConfigToken('post', `solutions`, params); return Axios(conf) }

export const solutionUpdate = (params) => { let conf = getConfigToken('put', `solutions`, params); return Axios(conf) }

export const solutionDelete = (params) => { let conf = getConfigToken('delete', `solutions`, params); return Axios(conf) }

export const solutionVersion = () => { let conf = getConfigToken('get', `solutions/images/versions`); return Axios(conf) }

export const solutionDeployStat = () => { let conf = getConfigToken('get', `solutions/statistics`); return Axios(conf) }

export const solutionDeployDev = (params) => { let conf = getConfigToken('get', `solutions/statistics/devices`, params); return Axios(conf) }

export const solutionCheckName = (params) => { let conf = getConfigToken('post', `solutions/names`, params); return Axios(conf) }

export const solutionSign = (params) => { let conf = getConfigToken('post', `solutions/sign`, params); return Axios(conf) }

export const solutionTagDelete = (params) => { let conf = getConfigToken('delete', `solutions/tags`, params); return Axios(conf) }

export const solutionTagAdd = (params) => { let conf = getConfigToken('post', `solutions/tags`, params); return Axios(conf) }

export const getSolutionTag = () => { let conf = getConfigToken('get', `solutions/tags`); return Axios(conf) }

// task template
export const taskTemplateList = (params) => { let conf = getConfigToken('get', `tasks/template`, params); return Axios(conf) }

export const taskTemplateInfo = (id) => { let conf = getConfigToken('get', `tasks/template/${id}`); return Axios(conf) }

export const taskTemplateDelete = (params) => { let conf = getConfigToken('delete', `tasks/template`, params); return Axios(conf) }

export const taskTemplateUpdate = (id, params) => { let conf = getConfigToken('put', `tasks/template/${id}`, params); return Axios(conf) }

export const taskTemplateSave = (params) => { let conf = getConfigToken('post', `tasks/template`, params); return Axios(conf) }

// task
export const getTaskList = (params) => { let conf = getConfigToken('get', `tasks`, params); return Axios(conf) }

export const taskCreate = (params) => { let conf = getConfigToken('post', `tasks`, params); return Axios(conf) }

export const taskDelete = (params) => { let conf = getConfigToken('delete', `tasks?task_ids=${params}`); return Axios(conf) }

export const getTaskDev = () => { let conf = getConfigToken('get', `tasks/devices`); return Axios(conf) }    // ???

export const getTaskLatest = () => { let conf = getConfigToken('get', `tasks/latest`); return Axios(conf) }

export const getTaskInfo = (id) => { let conf = getConfigToken('get', `tasks/${id}`); return Axios(conf) }

// deployment
export const getAllDeployment = (params) => { let conf = getConfigToken('get', `deployment/applications/getall`, params); return Axios(conf) }

export const getDeploymentInfo = (id) => { let conf = getConfigToken('get', `deployment/applications/${id}`); return Axios(conf) }

export const deploymentAction = (params) => { let conf = getConfigToken('post', `deployment/applications/action`, params); return Axios(conf) }

// key management
export const getKeyList = (params) => { let conf = getConfigToken('get', `key`, params); return Axios(conf) }

export const keyDelete = (id) => { let conf = getConfigToken('delete', `key/${id}`); return Axios(conf) }

export const keyOperation = (type, url, params) => { let conf = getConfigToken(type, url, params); return Axios(conf) }

export const getKeyInfo = (id) => { let conf = getConfigToken('get', `key/${id}`); return Axios(conf) }

export const downloadKeyFile = (id, contentType) => { let conf = getConfigToken('get', `key/${id}/download`, null, 'blob', contentType); return Axios(conf) }

// fuse management
export const getFuseList = (params) => { let conf = getConfigToken('get', `fuse`, params); return Axios(conf) }

export const fuseDelete = (id) => { let conf = getConfigToken('delete', `fuse/${id}`); return Axios(conf) }

export const fuseCreate = (params) => { let conf = getConfigToken('post', `fuse`, params); return Axios(conf) }

export const getFuseInfo = (id) => { let conf = getConfigToken('get', `fuse/${id}`); return Axios(conf) }

// mft management
export const getMftList = (params) => { let conf = getConfigToken('get', `mft`, params); return Axios(conf) }

export const getMftContent = (id, contentType) => { let conf = getConfigToken('get', `mft/${id}/pos`, null, 'blob', contentType); return Axios(conf) }

export const mftDelete = (id) => { let conf = getConfigToken('delete', `mft/${id}`); return Axios(conf) }

export const mftCreate = (params) => { let conf = getConfigToken('post', `mft`, params); return Axios(conf) }

export const mftUpdate = (id, params) => { let conf = getConfigToken('put', `mft/${id}`, params); return Axios(conf) }

export const getMftInfo = (id) => { let conf = getConfigToken('get', `mft/${id}`); return Axios(conf) }

export const getMftDevs = (id, params) => { let conf = getConfigToken('get', `mft/${id}/devices`, params); return Axios(conf) }

// app builder
export const builderPrjList = (params) => { let conf = getConfigToken('get', `builder/projects`, params); return Axios(conf) }

export const builderReps = () => { let conf = getConfigToken('get', `builder/repositories`); return Axios(conf) }

export const builderEnvs = () => { let conf = getConfigToken('get', `builder/environments`); return Axios(conf) }

export const builderInfo = (id) => { let conf = getConfigToken('get', `builder/projects/${id}`); return Axios(conf) }

export const builderLogs = (id, params) => { let conf = getConfigToken('get', `builder/projects/${id}/log`, params); return Axios(conf) }

export const builderPrjCreate = (params) => { let conf = getConfigToken('post', `builder/projects`, params); return Axios(conf) }

export const builderPrjUpdate = (id, params) => { let conf = getConfigToken('put', `builder/projects/${id}`, params); return Axios(conf) }

export const builderPrjDelete = (id) => { let conf = getConfigToken('delete', `builder/projects/${id}`); return Axios(conf) }

export const builderPrjStart = (id, params) => { let conf = getConfigToken('post', `builder/projects/${id}`, params); return Axios(conf) }

// common audit
export const createAudit = (params) => { let conf = getConfigToken('post', `audit`, params); return Axios(conf) }

export const getAudits = (params) => { let conf = getConfigToken('get', `audit`, params); return Axios(conf) }

export const auditAction = (id, params) => { let conf = getConfigToken('post', `audit/${id}`, params); return Axios(conf) }
