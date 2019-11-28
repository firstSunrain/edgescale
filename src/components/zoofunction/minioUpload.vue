<template>
  <div>
    <el-upload class="upload-demo" :multiple='false' :auto-upload='false' drag action="https://jsonplaceholder.typicode.com/posts/" :on-change='uploadFile' v-loading='loading' element-loading-text="loading..." element-loading-spinner="el-icon-loading" :on-progress='uploadProgress'>
      <i class="el-icon-upload"></i>
      <div class="el-upload__text"><em>{{ $t('click_here_to_upload') }}</em></div>
    </el-upload>
    <!-- <el-upload
      class="avatar-uploader"
      action="123"
      :http-request="upload"
      :before-upload="beforeAvatarUpload">
      <img v-if="params.defaultImgUrl" :src="params.defaultImgUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload> -->
    <el-progress v-if='upload_percent != 0' :percentage="upload_percent"></el-progress>
  </div>
</template>

<script>
  // import Axios from 'axios'
  import Cookie from '../../../static/js/cookie.js'
  let thisVue = null
  export default {
    props: ['uploadParams'],
    data () {
      return {
        loading: false,
        upload_percent: 0
      }
    },
    methods: {
      uploadFile (file, fileList) {
        console.log(file)
        thisVue.getUploadParams(file.raw)
      },
      // upload (res) {
      //   let file = res.file
      //   let config = {
      //       headers: {
      //           'Content-Type': 'multipart/form-data'
      //       }
      //   }
      //   //从接口获取presigned url
      //   getUploadUrl({uploadType: 6}).then(res => {
      //       let result = res.data

      //       if (result.code === 0) {
      //           const info = JSON.parse(result.msg)
      //           //需要用put方法上传，post会报405，aws官方规定是put方法
      //           Axios.put(info.presignedUrl, file, config)
      //               .then(res => {
      //                   if (res.status == 200) {
      //                       this.params.defaultImgUrl = info.cdnUrl;
      //                   }
      //               }).catch(
      //               err => {
      //                   console.log(err)
      //               }
      //           )
      //       }
      //   }).catch(err => {
      //       console.log('get upload info', err)
      //   })
      // },
      uploadProgress (event, file, fileList) {
        console.log(event)
        console.log(file)
      },
      retrieveNewURL (file, cb) {
        fetch('http://10.193.20.190:3000/presignedUrl?name=' + file.name + '&rootUrl=' + Cookie.getCookie('username')).then((response) => {
        // fetch('http://127.0.0.1:3000/presignedUrl?name=' + file.name + '&rootUrl=' + Cookie.getCookie('username')).then((response) => {
          response.text().then((url) => {
            console.log(file)
            console.log(url)
            cb(file, url)
          })
        }).catch((e) => {
          console.error(e)
        })
      },
      uploadFileMin (file, url) {
        console.log(url)
        console.log(file)
        // let fd = new FormData()
        // fd.append('key', file.name)
        // fd.append('acl', res.acl)
        // fd.append('policy', res.fields.policy)
        // fd.append('x-amz-algorithm', res.fields['x-amz-algorithm'])
        // fd.append('x-amz-credential', res.fields['x-amz-credential'])
        // fd.append('x-amz-date', res.fields['x-amz-date'])
        // fd.append('x-amz-security-token', res.fields['x-amz-security-token'])
        // fd.append('x-amz-signature', res.fields['x-amz-signature'])
        // fd.append('file', file)
        // Common.wrapperAjax({
        //   url: res.url,
        //   type: 'post',
        //   timeout: 3600000,
        //   crossDomain: true,
        //   data: fd,
        //   processData: false,
        //   contentType: false,
        //   xhr: function () {
        //     var xhr = $.ajaxSettings.xhr()
        //     thisVue.upload_percent = 0
        //     xhr.onreadystatechange = function () {
        //       if (xhr.readyState === 1) {
        //         if (xhr.upload) {
        //           xhr.upload.onprogress = function (e) {
        //             thisVue.upload_percent = Math.round((e.loaded / e.total) * 100)
        //           }
        //           xhr.upload.onloadstart = function () {
        //             console.log('started...')
        //           }
        //         }
        //       }
        //     }
        //     return xhr
        //   },
        //   success: function (dat) {
        //     console.log(res)
        //     thisVue.loading = false
        //     thisVue.$emit('fileState', false)
        //     thisVue.$notify.success({
        //       message: 'upload image successfully'
        //     })
        //     console.log(res.url + `${res.fields.key}`)
        //     thisVue.$emit('fileUrl', `${res.fields.key}`)
        //   },
        //   error: function (jqXHR, textStatus, errorMsg) {
        //     thisVue.loading = false
        //     thisVue.$emit('fileState', false)
        //     thisVue.$notify.error({
        //       message: 'Upload failed, please re-upload'
        //     })
        //     return false
        //   }
        // })
        fetch(url, {
          method: 'PUT',
          body: file
        }).then((res) => {
          console.log(res)
          thisVue.loading = false
          thisVue.$emit('fileState', false)
          let url = res.url.split('?')[0]
          console.log(url)
          thisVue.$emit('fileUrl', url)
          // thisVue.upload_percent = Math.round((e.loaded / e.total) * 100)
          // thisVue.$emit('imgUrl', res.url + `${res.fields.key}`)
        }).catch((e) => {
          console.error(e)
        })
      },
      getUploadParams (file) {
        thisVue.loading = true
        thisVue.$emit('fileState', true)
        // Retrieve a URL from our server.
        thisVue.retrieveNewURL(file, (file, url) => {
          // Upload the file to the server.
          thisVue.uploadFileMin(file, url)
        })
      }
    },
    mounted () {
      thisVue = this
    }
  }
</script>

<style scoped>
  
</style>
