<template>
  <div class="avatar" element-loading-spinner="el-icon-loading" element-loading-text="uploading file...">
    <el-upload class="avatar-uploader" :multiple='false' :auto-upload='false' drag action="https://jsonplaceholder.typicode.com/posts/" :on-change='uploadFile' v-loading='loading' element-loading-text="loading..." element-loading-spinner="el-icon-loading" :on-progress='uploadProgress'>
      <img v-if="imageUrl" :src="imageUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script>
  import { uploadSigner, comUploadFile } from '@/api'

  let thisVue = null

  export default {
    props: ['data', 'uploadParams'],
    name: 'uploadImg',
    data () {
      return {
        imageUrl: '',
        loading: false
      }
    },
    methods: {
      uploadFile (file, fileList) {
        // thisVue.$emit('uploadImg', thisVue.$refs['upload_img'])
        thisVue.getUploadParams(file.raw)
      },
      uploadProgress (event, file, fileList) {
        console.log(event)
        console.log(file)
      },
      submitFile (res, file) {
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
        comUploadFile('post', res.url, fd, function (e) {
          thisVue.upload_percent = Math.round((e.loaded / e.total) * 100)
        }).then(dat => {
          thisVue.loading = false
          thisVue.imageUrl = res.url + `${res.fields.key}`
          thisVue.$emit('imgUrl', res.url + `${res.fields.key}`)
          thisVue.$notify.success({
            message: thisVue.$t('upload_img_success')
          })
        }).catch(_ => {
          thisVue.loading = false
        })
      },
      getUploadParams (file) {
        thisVue.loading = true
        let params = thisVue.uploadParams
        let key = ''
        if (params.type === 'solution') {
          key = params.username + '/' + params.solution + '/' + params.model + '/' + file.name.split('.')[0] + '/' + params.version + '/' + file.name
          thisVue.$emit('fileName', file.name)
        } else if (params.type === 'app') {
          let fileName = thisVue.getDateStr() + '.jpeg'
          key = params.username + '/' + fileName
          thisVue.$emit('fileName', fileName)
        } else if (params.type === 'eiq') {
          key = params.username + '/' + file.name
        }
        uploadSigner({key: key, type: params.type}).then(dat => {
          let res = dat.data
          thisVue.submitFile(res, file)
        }).catch(_ => {
          thisVue.loading = false
          return false
        })
      },
      getDateStr () {
        let d = new Date()
        function pad (num) {
          return num.toString().length === 1 ? '0' + num : num
        }

        return d.getFullYear().toString() + pad(d.getMonth() + 1) + pad(d.getDate()) + pad(d.getTime()) + pad(d.getMinutes()) + pad(d.getSeconds())
      }
    },
    mounted () {
      thisVue = this
      thisVue.imageUrl = thisVue.data
    }
  }
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>