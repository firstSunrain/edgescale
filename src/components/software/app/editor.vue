<template>
  <div name="list" class='editor-list'>
    <el-row class='list-box el-form' v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading....">
      <el-col :span='24' class='com-tit'>
        <el-col :span='20'><span style='vertical-align: middle;line-height: 32px;'>{{ app_name }}</span></el-col>
        <el-col :span='4' style='text-align: right;'><el-button type='primary' size='small' class='common-btn' @click='save'>{{ $t('save') }}</el-button></el-col>
      </el-col>
      <el-col :span='24' class='create-form'>
        <quill-editor v-model="content" ref="myQuillEditor" :options="editorOption" @change='handlerChange' :data="uploadData">
        </quill-editor>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Vue from 'vue'
import VueQuillEditor from 'vue-quill-editor'
import {quillRedefine} from '../../../../static/js/file_upload.js'
import { appDocUpdate, appDocInfo } from '@/api'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)

let thisVue = null

export default {
  components: {quillRedefine},
  data () {
    return {
      content: '',
      editorOption: {},
      loading: false,
      uploadData: null,
      app_id: this.$route.params.appId,
      app_name: this.$route.params.appName
    }
  },
  computed: {
    editor () {
      return this.$refs.myQuillEditor.quill
    }
  },
  methods: {
    handlerChange ($event) {
      // this.$emit('deshtml', $event.html)
    },
    save () {
      thisVue.loading = true
      appDocUpdate(thisVue.app_id, {documents: thisVue.content}).then(dat => {
        let res = dat.data
        thisVue.loading = false
        if (res.status === 'success') {
          thisVue.$message({type: 'success', message: res.message})
          thisVue.$router.go(-1)
        } else {
          thisVue.$message({type: 'success', message: thisVue.$t('operation_fail')})
        }
      }).catch(_ => {
        thisVue.loading = false
      })
    },
    getDocument () {
      thisVue.loading = true
      appDocInfo(thisVue.app_id).then(dat => {
        let res = dat.data
        thisVue.loading = false
        if (res) {
          if (res.error) {
            thisVue.$message({type: 'error', message: res.message})
          } else {
            thisVue.content = res
          }
        }
      }).catch(_ => {
        thisVue.loading = false
      })
    }
  },
  created () {
    thisVue = this
    this.editorOption = quillRedefine(
      {
        uploadConfig: {
          type: 's3',
          size: 500
        }
      }
    )
  },
  mounted () {
    this.$refs.myQuillEditor.quill.container.style.height = '470px'
    this.getDocument()
  }
}
</script>

<style scoped>
  .editor-list{min-height: 540px;}
  .list-box{background-color: #fff;padding: 20px;}
  .opr-btn{ margin-top:20px;text-align: left;}
  .quill-editor{height: auto;}
</style>
