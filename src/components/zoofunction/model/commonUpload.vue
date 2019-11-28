<template>
  <div>
    <el-upload class="upload-demo" :multiple='false' :auto-upload='false' drag action="https://jsonplaceholder.typicode.com/posts/" :on-change='uploadFile' v-loading='loading' element-loading-text="loading..." element-loading-spinner="el-icon-loading" :on-progress='uploadProgress'>
      <i class="el-icon-upload"></i>
      <div class="el-upload__text"><em>{{ $t('click_here_to_upload') }}</em></div>
    </el-upload>
    <el-progress v-if='upload_percent != 0' :percentage="upload_percent"></el-progress>
  </div>
</template>

<script>
  import { uploadSigner, comUploadFile } from '@/api'

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
    }
  }
</script>

<style scoped>
  
</style>
