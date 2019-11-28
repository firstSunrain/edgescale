<template>
  <div v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading...">
    <el-form ref='groupFrom' size='small' :model='groupForm' :rules='rules' label-width='130px'>
      <el-form-item :label="$t('name')" prop='name'>
        <el-input type="text" v-model='groupForm.name'></el-input>
      </el-form-item>
      <el-form-item :label="$t('description')" prop='description'>
        <el-input type="textarea" v-model='groupForm.description'></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size='small' @click="closeDialog">{{ $t('cancel') }}</el-button>
      <el-button size='small' type="primary" @click="saveGroup('groupFrom')">{{ $t('submit') }}</el-button>
    </div>
  </div>
</template>

<script>
import { groupOpr } from '@/api'
let thisVue = null

export default {
  props: ['groupItem'],
  data () {
    return {
      loading: false,
      groupForm: {id: '', name: '', description: ''},
      rules: {
        name: [{required: true, trigger: 'blur', message: this.$t('rule_name_require')}]
      }
    }
  },
  methods: {
    saveGroup (form) {
      thisVue.$refs[form].validate(valid => {
        if (valid) {
          thisVue.loading = true
          let params = thisVue.groupForm
          let url = `device-group`
          let method = 'post'
          if (params.id) {
            url = `device-group/${params.id}`
            method = 'put'
          }
          groupOpr(method, url, params).then(dat => {
            let res = dat.data
            thisVue.loading = false
            if (res.status === 'success') {
              if (method === 'put') {
                thisVue.$message({message: thisVue.$t('update_group_success'), type: 'success'})
              } else {
                thisVue.$message({message: thisVue.$t('create_group_success'), type: 'success'})
              }
              thisVue.$emit('closeDialog')
            } else {
              thisVue.$message({message: res.message, type: 'error'})
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
    thisVue.groupForm = thisVue.groupItem
  },
  watch: {
    groupItem: {
      handler: function (nVal, oVal) {
        thisVue.groupForm = nVal
      },
      deep: true
    }
  }
}
</script>
<style scoped>
  .opr-box{padding-bottom: 15px;}
</style>
