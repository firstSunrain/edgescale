<template>
  <div name="list" class='vendor-list' v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading....">
    <el-form :model="form" :rules="createVendorRules" ref="form" label-width="100px" class="demo-ruleForm">
      <el-form-item :label="$t('vendor')" prop="name">
        <el-input v-model="form.name" size='small'></el-input>
      </el-form-item>
    </el-form>
    <div class='item-button'>
      <el-button size='small' class='common-btn' @click="closeDialog">{{ $t('cancel') }}</el-button>
      <el-button size='small' type="primary" @click="submitForm('form')">{{ $t('submit') }}</el-button>
    </div>
  </div>
</template>

<script>
  import { vendorUpdate, vendorInfo } from '@/api'
  let thisVue = null

  export default {
    props: ['vendorId'],
    data () {
      return {
        form: {
          name: ''
        },
        loading: false,
        active: 1,
        createVendorRules: {
          name: [
            { required: true, message: 'vendor is required', trigger: 'blur,change' },
            { min: 2, max: 255, message: 'length between 2 and 255', trigger: 'blur,change' },
            { pattern: /^[-\w]+$/, message: 'Project names must be 2 to 255 characters. They can include the letters A-Z and a-z, the numbers 0-9, and the special characters - and _', trigger: 'blur,change' }
          ]
        }
      }
    },
    methods: {
      submitForm (formName) {
        thisVue.$refs[formName].validate((valid) => {
          if (valid) {
            thisVue.loading = true
            vendorUpdate(thisVue.vendorId, thisVue.form).then(dat => {
              let res = dat.data
              thisVue.loading = false
              if (res && res.status === 'success') {
                thisVue.$message({ message: res.message, type: 'success' })
                thisVue.closeDialog()
              } else {
                thisVue.$message({ type: 'error', message: res.message })
              }
            }).catch(_ => {
              thisVue.loading = false
            })
          }
        })
      },
      getInfo (id) {
        thisVue.loading = true
        vendorInfo(id).then(dat => {
          let res = dat.data
          thisVue.loading = false
          thisVue.form.name = res.name
        }).catch(_ => {
          thisVue.loading = false
        })
      },
      closeDialog () {
        thisVue.$emit('closeDialog')
      }
    },
    mounted () {
      thisVue = this
      thisVue.getInfo(thisVue.vendorId)
    },
    watch: {
      vendorId (newVal, oldVal) {
        thisVue.getInfo(newVal)
      }
    }
  }
</script>

<style scoped>
  .item-button{text-align: right;}
</style>
