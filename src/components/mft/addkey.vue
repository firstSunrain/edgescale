<template>
	<div v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading...">
    <el-form :model='form' ref='form' size='mini' :rules='rules' label-width='140px'>
      <el-form-item size='small' label="sk_pub_x" prop='sk_pub_x'>
        <el-input v-model='form.sk_pub_x'></el-input>
      </el-form-item>
      <el-form-item size='small' label="sk_pub_y" prop='sk_pub_y'>
        <el-input v-model='form.sk_pub_y'></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" style='text-align: right;'>
      <el-button size='small' @click="closeDialog">{{ $t('cancel') }}</el-button>
      <el-button type='primary' size='small' @click="submitForm()">{{ $t('submit') }}</el-button>
    </div>
  </div>
</template>
<script>
  import { mftUpdate } from '@/api'
  let thisVue
  export default {
    props: ['mftId'],
    data () {
      return {
        loading: false,
        form: {
          sk_pub_x: '',
          sk_pub_y: ''
        },
        rules: {
          sk_pub_x: [{required: true, message: 'sk_pub_x is required', trigger: 'blur'}],
          sk_pub_y: [{required: true, message: 'sk_pub_y is required', trigger: 'blur'}]
        }
      }
    },
    methods: {
      closeDialog () {
        thisVue.$refs.form.resetFields()
        thisVue.$emit('closeKeyDialog')
      },
      submitForm () {
        thisVue.$refs.form.validate(valid => {
          if (valid) {
            thisVue.loading = true
            mftUpdate(thisVue.mftId, thisVue.form).then(dat => {
              let res = dat.data
              thisVue.loading = false
              if (res.status === 'success') {
                thisVue.$message({type: 'success', message: thisVue.$t('add_key_success')})
                thisVue.closeDialog()
              } else {
                thisVue.$message({type: 'error', message: thisVue.$t('add_key_fail')})
              }
            }).catch(_ => {
              thisVue.loading = false
            })
          }
        })
      }
    },
    mounted () {
      thisVue = this
    }
  }
</script>
<style>
  /**/
</style>