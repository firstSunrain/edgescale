<template>
  <div>
    <div style='height: auto; overflow: hidden;'>
      <el-form id="createIdHost" ref="formValidateCreate" :model="formValidateCreate" :rules="ruleValidate" inline label-position="left" size='small'>
          <el-form-item class="SN-wrap" label="SN" prop="fuid">
            <el-input v-model="formValidateCreate.fuid" name="fuid"></el-input>
          </el-form-item>
          <el-form-item class="create-sty">
            <el-button type='primary' :loading="loadingSn" @click="generateFuid('formValidateCreate')"> {{ $t('generate_dev_no') }}<i class="position-right"></i></el-button>
          </el-form-item>
      </el-form>
      <el-form id="createHost" ref="formValidate" :model="formValidate" :rules="ruleValidate" label-width='120px' size='small'>
        <el-form-item :label="$t('dev_no')" prop="fuid">
          <el-input v-model="formValidate.fuid" name="uid" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('model')" prop="model_id" >
          <el-select v-model="formValidate.model_id" filterable clearable style="width: 100%" :disabled="formValidate.uid==''">
            <el-option v-for="item in modelList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
            <a style="display: block;text-align: center; line-height: 36px;font-size: 14px;" @click='getAllModels'>{{ $t('more') }}...</a>
          </el-select>
          <input type="hidden" name="model" :value="formValidate.model_id">
        </el-form-item>
        <el-form-item :label="$t('display_name')" prop='display_name'>
          <el-input v-model='formValidate.display_name'></el-input>
        </el-form-item>
      </el-form>
      <div style='text-align: right;'>
        <el-button size='small' @click="resetForm">{{ $t('cancel') }}</el-button>
        <el-button type="primary" size="small" :loading="loadingSubmit" :disabled="formValidate.fuid=='' || formValidate.model_id == ''" @click="handleSubmit('formValidate')">{{ $t('submit') }}</el-button>
      </div>
    </div>
    <el-dialog :title="$t('download_dev_cert')" :visible.sync="centerDialogVisible" width="30%" append-to-body :close-on-click-modal='false' :center="false">
      <span>{{ $t('download_dev_cert_msg') }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button size='small' @click="resetForm">{{ $t('cancel') }}</el-button>
        <el-button size='small' type="primary"  :loading="loading" @click="downloadDeviceCertificate">{{ $t('download') }}</el-button>
      </span>
    </el-dialog>
  </div>
 </template>
<script>
  import { devCreate, getDevCert, devFuidCreate, getModelList } from '@/api'

  let thisVue = null
  export default {
    data () {
      return {
        loadingSn: false,
        loading: false,
        loadingSubmit: false,
        modelDict: {},
        modelList: [],
        value: '',
        formValidateCreate: {
          fuid: ''
        },
        formValidate: {
          fuid: '',
          model_id: '',
          display_name: ''
        },
        ruleValidate: {
          fuid: [
            {required: true, message: this.$t('rule_blank_require'), trigger: 'blur'},
            {type: 'string', min: 1, message: 'must be a string', trigger: 'blur'}
          ],
          model_id: [
            {required: true, message: this.$t('rule_model_require'), trigger: 'blur'}
          ],
          display_name: [
            {required: true, message: this.$t('rule_name_require'), trigger: 'blur'}
          ]
        },
        centerDialogVisible: false,
        deviceName: null,
        deviceCertificateURL: null
      }
    },
    methods: {
      getAllModels: function (val) {
        let offset = thisVue.modelList.length
        getModelList({limit: 10, offset}).then(dat => {
          let res = dat.data
          res.models.map(item => {
            let data = {
              value: item.id + '',
              label: [item.vendor, item.platform, item.type, item.model].join('--')
            }
            thisVue.modelList.push(data)
          })
        }).catch(_ => {
          return false
        })
      },
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            thisVue.loadingSubmit = true
            devCreate({'device': thisVue.formValidate}).then(dat => {
              let res = dat.data
              thisVue.loadingSubmit = false
              if (res.status === 'success') {
                thisVue.$message({type: 'success', message: thisVue.$t('create_success')})
                thisVue.centerDialogVisible = true
                thisVue.deviceName = res.device.name
              } else {
                thisVue.$message({type: 'error', message: thisVue.$t('create_fail')})
              }
            }).catch(_ => {
              thisVue.$message({type: 'error', message: thisVue.$t('create_fail')})
              thisVue.loadingSubmit = false
            })
          }
        })
      },
      downloadCSV (data, fileName) {
        var blob = new Blob([data], {type: 'text/plain;charset=utf-8;'})
        let body = document.getElementsByTagName('body')[0]
        let anchor = document.createElement('a')
        anchor.class = 'downloadDeviceCer'
        body.appendChild(anchor)

        if (window.navigator.msSaveBlob) { // IE
          window.navigator.msSaveOrOpenBlob(blob, fileName)
        } else if (navigator.userAgent.search('Firefox') !== -1) { // Firefox
          body.style.display = 'none'

          anchor.href = 'data:attachment/csv;charset=utf-8,' + encodeURIComponent(data)
          anchor.download = fileName
          anchor.click()
          anchor.remove()
        } else { // Chrome
          anchor.href = URL.createObjectURL(blob)
          anchor.download = fileName
          anchor.click()
          anchor.remove()
        }
        thisVue.loading = false
      },
      downloadDeviceCertificate () {
        thisVue.loading = true
        getDevCert({device_name: thisVue.deviceName}).then(dat => {
          let res = dat.data
          thisVue.loading = false
          let filename = 'bootstrap-enroll-' + thisVue.deviceName + '.sh'
          thisVue.downloadCSV(res, filename)
          thisVue.resetForm()
        }).catch(_ => {
          thisVue.loading = false
          thisVue.downloadIcon = 'icon-arrow-down7'
        })
      },
      generateFuid (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            thisVue.loadingSn = true
            var fuid = thisVue.formValidateCreate.fuid.split(' ').join('')
            devFuidCreate({fuid}).then(dat => {
              let res = dat.data
              thisVue.formValidate.fuid = res
              thisVue.loadingSn = false
            }).catch(_ => {
              thisVue.loadingSn = false
            })
          }
        })
      },
      resetForm () {
        thisVue.$refs.formValidateCreate.resetFields()
        thisVue.$refs.formValidate.resetFields()
        thisVue.centerDialogVisible = false
        thisVue.$emit('closeDialog')
      }
    },
    mounted: function () {
      thisVue = this
      thisVue.getAllModels()
    }
  }
</script>
<style scoped>
  .SN-wrap{ margin-right: -3px;padding-left:80px;}
</style>
<style>
  .SN-wrap input{ border-top-right-radius: 0;border-bottom-right-radius: 0;border-right: 0;}
  .create-sty button{ padding-right: 0px;padding-left: 8px;border-top-left-radius:0;border-bottom-left-radius:0;}
  .create-sty{ margin-top:-0.5px!important;}
  @media screen and (min-width:660px) and (max-width:1097px){.SN-form{ width:80%;}.SN-form input{ width:170px;}}
  .el-input.is-disabled .el-input__inner{ border-color:#f5f7fa;}
</style>
