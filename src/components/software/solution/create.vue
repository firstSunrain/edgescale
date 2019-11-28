<template>
  <div name="list" class='app-list'>
    <el-row class='list-box' v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading....">

      <el-col :span='24'>
        <div>
          <el-steps class='steps-common' :active='active-1' finish-status="success" simple>
            <el-step :title="$t('basic_info')"></el-step>
            <el-step :title="$t('upper_permission')"></el-step>
            <el-step :title="$t('upper_firmware')"></el-step>
          </el-steps>
        </div>
      </el-col>

      <el-col :span='24' class='create-form'>
        <el-form :model="createSolutionForm" size='small' :rules="createSolutionRules" ref="createSolutionForm" status-icon  label-width="160px" class="demo-ruleForm">

          <!-- step one -->
          <div class="step-three" v-if="active == 1">
            <el-form-item :label="$t('model_name')" prop="model_id">
              <el-col :span='23'>
              <el-select style="width: 100%" v-model="createSolutionForm.model_id" filterable clearable>
                <el-option v-for='(item, key) in modelList' :key='key' :value="item.id" :label="`${item.model}-${item.type}-${item.platform}-${item.vendor}`"></el-option>
                <a class='get-more' @click='getModels'>{{ $t('more') }}...</a>
              </el-select>
              </el-col>
            </el-form-item>
            <el-form-item :label="$t('solution_name')" prop="solution">
              <el-col :span='23'>
              <el-input v-model="createSolutionForm.solution"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item :label="$t('version')" prop="version">
              <el-col :span='23'>
                <el-select v-model="createSolutionForm.version" filterable allow-create clearable>
                  <el-option v-for="item in versionList" :key="item" :label="item" :value="item">
                  </el-option>
                </el-select>
              </el-col>
              <!--<span class='tip'>{{$t('input_check_msg')}}</span>-->
              <el-col :span='1' class='input-info'>
                <el-tooltip effect='dark' placement='left' :content="$t('input_check_msg')">
                  <i class='el-icon-info'></i>
                </el-tooltip>
              </el-col>
            </el-form-item>
          </div>

          <!-- step two -->
          <div class="step-one" v-if="active == 2">
            <div class='sorce-type'>
              <el-form-item :label="$t('tag')" prop="tag">
                <el-select v-model="createSolutionForm.tagsAttr" filterable multiple allow-create clearable>
                  <el-option v-for="(item, index) in tagsData" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="have_installer">
                <el-checkbox v-model="createSolutionForm.have_installer">{{ $t('install_solution_msg') }}</el-checkbox>
              </el-form-item>
            </div>
          </div>
          <!-- step three -->
          <div class="step-two" v-if="active == 3">
            <el-form-item :label="$t('firmware')" prop="sourceUploadMethod">
              <el-radio-group  v-model="createSolutionForm.sourceUploadMethod">
                <el-radio-button label="2">{{ $t('loc_firmware') }}</el-radio-button>
                <el-radio-button label="1">{{ $t('upload_firmware') }}</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <div v-if="createSolutionForm.sourceUploadMethod === '1'">
              <el-form-item  :label="$t('upload')" prop="image">
                <comUpload :uploadParams="{solution: createSolutionForm.solution, model: createSolutionForm.model_id, version: createSolutionForm.version, type: 'solution', username: username}" @fileName='getFileName'></comUpload>
              </el-form-item>
            </div>
            <div v-if="createSolutionForm.sourceUploadMethod === '2'">
              <el-form-item :label="$t('image_url')" prop="url">
                <el-input v-model="createSolutionForm.url"  placeholder="https://s3-us-west-2.amazonaws.com/edgescale.org/release/ls1046ardb/dcca_lsdk1706-ls1046_image_sdboot.tgz"></el-input>
              </el-form-item>
            </div>
            <el-form-item prop="is_signed">
              <el-checkbox v-model="createSolutionForm.is_signed">{{ $t('sign') }}</el-checkbox>
            </el-form-item>
            <div v-for="item in modelList" v-if="item.value === createSolutionForm.model_id && item.is_owner">
              <el-form-item label="" prop="is_default" v-if="createSolutionForm.solution && createSolutionForm.solution.length >= 4">
                <el-checkbox v-model="createSolutionForm.is_default">{{ $t('is_default') }}</el-checkbox>
              </el-form-item>
            </div>
          </div>

          <el-form-item class='item-button'>
            <el-button size='small' @click="cancel">{{ $t('cancel') }}</el-button>
            <el-button size='small' @click="active--" v-if="active != 1">{{ $t('back') }}</el-button>
            <el-button size='small' type="primary" @click="submitForm('createSolutionForm')" v-if="active == 3">{{ $t('submit') }}</el-button>
            <el-button size='small' type="primary" @click="next('createSolutionForm')" v-else>{{ $t('next') }}</el-button>
          </el-form-item>

        </el-form>
      </el-col>

    </el-row>
  </div>
</template>

<script>
  import { solutionCheckName, getModelList, solutionVersion, getSolutionTag, solutionCreate, solutionTagAdd } from '@/api'
  import comUpload from '../../commonUpload'

  let thisVue = null

  export default {
    components: { comUpload },
    data () {
      let createSolutionForm = {
        solution: '',
        model_id: '',
        version: '',
        is_default: false,
        tagsAttr: [],
        sourceUploadMethod: '2',
        is_signed: false,
        image: '',
        have_installer: false,
        url: ''
      }
      let createSolutionRules = {
        solution: [
          {pattern: /^[-\w]{4,32}$/, message: this.$t('rule_solution_name'), trigger: 'blur'},
          {required: true, message: this.$t('rule_solution_require'), trigger: 'blur'}
        ],
        model_id: [
          {required: true, message: this.$t('rule_model_require'), trigger: 'change'}
        ],
        version: [
          {required: true, message: this.$t('rule_version_require'), trigger: 'change'},
          {
            pattern: /^[-\w]{2,32}$/,
            message: this.$t('rule_version_name'),
            trigger: 'change'
          }
        ],
        sourceUploadMethod: [
          {required: true, message: this.$t('rule_firmware_require'), trigger: 'change'}
        ],
        image: [
          {required: true, message: this.$t('rule_image_require'), trigger: 'blur'},
          {required: true, message: this.$t('rule_image_require'), trigger: 'change'}
        ],
        url: [
          {required: true, message: this.$t('rule_image_require'), trigger: 'blur,change'},
          { pattern: /^(http([s]?):\/\/([\w.-]+)\/)([\w.-]+\/)*([\w.-]+)$/, message: this.$t('rule_image_url') + "'https://s3-us-west-2.amazonaws.com/edgescale.org/release/ls1046ardb/dcca_lsdk1706-ls1046_image_sdboot.tgz'", trigger: 'blur,change' }
        ]
      }
      return {
        createSolutionForm: createSolutionForm,
        createSolutionRules: createSolutionRules,
        loading: false,
        modelList: [],
        versionList: [],
        imageList: [],
        tagsData: [],
        autoUpload: false,
        fileList: [],
        fileTxtList: [],
        file: '',
        fileTxt: '',
        s3Url: '',
        uploadS3DataParam: {},
        username: '',
        active: 1
      }
    },
    methods: {
      next (formName) {
        thisVue.$refs[formName].validate((valid) => {
          if (valid) {
            if (thisVue.active === 1) {
              thisVue.compareName()
            } else {
              thisVue.active += 1
            }
          } else {
            return false
          }
        })
      },
      cancel () {
        thisVue.$confirm(thisVue.$t('give_up_tip'), thisVue.$t('cancel'), {
          type: 'warning'
        }).then(() => {
          thisVue.$router.go(-1)
        }).catch(() => {
          return false
        })
      },
      getFileName (data) {
        thisVue.createSolutionForm.image = data
      },
      compareName () {
        thisVue.loading = true
        let params = {solution: thisVue.createSolutionForm.solution, model_id: thisVue.createSolutionForm.model_id}
        solutionCheckName(params).then(dat => {
          let res = dat.data
          thisVue.loading = false
          if (res.status === 'success') {
            thisVue.active = 2
          } else {
            thisVue.$message({type: 'error', message: res.message})
          }
        }).catch(_ => {
          thisVue.loading = false
          return false
        })
      },
      getModels () {
        let offset = thisVue.modelList.length
        getModelList({limit: 10, offset}).then(dat => {
          let res = dat.data
          res.models.map(item => {
            thisVue.modelList.push(item)
          })
        }).catch(_ => {
          return false
        })
      },
      getVersionList () {
        solutionVersion().then(dat => {
          let res = dat.data
          if (res) {
            thisVue.versionList = res
          }
        }).catch(_ => {
          return false
        })
      },
      getAllTags () {
        getSolutionTag().then(dat => {
          let res = dat.data
          if (res) {
            thisVue.tagsData = res
          }
        }).catch(_ => {
          return false
        })
      },
      submitForm (formName) {
        thisVue.$refs[formName].validate((valid) => {
          if (valid) {
            thisVue.createSolution()
          } else {
            return false
          }
        })
      },
      createSolution () {
        if (thisVue.createSolutionForm.is_default === false) {
          thisVue.createSolutionForm.is_default = 'false'
        } else {
          thisVue.createSolutionForm.is_default = 'true'
        }
        thisVue.loading = true
        solutionCreate(thisVue.createSolutionForm).then(dat => {
          let res = dat.data
          thisVue.loading = false
          if (res && res.status === 'success') {
            let tagsAttr = thisVue.createSolutionForm.tagsAttr
            let solutionTagObj = {'solution_id': res.id, 'tag_name': tagsAttr}
            thisVue.$message({message: thisVue.$t('create_solution_success'), type: 'success'})
            thisVue.createSolutionTagById(solutionTagObj)
          } else {
            thisVue.$message({type: 'error', message: thisVue.$t('create_fail')})
          }
        }).catch(_ => {
          thisVue.loading = false
          return false
        })
      },
      createSolutionTagById (solutioTag) {
        solutionTagAdd(solutioTag).then(dat => {
          let res = dat.data
          thisVue.loading = false
          if (res && res.status === 'success') {
            thisVue.$message({message: thisVue.$t('add_tag_success'), type: 'success'})
            thisVue.$router.push({name: 'software_solution'})
          } else {
            thisVue.$message({type: 'error', message: thisVue.$t('add_tag_fail')})
          }
        }).catch(_ => {
          thisVue.loading = false
          return false
        })
      }
    },
    mounted () {
      thisVue = this
      thisVue.username = thisVue.$cookie.get('username')
      thisVue.getModels()
      thisVue.getVersionList()
      thisVue.getAllTags()
    }
  }
</script>

<style scoped>
  .app-list{min-height: 600px;}
  .list-box{background-color: #fff; }
  .list-tit{padding: 15px 20px; font-size: 2rem; border-bottom: 1px solid #ddd;}
  .create-form{padding:20px;}
  .el-steps{margin-top:1px;background-color: #f5f8fa;}
  .el-select{width: 100%;}
  .item-button{margin-bottom:0;text-align: right;}
  .input-info{ font-size: 2rem;color: #d2d7db;text-align:center;}
  .input-info i{ font-size:16px;}
</style>
