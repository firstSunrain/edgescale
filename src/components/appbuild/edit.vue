<template>
  <div name="list" class='app-list'>
    <el-row class='list-box' v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading....">
      <el-col :span='24'>
        <div>
          <el-steps class="steps-common" finish-status="success" :active='active' simple>
            <el-step :title="$t('basic_info')"></el-step>
            <el-step :title="$t('source_code')"></el-step>
            <el-step :title="$t('build_env')"></el-step>
          </el-steps>
        </div>
      </el-col>

      <el-col :span='24' class='create-form'>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="160px" class="demo-ruleForm" size="small">

          <!-- step one -->
          <div class="step-three" v-if="active == 1">
            <el-form-item :label="$t('type')" prop="category" >
              <el-col :span='23'>
                <el-select v-model="ruleForm.category" filterable allow-create clearable>
                  <el-option label="Application" value="app"></el-option>
                  <el-option label="Solution" value="solution"></el-option>
                </el-select>
              </el-col>
            </el-form-item>

            <el-form-item v-if="ruleForm.category == 'solution'" size='small' :label="$t('model')" prop='model'>
              <el-col :span='23'>
                <el-select v-model='ruleForm.model'>
                  <el-option v-for='(item, key) in models' :key='key' :value="item.id" :ref="`model${item.id}`" :label="`${item.model}-${item.type}-${item.vendor}-${item.platform}`"></el-option>
                  <a class='get-more' @click='getModels'>{{ $t('more') }}...</a>
                </el-select>
              </el-col>
            </el-form-item>

            <el-form-item :label="$t('project_name')" prop="name">
              <el-col :span='23'><el-input size="small" v-model="ruleForm.name" disabled></el-input></el-col>
              <el-col :span='1' class='input-info'>
                <el-tooltip effect='dark' placement='left-start' content="Project names must be 2 to 255 characters. They can include the letters A-Z and a-z, the numbers 0-9, and the special characters - and _">
                  <i class='el-icon-info'></i>
                </el-tooltip>
              </el-col>
            </el-form-item>

            <el-form-item :label="$t('description')" prop="description">
              <el-col :span='23'>
                <el-input size="small" v-model="ruleForm.description"></el-input>
              </el-col>
            </el-form-item>
          </div>

          <!-- step two -->
          <div class="step-one" v-if="active == 2">
            <div class='sorce-type'>
              <el-form-item :label="$t('source_provider')" prop="sourceProvider">
                <el-select size="small" v-model="ruleForm.sourceProvider" @change="ruleForm.sourceParam1 = ''; ruleForm.sourceParam2 = ''">
                  <el-option value='S3' label="Amazon S3">Amazon S3</el-option>
                  <el-option value='GITHUB' label="GITHUB">GITHUB</el-option>
                </el-select>
              </el-form-item>

              <div v-if="ruleForm.sourceProvider == 'S3'">
                <el-form-item :label="$t('object_key')" prop="sourceParam1">
                  <comUpload :uploadParams="{type: 'app', username}" @fileUrl='getFileUrl'></comUpload>
                </el-form-item>
                <el-form-item>
                  <span>{{ruleForm.sourceParam1}}</span>
                </el-form-item>
              </div>

              <div v-if="ruleForm.sourceProvider == 'GITHUB'">
                <el-form-item>
                  <span>Specify your GitHub, such as https://github.com/Owner/Repo.git.</span>
                </el-form-item>
                <el-form-item :label="$t('repository')" prop="sourceParam1">
                  <el-input size="small" v-model="ruleForm.sourceParam1" placeholder='https://github.com/Owner/Repo.git'></el-input>
                </el-form-item>
                <el-form-item :label="$t('branch')" prop="sourceParam2">
                  <el-input size="small" v-model="ruleForm.sourceParam2"></el-input>
                </el-form-item>
              </div>

              <div v-if="ruleForm.sourceProvider == 'S3'">
                <el-form-item prop="pollForSourceChanges">
                  <el-checkbox v-model='ruleForm.pollForSourceChanges'>{{ $t('check_change') }}</el-checkbox>
                </el-form-item>
              </div>

            </div>
          </div>
          <!-- step three -->
          <div class="step-two" v-if="active == 3">
            <el-form-item :label="$t('image')" prop="image">
              <el-input size="small" v-model="ruleForm.image" placeholder='ubuntu:18.04'></el-input>
            </el-form-item>

            <el-form-item :label="$t('artifacts')" prop="artifacts">
              <el-col :span='23'><el-input size="small" v-model="ruleForm.artifacts"></el-input></el-col>
              <el-col :span='1' class='input-info'>
                <el-tooltip effect='dark' placement='left-start' content="Your build output artifacts">
                  <i class='el-icon-info'></i>
                </el-tooltip>
              </el-col>
            </el-form-item>

            <el-form-item :label="$t('commands')" prop="commands">
              <el-col :span='23'><el-input size="small" v-model="ruleForm.commands"></el-input></el-col>
              <el-col :span='1' class='input-info'>
                <el-tooltip effect='dark' placement='left-start' content="Enter commands you want to run during the build phase. Separate each build command with '&&.' For example, 'mvn test && mvn package.'">
                  <i class='el-icon-info'></i>
                </el-tooltip>
              </el-col>
            </el-form-item>

            <el-form-item :label="$t('computer_type')" prop="computeType">
              <el-select size="small" v-model="ruleForm.computeType">
                <el-option label="3GB memory 2 vCPU" value="BUILD_GENERAL1_SMALL"></el-option>
                <el-option label="7GB memory 4 vCPU" value="BUILD_GENERAL1_MEDIUM"></el-option>
                <el-option label="15GB memory 8 vCPU" value="BUILD_GENERAL1_LARGE"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('timeout')" prop="timeoutInMinutes">
              <el-input-number size='small' v-model="ruleForm.timeoutInMinutes"></el-input-number>   mins
            </el-form-item>
          </div>


          <el-form-item class='item-button'>
            <el-button size='small' @click="cancel">{{ $t('cancel') }}</el-button>
            <el-button size='small' @click="active--" v-if="active != 1">{{ $t('back') }}</el-button>
            <el-button size='small' type="primary" @click="submitForm('ruleForm')" v-if="active == 3">{{ $t('submit') }}</el-button>
            <el-button size='small' type="primary" @click="next('ruleForm')" v-else>{{ $t('next') }}</el-button>
          </el-form-item>

        </el-form>
      </el-col>

    </el-row>
  </div>
</template>

<script>
  import { builderReps, builderInfo, builderPrjUpdate, getModelList } from '@/api'
  import comUpload from '../commonUpload'

  let thisVue = null

  export default {
    components: { comUpload },
    data () {
      return {
        ruleForm: {
          category: '',
          model: '',
          name: '',
          description: '',
          sourceProvider: '',
          sourceParam1: '',
          sourceParam2: '',
          pollForSourceChanges: true,
          timeoutInMinutes: 40,
          image: '',
          computeType: ''
        },
        loading: true,
        models: [],
        repositories: [],
        branches: [],
        username: '',
        active: 1,
        build_name: this.$route.params.buildName,
        rules: {
          category: [
            { required: true, message: this.$t('rule_type_require'), trigger: 'change' }
          ],
          model: [
            { required: true, message: this.$t('rule_model_require'), trigger: 'change' }
          ],
          sourceProvider: [
            { required: true, message: this.$t('rule_provider_require'), trigger: 'change' }
          ],
          sourceParam1: [
            { required: true, message: this.$t('rule_repository_require'), trigger: 'change' }
          ],
          sourceParam2: [
            { required: true, message: this.$t('rule_branch_require'), trigger: 'change' }
          ],
          pollForSourceChanges: [
            { required: true, message: this.$t('rule_s3_require'), trigger: 'change' }
          ],
          timeoutInMinutes: [
            { required: true, message: this.$t('rule_timeout_require'), trigger: 'change' }
          ],
          name: [
            { required: true, message: this.$t('rule_name_require'), trigger: 'blur' },
            { min: 2, max: 255, message: 'length between 2 and 255', trigger: 'blur' },
            { pattern: /^[-\w]+$/, message: 'Project names must be 2 to 255 characters. They can include the letters A-Z and a-z, the numbers 0-9, and the special characters - and _', trigger: 'blue' }
          ],
          image: [
            { required: true, message: this.$t('rule_image_require'), trigger: 'blur' },
            { required: true, message: this.$t('rule_image_require'), trigger: 'change' }
          ],
          computeType: [
            { required: true, message: this.$t('rule_compute_require'), trigger: 'change' }
          ]
        },
        gitHubObject: [
          { required: true, message: this.$t('rule_repository_require'), trigger: 'blur' },
          { pattern: /^(https:\/\/github.com\/)([\w.-]+)\/([\w.-]+.git)$/, message: "repository starts with 'https://github.com/Owner/Repo.git'", trigger: 'blur' }
        ]
      }
    },
    methods: {
      submitForm (formName) {
        thisVue.$refs[formName].validate((valid) => {
          if (valid) {
            thisVue.loading = true
            let {name, description, pollForSourceChanges, timeoutInMinutes, image, computeType, artifacts, commands, category, model} = thisVue.ruleForm
            let params = {name, description, pollForSourceChanges, timeoutInMinutes, image, computeType, artifacts, commands, category, model}
            if (thisVue.ruleForm.sourceProvider === 'S3') {
              params.source = thisVue.ruleForm.sourceParam1
            } else if (thisVue.ruleForm.sourceProvider === 'GITHUB') {
              params.source = `${thisVue.ruleForm.sourceParam1};branch=${thisVue.ruleForm.sourceParam2}`
            }
            builderPrjUpdate(name, params).then(dat => {
              let res = dat.data
              thisVue.loading = false
              if (res && res.name) {
                thisVue.$message({type: 'success', message: thisVue.$t('operation_success')})
                thisVue.$router.push('/builder')
              } else {
                thisVue.$message({type: 'error', message: res.errorMessage})
              }
            }).catch(_ => {
              thisVue.loading = false
            })
          } else {
            return false
          }
        })
      },
      getInfo (name) {
        thisVue.loading = true
        builderInfo(name).then(dat => {
          let res = dat.data
          thisVue.loading = false
          let {name, description, sourceProvider, pollForSourceChanges, timeoutInMinutes, image, computeType, artifacts, commands, category, model} = res
          let sourceParam1 = ''
          let sourceParam2 = ''

          if (sourceProvider === 'S3') {
            sourceParam1 = res.source
          } else {
            let _arr = res.source.split(';')
            sourceParam1 = _arr[0]
            sourceParam2 = (_arr[1].split('='))[1]
          }

          if (pollForSourceChanges === 'true') {
            pollForSourceChanges = true
          } else {
            pollForSourceChanges = false
          }
          thisVue.ruleForm = {name, description, sourceProvider, sourceParam1, sourceParam2, pollForSourceChanges, timeoutInMinutes, image, computeType, artifacts, commands, category, model}
        }).catch(_ => {
          thisVue.loading = false
          return false
        })
      },
      getModels () {
        let offset = thisVue.models.length
        getModelList({limit: 10, offset}).then(dat => {
          let res = dat.data
          res.models.map(item => {
            thisVue.models.push(item)
          })
        }).catch(_ => {
          thisVue.loading = false
        })
      },
      getBranch (option) {
        thisVue.repositories.find(item => {
          if (item.repositoryName === option) {
            thisVue.branches = item.branches
          }
        })
      },
      next (formName) {
        thisVue.$refs[formName].validate((valid) => {
          if (valid) {
            thisVue.active += 1
          } else {
            return false
          }
        })
      },
      getRepo (type) {
        builderReps().then(dat => {
          let res = dat.data
          thisVue.loading = false
          if (res && res.length > 0) {
            thisVue.repositories = res
          }
        }).catch(_ => {
          thisVue.loading = false
          return false
        })
      },
      getFileUrl (dat) {
        thisVue.ruleForm.sourceParam1 = dat
      },
      cancel () {
        thisVue.$confirm(thisVue.$t('give_up_tip'), thisVue.$t('cancel'), {type: 'warning'}).then(() => {
          thisVue.$router.go(-1)
        }).catch(() => {
          return false
        })
      }
    },
    mounted () {
      thisVue = this
      thisVue.username = thisVue.$cookie.get('username')
      thisVue.getRepo()
      thisVue.getModels()
      thisVue.getInfo(thisVue.build_name)
    },
    watch: {
      ruleForm: {
        handler (curCal, oldVal) {
          if (curCal.sourceProvider === 'GITHUB') {
            thisVue.rules.sourceParam1 = thisVue.gitHubObject
          } else {
            thisVue.rules.sourceParam1 = [{ required: true, message: this.$t('rule_repository_require'), trigger: 'change' }]
          }
        },
        deep: true
      }
    }
  }
</script>

<style scoped>
  .app-list{min-height: 600px;}
  .list-box{background-color: #fff;}
  .list-tit{padding: 15px 20px; font-size: 2rem; border-bottom: 1px solid #ddd;}
  .create-form{padding: 20px;}
  .demo-ruleForm{margin: 0 auto;width: 60%;}
  .el-steps{margin:1px 0 0;background-color: #f5f8fa;}
  .el-select{width: 100%;}
  .input-info{ font-size: 2rem;color: #d2d7db;text-align:center;}
  .input-info i{ font-size:16px;}
  .item-button{text-align: right;}
</style>
