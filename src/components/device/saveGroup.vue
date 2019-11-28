<template>
  <div v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading...">
    <el-form ref='groupForm' size='small' :model='groupForm' :rules='rules' label-width='130px'>
      <el-form-item :label="$t('devices')">
        <el-radio-group v-model="groupType">
          <el-radio-button :label='1'>{{ $t('selected_devices') }}</el-radio-button>
          <el-radio-button :label='2'>{{ $t('all_filter_devices') }}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('group_name')" prop='name'>
        <el-input type="text" v-model='groupForm.name'></el-input>
      </el-form-item>
      <el-form-item :label="$t('customer')" prop='customer'>
        <el-select v-model='groupForm.customer'>
          <el-option v-for='(value, key) in customers' :key='key' :value='value.id' :label='value.name'></el-option>
          <a class='get-more' @click='getCustomers'>{{ $t('more') }}...</a>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('description')" prop='description'>
        <el-input type="textarea" v-model='groupForm.description'></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size='small' @click="closeDialog">{{ $t('cancel') }}</el-button>
      <el-button size='small' type="primary" @click="saveGroup('groupForm')">{{ $t('submit') }}</el-button>
    </div>
  </div>
</template>

<script>
import { getCustomerList, saveAsGroup } from '@/api'
let thisVue = null

export default {
  props: ['selectDevs', 'condition'],
  data () {
    return {
      loading: false,
      customers: [],
      groupType: 1,
      groupForm: {name: '', description: '', customer: ''},
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
          if (thisVue.groupType === 1) {
            if (thisVue.selectDevs.length === 0) {
              thisVue.$message({type: 'error', message: thisVue.$t('no_dev_check')})
            } else {
              params.devices = thisVue.selectDevs
            }
          } else {
            Object.assign(params, params, thisVue.condition)
          }
          saveAsGroup(params).then(dat => {
            let res = dat.data
            if (res.status === 'success') {
              thisVue.$message({message: res.message, type: 'success'})
              thisVue.$emit('closeDialog')
            } else {
              thisVue.$message({message: res.message, type: 'error'})
            }
          }).catch(_ => {
            thisVue.loading = false
          })
        } else {
          return false
        }
      })
    },
    getCustomers () {
      let offset = thisVue.customers.length
      getCustomerList({limit: 10, offset}).then(dat => {
        let res = dat.data
        res.customers.map(item => {
          thisVue.customers.push(item)
        })
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
    thisVue.getCustomers()
  }
}
</script>
<style scoped>
  .opr-box{padding-bottom: 15px;}
  .dialog-footer{text-align: right;}
  .el-select{width: 100%;}
</style>
