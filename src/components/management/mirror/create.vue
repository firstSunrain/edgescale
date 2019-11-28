<template>
  <div v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading....">
    <el-form :model="createMirrorForm" :rules="createMirrorRules" ref="createMirrorForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="Mirror" prop="name">
        <el-input size='small' v-model="createMirrorForm.name"></el-input>
      </el-form-item>
      <el-form-item label="Description" prop="description">
        <el-input v-model="createMirrorForm.description"></el-input>
      </el-form-item>
      <el-form-item label="Permission" prop="is_public">
        <el-radio-group size='small' v-model="createMirrorForm.is_public">
          <el-radio-button :label="false">{{ $t('upper_private') }}</el-radio-button>
          <el-radio-button :label="true">{{ $t('upper_public') }}</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div class="item-button">
      <el-button size='small' class='common-btn' @click="closeDialog">{{ $t('cancel') }}</el-button>
      <el-button size='small' type='primary' @click="submitForm('createMirrorForm')">{{ $t('submit') }}</el-button>
    </div>
  </div>
</template>

<script>
  import { mirrorCreate } from '@/api'
  let thisVue = null

  export default {
    data () {
      return {
        createMirrorForm: {
          name: '',
          description: '',
          is_public: false
        },
        loading: false,
        createMirrorRules: {
          name: [
            { required: true, message: 'mirror is required', trigger: 'blur,change' },
            { min: 2, max: 255, message: 'length between 2 and 255', trigger: 'blur,change' }
          ]
        }
      }
    },
    methods: {
      submitForm (formName) {
        thisVue.$refs[formName].validate((valid) => {
          if (valid) {
            thisVue.loading = true
            mirrorCreate(thisVue.createMirrorForm).then(dat => {
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
