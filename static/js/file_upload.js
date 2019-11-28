import Common from './common'
function submitFile (res, file, self) {
  let fd = new FormData()
  fd.append('key', res.fields.key)
  fd.append('acl', res.acl)
  fd.append('policy', res.fields.policy)
  fd.append('x-amz-algorithm', res.fields['x-amz-algorithm'])
  fd.append('x-amz-credential', res.fields['x-amz-credential'])
  fd.append('x-amz-date', res.fields['x-amz-date'])
  fd.append('x-amz-security-token', res.fields['x-amz-security-token'])
  fd.append('x-amz-signature', res.fields['x-amz-signature'])
  fd.append('file', file)
  Common.wrapperAjax({
    url: res.url,
    type: 'post',
    timeout: 3600000,
    crossDomain: true,
    data: fd,
    processData: false,
    contentType: false,
    success: function (dat) {
      var length = self.quill.getSelection(true).index
      self.quill.insertEmbed(length, 'image', res.url + res.fields.key)
      self.quill.setSelection(length + 1)
    },
    error: function (jqXHR, textStatus, errorMsg) {
      return false
    }
  })
}
function getUploadParams (file, self) {
  let key = ''
  if (file) {
    key = `doc/${file.name}`
  }
  Common.wrapperTokenAjax({
    type: 'get',
    url: Common.apiV1Prefix + '/storage/signer',
    data: {key: key, type: 'app'},
    success: function (res) {
      submitFile(res, file, self)
    },
    error: function (jqXHR, textStatus, errorMsg) {
      return false
    }
  })
}
function privateUpload (file, self) {
  let type = file.type.split('/')[1]
  let fd = new FormData()
  fd = file
  Common.wrapperTokenAjax({
    type: 'put',
    url: `https://s3.edgescale.org:10086/signer?username=doc&objectname=${file.name}&type=${type}`,
    data: fd,
    processData: false,
    contentType: false,
    success: function (res) {
      var length = self.quill.getSelection(true).index
      self.quill.insertEmbed(length, 'image', res)
      self.quill.setSelection(length + 1)
    },
    error: function (jqXHR, textStatus, errorMsg) {
      return false
    }
  })
}
export const quillRedefine = function (config) {
  // placeholder
  const placeholder = config.placeholder || 'please write here ...'

  // 主题
  const theme = config.theme || 'snow'
  // 工具栏的工具选项
  const defaultToolOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{'header': 1}, {'header': 2}],
    [{'list': 'ordered'}, {'list': 'bullet'}],
    [{'script': 'sub'}, {'script': 'super'}],
    [{'indent': '-1'}, {'indent': '+1'}],
    [{'direction': 'rtl'}],
    [{'size': ['small', false, 'large', 'huge']}],
    [{'header': [1, 2, 3, 4, 5, 6, false]}],
    [{'color': []}, {'background': []}],
    [{'font': []}],
    [{'align': []}],
    ['clean'],
    ['link', 'image']
  ]
  const toolOptions = config.toolOptions || defaultToolOptions

  // 图片上传参数设置
  const defaultUploadConfig = {
    action: '',
    methods: 'POST',
    // token: sessionStorage.token,
    name: 'img',
    // size: 500,
    accept: 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon'
  }
  const uploadConfig = Object.assign(defaultUploadConfig, config.uploadConfig)
  // const moreHandlers = config.handlers || {}

  const handlers = {
    // ...moreHandlers,
    image: function image () {
      var self = this

      var fileInput = this.container.querySelector('input.ql-image[type=file]')
      if (fileInput === null) {
        fileInput = document.createElement('input')
        fileInput.setAttribute('type', 'file')
        // 可设置上传图片的格式
        fileInput.setAttribute('accept', uploadConfig.accept)
        fileInput.classList.add('ql-image')
        // 监听选择文件
        fileInput.addEventListener('change', function () {
          if (uploadConfig.type === 's3') {
            var file = fileInput.files[0]
            if (Common.env === 'private') {
              privateUpload(file, self)
            } else {
              getUploadParams(file, self)
            }
          } else {
            // 图片上传
            var xhr = new XMLHttpRequest()
            xhr.open(uploadConfig.methods, uploadConfig.action, true)
            // 设置请求头
            if (uploadConfig.header) {
              uploadConfig.header(xhr, formData)
            }
            // 上传数据成功，会触发
            xhr.onload = function (e) {
              if (xhr.status === 200) {
                var res = JSON.parse(xhr.responseText)
                var url = uploadConfig.res(res)
                var length = self.quill.getSelection(true).index
                self.quill.insertEmbed(length, 'image', url)
                self.quill.setSelection(length + 1)
                if (uploadConfig.success) {
                  uploadConfig.success()
                }
              }
              fileInput.value = ''
            }
            // 开始上传数据
            xhr.upload.onloadstart = function (e) {
              fileInput.value = ''
              // console.log('开始上传')
              if (uploadConfig.start) {
                uploadConfig.start()
              }
            }
            // 当发生网络异常的时候会触发，如果上传数据的过程还未结束
            xhr.upload.onerror = function (e) {
              if (uploadConfig.error) {
                uploadConfig.error()
              }
            }
            // 上传数据完成（成功或者失败）时会触发
            xhr.upload.onloadend = function (e) {
              // console.log('上传结束')
              if (uploadConfig.end) {
                uploadConfig.end()
              }
            }
            xhr.send(formData)
          }
        })
        this.container.appendChild(fileInput)
      }
      fileInput.click()
    }
  }

  // 全部配置
  return {
    placeholder: placeholder,
    theme: theme,
    modules: {
      toolbar: {
        container: toolOptions,
        handlers: handlers
      }
    }
  }
}
