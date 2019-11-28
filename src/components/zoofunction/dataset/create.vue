<template>
  <div name="list" class='dataset-box detail-box'>
    <el-row class='list-box' v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading....">
      <el-col class="create-container" :span='24'>
        <el-col :span='24' class='basic-box'>
          <el-form :model='form' ref='form' :rules='rules' label-width='160px'>
            <el-form-item class="item-name" prop='name' :label="$t('dataset_name')">
              <el-input size="small" v-model="form.name" :placeholder="$t('please_input_name')"></el-input>
            </el-form-item>
            <el-form-item prop='description' :label="$t('description')">
              <el-input size='small' v-model="form.description" type='textarea' :placeholder="$t('please_input_description')"></el-input>
            </el-form-item>
            <el-form-item class="item-name" prop='type' :label="$t('solution')">
              <el-select v-model='form.type' :placeholder="$t('select_solution')" size='small'>
                <el-option v-for="(item,index) in solutionList" :key='index' :value="index" :label='item.name'></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item-name" prop='size' :label="$t('dataset_size')">
              <el-input size="small" v-model="form.size" :placeholder="$t('please_input_size')"></el-input>
            </el-form-item>
            <el-form-item prop='is_public' :label="$t('is_public')">
              <el-switch :disabled='user_type === "ADMIN" ? false : true' v-model="form.is_public"></el-switch>
            </el-form-item>
            <el-form-item prop='url' :label="$t('dataset_file')">
              <comUpload :uploadParams="{type: 'eiq', username}" @fileUrl='getFileUrl'></comUpload>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('form')" size='small'>{{ $t('submit') }}</el-button>
              <el-button size='small' @click="resetForm('form')">{{ $t('reset') }}</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <!-- <el-col :span='8' class='tip'>
          <div class="tip-tit">Tips</div>
          <el-collapse :accordion='true'>
            <el-collapse-item name='1'>
              <template slot='title'>
                <span class='collapse-tit'>How To Design Category</span>
              </template>
              <p>Each label is the result of all the images you wish to identify. The upper limit of the label is 1000 The tag name needs to be in alphanumeric or underlined format and does not support Chinese naming.</p>
            </el-collapse-item>
            <el-collapse-item name='2'>
              <template slot='title'>
                <span class='collapse-tit'>Specific Requirements Of File Formate</span>
              </template>
              <p>The compressed package only supports the zip format; The size of the compressed package needs to be less than 5GB; Note that the folder name in the zip file is the tag name and can only contain numbers/letters/underscores. At the same time, the directory structure of the compressed package</p>
            </el-collapse-item>
          </el-collapse>
        </el-col> -->
      </el-col>
    </el-row>
  </div>
</template>

<script>
  // import Common from '../../../../static/js/common.js'
  import comUpload from '../commonUpload'
  // import comUpload from '../minioUpload'
  import { eiqList, eiqDetail } from '@/api/api'
  import Cookie from '../../../../static/js/cookie.js'
  import store from '../../../store/index.js'
  let thisVue = null
  export default {
    components: { comUpload },
    data () {
      return {
        loading: false,
        user_type: '',
        form: {
          name: '',
          description: '',
          type: null,
          is_public: false,
          size: '',
          url: ''
        },
        solutionList: '',
        rules: {
          name: [{required: true, message: 'Dataset name is required', trigger: 'blur'}],
          type: [{required: true, trigger: 'change', message: 'select solution is required'}],
          url: [{required: true, trigger: 'blur', message: 'Upload dataset is required'}]
        },
        username: '',
        uploadImgFile: '',
        params: {
          id: '',
          offset: 0,
          limit: 100,
          search: '',
          type: '',
          is_training: false
        }
      }
    },
    methods: {
      submitForm (formName) {
        thisVue.$refs[formName].validate((valid) => {
          if (valid) {
            thisVue.loading = true
            thisVue.form.type = thisVue.solutionList[thisVue.form.type].id
            console.log(thisVue.form)
            eiqDetail('post', 'dataset', thisVue.form).then(json => {
              thisVue.$message.success({message: 'Dataset Creation Successful!'})
              thisVue.$router.push({name: 'zoo_data_list'})
              thisVue.loading = false
            }).catch(_ => {
              return false
            })
          } else {
            return false
          }
        })
      },
      getPermission () {
        store.dispatch('getUserPermission').then(_ => {
          // thisVue.user_type = 'ADMIN' // 开发使用
          if (store.state.userPermission.is_admin) {
            thisVue.user_type = 'ADMIN'
          } else {
            thisVue.user_type = store.state.userPermission.account_type.name
          }
        }).catch(_ => {
          return false
        })
      },
      getFileUrl (data) {
        thisVue.form.url = data
      },
      getSolution () {
        eiqList('get', 'solution', thisVue.params).then(json => {
          thisVue.solutionList = json.data.results
        }).catch(_ => {
          return false
        })
      },
      resetForm (form) {
        thisVue.$refs[form].resetFields()
      }
    },
    mounted () {
      thisVue = this
      this.$nextTick(function () {
        let pageHeaderData = {
          'homeRouterName': 'home',
          'firstTitle': thisVue.$t('dataset'),
          'firstRouterName': 'zoo_data_list',
          'secondTitle': thisVue.$t('create')
        }
        // Common.setPageHeaderData(thisVue, pageHeaderData)
        thisVue.$store.dispatch('setPageHeaderData', pageHeaderData)
        thisVue.username = Cookie.getCookie('username')
        if (thisVue.username) {
          thisVue.getPermission()
        }
        thisVue.getSolution()
      })
    }
  }
</script>

<style scoped>
  /*.opr-box{padding-bottom: 15px;}*/
  .create-container{ background: #f5f7fa;}
  .basic-box{ background: #ffffff;}
  .tip{padding: 0px 20px;}
  .tip-tit{line-height: 42px; font-size: 14px;color:#b1bfcc;font-weight: 500;font-style: italic;}
  .create-container .item-name{ height:41px;}
</style>
<style>
  .create-container .el-collapse-item__header,.create-container .el-collapse-item__content{ background:#f5f7fa;font-weight:normal;}
  .create-container .collapse-tit{ color:#245682;}
  .create-container .el-collapse-item__content p{ color:#7496b4;}
  .create-container .el-collapse-item__arrow{ color:#245682;}
  .create-container .el-select{ width:100%;}
  .create-container .item-name .el-form-item__content{ height:41px;}
</style>
