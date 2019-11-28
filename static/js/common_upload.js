import Common from './common'
import $ from 'jquery'
export const commonUpload = function (file) {
  var formData = new FormData()
  var fileName = file.name
  var imgUrl = ''
  var errMsg = ''
  var AWS_ACCESS_KEY_ID = 'AKIAJRNEJS7N6EDFEWBQ'
  function getDateStr (d) {
    function pad (num) {
      return num.toString().length === 1 ? '0' + num : num
    }

    return d.getFullYear().toString() + pad(d.getMonth() + 1) + pad(d.getDate()) + pad(d.getTime()) + pad(d.getMinutes()) + pad(d.getSeconds())
  }
  var d = new Date()
  var algorithm = 'AWS4-HMAC-SHA256'
  var bucket = 'edgescale-images'
  var dStr = d.toISOString().replace(/[:-]|\.\d{3}/g, '')
  var key = 'appDetail/'
  var credential = [
    AWS_ACCESS_KEY_ID,
    getDateStr(d),
    'ap-northeast-1',
    's3',
    'aws4_request'
  ].join('/')
  var uploadData = {
    acl: 'public-read',
    bucket: bucket,
    key: key,
    'x-amz-algorithm': algorithm,
    'x-amz-credential': credential,
    'x-amz-date': dStr
  }
  Common.wrapperAjax({
    type: 'post',
    crossDomain: true,
    url: 'https://s3.edgescale.org/sign',
    async: false,
    ContentType: false,
    data: JSON.stringify(uploadData),
    success: function (res) {
      formData.append('key', key + fileName)
      formData.append('file', file)
      formData.append('policy', res.policy)
      formData.append('x-amz-algorithm', algorithm)
      formData.append('x-amz-credential', credential)
      formData.append('x-amz-date', dStr)
      formData.append('x-amz-signature', res.signature)
    },
    error: function () {
      console.log('error')
    }
  })
  Common.wrapperAjax({
    type: 'post',
    crossDomain: true,
    timeout: 3600000,
    async: false,
    url: 'https://' + bucket + '.s3.amazonaws.com',
    data: formData,
    processData: false,
    contentType: false,
    success: function (res) {
      imgUrl = 'https://' + bucket + '.s3.amazonaws.com/' + key + fileName
      $('.el-loading-mask').hide()
    },
    error: function () {
      errMsg = 'Upload Failed, S3 Error'
      $('.el-loading-mask').hide()
    }
  })
  if (errMsg) {
    return {status: 'fail', message: errMsg}
  }
  return imgUrl
}
