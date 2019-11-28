<template>
  <div v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading...">
    <el-form :model="modelForm" :rules="rules" ref="modelForm" label-width='100px' status-icon size='small'>
      <el-form-item :label="$t('model')" prop="model">
        <el-select v-model="modelForm.model" filterable allow-create clearable>
          <el-option v-for="item in modeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('type')" prop="type" >
        <el-select v-model="modelForm.type" filterable allow-create clearable>
          <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('platform')" prop="platform">
        <el-select v-model="modelForm.platform" filterable allow-create clearable>
          <el-option v-for="item in platformList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('vendor')" prop="vendor">
        <el-select v-model="modelForm.vendor" filterable allow-create clearable>
          <el-option v-for="item in vendorList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

    </el-form>
    <div style='text-align: right;'>
      <el-button size='small' @click="resetForm('modelForm')">{{ $t('reset') }}</el-button>
      <el-button size="small" type="primary" @click="submitForm('modelForm')">{{ $t('submit') }}</el-button>
    </div>
  </div>
</template>

<script>
  import { modelCreate } from '@/api'

  let thisVue = null

  export default {
    data () {
      return {
        loading: false,
        modelForm: {
          model: '',
          type: '',
          platform: '',
          vendor: ''
        },
        modeList: [
          { 'value': 'cloud' },
          { 'value': 'iot' }
        ],
        typeList: [
          { 'value': 'gateway' },
          { 'value': 'thing' },
          { 'value': 'iot' }
        ],
        platformList: [
          { 'value': 'ls1043ardb' },
          { 'value': 'ls1046a' }
        ],
        vendorList: [
          { 'value': 'nxp' },
          { 'value': 'raspberrypi' }
        ],
        rules: {
          model: [
            { required: true, message: this.$t('rule_model_require'), trigger: 'change' },
            { min: 3, max: 8, message: this.$t('rule_len3_len8'), trigger: 'change' }
          ],
          type: [
            { required: true, message: this.$t('rule_type_require'), trigger: 'change' },
            { min: 3, max: 30, message: this.$t('rule_len3_len30'), trigger: 'change' }
          ],
          platform: [
            { required: true, message: this.$t('rule_platform_require'), trigger: 'change' },
            { min: 3, max: 30, message: this.$t('rule_len3_len30'), trigger: 'change' }
          ],
          vendor: [
            { required: true, message: this.$t('rule_vendor_require'), trigger: 'blur' },
            { min: 3, max: 30, message: this.$t('rule_len3_len30'), trigger: 'change' }
          ]
        }
      }
    },
    methods: {
      createModel () {
        thisVue.loading = true
        let modelData = thisVue.modelForm
        modelCreate(modelData).then(dat => {
          let res = dat.data
          thisVue.loading = false
          if (res.status === 'fail') {
            thisVue.$message({type: 'error', message: res.message})
          } else {
            thisVue.$message({message: thisVue.$t('create_success'), type: 'success'})
            thisVue.$emit('closeDialog')
          }
        }).catch(_ => {
          thisVue.loading = false
        })
      },
      submitForm (formName) {
        thisVue.$refs[formName].validate((valid) => {
          if (valid) {
            thisVue.createModel()
          } else {
            return false
          }
        })
      },
      resetForm (formName) {
        thisVue.$refs[formName].resetFields()
      }
    },
    mounted () {
      thisVue = this
    }
  }
</script>
<style scoped>
  .el-select{width: 100%;}
</style>
