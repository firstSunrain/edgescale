<template>
<div name="list" class='task-template'>
  <div class='list-box' v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading....">
    <el-form :model="modelData" :rules="rules" ref="modelData" label-width="100px" status-icon size="small">
      <el-form-item :label="$t('model')" prop="model">
        <el-select v-model="modelData.model" filterable allow-create clearable>
          <el-option v-for="item in modeList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('type')" prop="type" >
        <el-select v-model="modelData.type" filterable allow-create clearable>
          <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('platform')" prop="platform">
        <el-select v-model="modelData.platform" filterable allow-create clearable>
          <el-option v-for="item in platformList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('vendor')" prop="vendor">
        <el-select v-model="modelData.vendor" filterable allow-create clearable>
          <el-option v-for="item in vendorList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div style='text-align: right;'>
      <el-button size="small" @click="resetForm('modelData')" type="reset">{{ $t('reset') }}</el-button>
      <el-button size="small" type="primary" @click="submitForm('modelData')">{{ $t('submit') }}</el-button>
    </div>
  </div>
</div>
</template>
<script>
  import { getModelInfo, modelUpdate } from '@/api'
  let thisVue = null

  export default {
    props: ['modelId'],
    data () {
      let modelDataRule = {
        model: [
          { required: true, message: this.$t('rule_model_require'), trigger: 'blur' },
          { min: 3, max: 30, message: this.$t('rule_len3_len8'), trigger: 'blur' }
        ],
        type: [
          { required: true, message: this.$t('rule_type_require'), trigger: 'blur' },
          { min: 3, max: 30, message: this.$t('rule_len3_len30'), trigger: 'blur' }
        ],
        platform: [
          { required: true, message: this.$t('rule_platform_require'), trigger: 'blur' },
          { min: 3, max: 30, message: this.$t('rule_len3_len30'), trigger: 'blur' }
        ],
        vendor: [
          { required: true, message: this.$t('rule_vendor_require'), trigger: 'blur' },
          { min: 3, max: 30, message: this.$t('rule_len3_len30'), trigger: 'blur' }
        ]
      }
      return {
        loading: true,
        activeName: '1',
        modelData: {
          model: '',
          type: '',
          platform: '',
          vendor: ''
        },
        modeList: [
          { 'value': 'yun' },
          { 'value': 'iot' }
        ],
        typeList: [
          { 'value': 'gateway' },
          { 'value': 'thing' },
          { 'value': 'iot' }
        ],
        platformList: [
          { 'value': 'ls1043ardb-1' },
          { 'value': 'ls1046a' }
        ],
        vendorList: [
          { 'value': 'nxp' },
          { 'value': 'freescalse' }
        ],
        rules: modelDataRule
      }
    },
    methods: {
      getModelById (id) {
        thisVue.loading = true
        getModelInfo({id}).then(dat => {
          let res = dat.data
          thisVue.loading = false
          if (res) {
            let {model, type, platform, vendor} = res
            thisVue.modelData = {model, type, platform, vendor}
          }
        }).catch(_ => {
          thisVue.loading = false
        })
      },
      updateModelById (modelId) {
        let modelData = thisVue.modelData
        modelData.id = modelId
        thisVue.loading = true
        modelUpdate(modelData).then(dat => {
          let res = dat.data
          thisVue.loading = false
          if (res.status === 'fail') {
            thisVue.$message({type: 'error', message: thisVue.$t('update_fail')})
          } else {
            thisVue.$message({message: thisVue.$t('upload_model_success'), type: 'success'})
            thisVue.$emit('closeDialog')
          }
        }).catch(_ => {
          thisVue.loading = false
        })
      },
      submitForm (formName) {
        thisVue.$refs[formName].validate((valid) => {
          if (valid) {
            thisVue.updateModelById(thisVue.modelId)
          } else {
            return false
          }
        })
      },
      resetForm (form) {
        thisVue.$refs[form].resetFields()
      }
    },
    mounted () {
      thisVue = this
      thisVue.getModelById(thisVue.modelId)
    },
    watch: {
      modelId: function (newVal, oldVal) {
        thisVue.getModelById(newVal)
      }
    }
  }
</script>
<style scoped>
  .el-select{width: 100%;}
</style>