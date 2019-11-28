<template>
  <div v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading...">
    <el-form :model="form" :rules="rules" ref="form" label-width='100px' status-icon size='small'>
      <el-form-item :label="$t('name')" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>

      <el-form-item :label="$t('desc')" prop="desc">
        <el-input v-model="form.description" type='textArea'></el-input>
      </el-form-item>
    </el-form>
    <div style='text-align: right;'>
      <el-button size='small' @click="resetForm('form')">{{ $t('cancel') }}</el-button>
      <el-button size="small" type="primary" @click="submitForm('form')">{{ $t('submit') }}</el-button>
    </div>
  </div>
</template>

<script>
  import { updateSubdev } from '@/api'

  let thisVue = null

  export default {
    props: ['curItem'],
    data () {
      return {
        loading: false,
        form: {
          name: '',
          description: ''
        },
        rules: {
          name: [
            { required: true, message: this.$t('rule_name_require'), trigger: 'blue' }
          ]
        }
      }
    },
    methods: {
      updateFirmware () {
        thisVue.loading = true
        let params = thisVue.form
        params.id = thisVue.curItem.id
        updateSubdev(params).then(dat => {
          let res = dat.data
          thisVue.loading = false
          if (res.code === 0) {
            thisVue.$message({message: thisVue.$t('operation_success'), type: 'success'})
            thisVue.$emit('closeDialog')
          } else {
            thisVue.$message({type: 'error', message: thisVue.$t('operation_fail')})
          }
        }).catch(_ => {
          thisVue.loading = false
        })
      },
      submitForm (formName) {
        thisVue.$refs[formName].validate((valid) => {
          if (valid) {
            thisVue.updateFirmware()
          } else {
            return false
          }
        })
      },
      resetForm (formName) {
        thisVue.$refs[formName].resetFields()
        thisVue.$emit('closeDialog')
      }
    },
    mounted () {
      thisVue = this
      thisVue.form.name = thisVue.curItem.name
    },
    watch: {
      curItem (newVal, oldVal) {
        thisVue.form.name = newVal.name
      }
    }
  }
</script>
<style scoped>
  .el-select{width: 100%;}
</style>
