<template>
  <div name="list">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item :label="$t('username')" prop="username">
        <el-input size='small' v-model="ruleForm.username"></el-input>
      </el-form-item>
      <el-form-item :label="$t('email')" prop="email">
        <el-input size='small' type='email' v-model="ruleForm.email"></el-input>
      </el-form-item>
    </el-form>
    <div class='item-button'>
      <el-button size='small' class='common-btn' @click="closeDialog">{{ $t('cancel') }}</el-button>
      <el-button size='small' type="primary" @click="submitForm('ruleForm')">{{ $t('submit') }}</el-button>
    </div>
  </div>
</template>

<script>
  import { userCreate } from '@/api'
  let thisVue = null

  export default {
    data () {
      return {
        ruleForm: {
          username: '',
          email: ''
        },
        loading: false,
        rules: {
          username: [
            { required: true, message: this.$t('rule_username_require'), trigger: 'blur' },
            { min: 4, max: 255, message: 'length between 4 and 255', trigger: 'blur' },
            { pattern: /^[-\w]+$/, message: 'Username must be 4 to 255 characters. They can include the letters A-Z and a-z, the numbers 0-9, and the special characters - and _', trigger: 'blur' }
          ],
          email: [
            { required: true, message: this.$t('rule_email_require'), trigger: 'blur' },
            { min: 2, max: 255, message: 'length between 2 and 255', trigger: 'blur' },
            {pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: 'the pattern of email is not right', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      submitForm (formName) {
        thisVue.$refs[formName].validate((valid) => {
          if (valid) {
            thisVue.loading = true
            userCreate(thisVue.ruleForm).then(dat => {
              let res = dat.data
              thisVue.loading = false
              if (res && res.status === 'success') {
                thisVue.$message({type: 'success', message: res.message})
                thisVue.closeDialog()
              } else {
                thisVue.$message({type: 'error', message: res.message})
              }
            }).catch(_ => {
              thisVue.loading = false
            })
          }
        })
      },
      closeDialog () {
        thisVue.$emit('closeDialog')
      }
    },
    mounted () {
      thisVue = this
    }
  }
</script>

<style scoped>
  .el-select{width: 100%;}
  .item-button{text-align: right;}
</style>
