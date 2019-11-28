<template>
  <div name="list" class='app-list'>
    <el-row class='list-box' v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading....">
      <el-col :span='24' class='create-form'>
        <div class="step-three">
          <el-form :model="createAppForm" size='small' :rules="createAppRules" ref="createAppForm" label-width="160px" class="demo-ruleForm" status-icon>
            <el-form-item :label="$t('app_name')" prop="name">
              <el-input v-model="createAppForm.name" name="name"></el-input>
            </el-form-item>
            <el-form-item :label="$t('desc')" prop="description">
              <el-input v-model="createAppForm.description"  name="description"></el-input>
            </el-form-item>
            <el-form-item :label="$t('upload_app_icon')" prop="image">
              <comUpload :uploadParams="{type: 'app', username}" @fileName='getFileName'></comUpload>
            </el-form-item>
            <div class='item-button'>
              <el-button size='small' @click="cancel">{{ $t('cancel') }}</el-button>
              <el-button size='small' type="primary" @click="next('createAppForm')">{{ $t('submit') }}</el-button>
            </div>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { appInfo, applicationUpdate } from '@/api'
  import comUpload from '../../commonUpload'

  let thisVue = null

  export default {
    props: ['appId'],
    data () {
      return {
        app_name: this.appId,
        createAppForm: {
          name: '',
          description: '',
          image: ''
        },
        createAppRules: {
          name: [
            { required: true, message: 'name is required', trigger: 'blur' },
            { min: 2, max: 255, message: 'length between 2 and 255', trigger: 'blur' },
            { pattern: /^[-\w]+$/, message: 'App names must be 2 to 255 characters. They can include the letters A-Z and a-z, the numbers 0-9, and the special characters - and _', trigger: 'blur' }
          ]
        },
        username: '',
        loading: true
      }
    },
    methods: {
      getAppInfo () {
        thisVue.loading = true
        appInfo(thisVue.app_name).then(dat => {
          let res = dat.data
          thisVue.loading = false
          thisVue.createAppForm = {name: res.name, description: res.description, image: res.image}
        }).catch(_ => {
          thisVue.loading = false
        })
      },
      getFileName (data) {
        thisVue.createAppForm['image'] = data
      },
      next (formName) {
        thisVue.$refs[formName].validate((valid) => {
          if (valid) {
            thisVue.createApp()
          } else {
            return false
          }
        })
      },
      createApp () {
        thisVue.loading = true
        let createAppFormData = {'name': thisVue.createAppForm.name, 'display_name': thisVue.createAppForm.display_name, 'description': thisVue.createAppForm.description}
        if (thisVue.createAppForm.image) {
          let paramsList = thisVue.createAppForm.image
          let image = paramsList.split('/')
          image = image[image.length - 1]
          createAppFormData.image = image
        }
        applicationUpdate(thisVue.app_name, {'application': createAppFormData}).then(dat => {
          let res = dat.data
          thisVue.loading = false
          if (res.status === 'fail') {
            thisVue.$message({type: 'error', message: thisVue.$t('update_fail')})
          } else {
            thisVue.$message({message: thisVue.$t('update_success'), type: 'success'})
            thisVue.cancel()
          }
        }).catch(_ => {
          thisVue.loading = false
        })
      },
      cancel () {
        thisVue.$emit('closeDialog')
      }
    },
    mounted () {
      thisVue = this
      thisVue.getAppInfo()
      thisVue.username = thisVue.$cookie.get('username')
    },
    watch: {
      appId: function (newVal, oldVal) {
        thisVue.app_name = newVal
        thisVue.getAppInfo()
      }
    },
    components: { comUpload }
  }
</script>

<style scoped>
  .app-list{height: auto;overflow: hidden;}
  .list-box{background-color: #fff;}
  .list-tit{padding: 15px 20px; font-size: 2rem; border-bottom: 1px solid #ddd;}
  .el-select{width: 100%;}
  .item-button{text-align: right;}
</style>
