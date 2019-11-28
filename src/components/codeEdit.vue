<template>
  <div>
    <codemirror v-model='codeContent' :options='codeOption'></codemirror>
  </div>
  <!-- <codeEdit :uploadParams="{type: 'eiq', username}"></codeEdit>  example -->
</template>

<script>
  import { uploadSigner, comUploadFile } from '@/api'
  import { codemirror } from 'vue-codemirror-lite'
  import 'codemirror/theme/eclipse.css'
  import 'codemirror/mode/python/python.js'
  import 'codemirror/mode/dockerfile/dockerfile.js'
  let thisVue = null

  export default {
    components: { codemirror },
    props: ['uploadParams'],
    data () {
      return {
        loading: false,
        upload_percent: 0,
        codeContent: '',
        codeOption: {
          mode: {name: 'dockerfile'},
          theme: 'eclipse',
          lineNumbers: true
        }
      }
    },
    methods: {
      getFileContent (url) {
        comUploadFile('get', url).then(dat => {
          let res = dat.data
          thisVue.codeContent = res
        }).catch(_ => {
          thisVue.loading = false
        })
      },
      uploadFile (file, fileList) {
        thisVue.getUploadParams(file.raw)
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
          thisVue.$notify.success({
            message: 'upload image successfully'
          })
          thisVue.$emit('fileUrl', `${res.fields.key}`)
          thisVue.getFileContent(res.url + res.fields.key)
        }).catch(_ => {
          thisVue.loading = false
        })
      },
      getUploadParams (file) {
        thisVue.loading = true
        let params = thisVue.uploadParams
        let key = ''
        key = params.username + '/' + file.name
        uploadSigner({key: key, type: params.type}).then(dat => {
          let res = dat.data
          thisVue.submitFile(res, file)
        }).catch(_ => {
          return false
        })
      }
    },
    mounted () {
      thisVue = this
      thisVue.getFileContent('/static/Dockerfile')
    }
  }
</script>

<style scoped>
</style>
