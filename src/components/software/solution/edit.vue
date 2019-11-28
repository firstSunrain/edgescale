<template>
  <!-- Apply form -->
  <div class='list-box' v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading....">
    <el-form :model="editSolutionForm" :rules="editSolutionRules" ref="editSolutionForm" size='small' label-position="left" class="demo-ruleForm" id="editSolutionFormSubmit" label-width='140px'>
      <el-form-item :label="$t('solution_name')">
        <el-input v-model="solutionName" disabled></el-input>
      </el-form-item>
      <el-form-item :label="$t('solution_link')" prop="url">
        <el-input v-model="editSolutionForm.url"></el-input>
        <input type="hidden" name="id" :value="editSolutionForm.id">
      </el-form-item>
      <el-form-item label="" prop="is_default" v-if="is_model_owner">
        <el-checkbox v-model="isDefault">{{ $t('edit_solution_msg') }}</el-checkbox>
      </el-form-item>
      <el-form-item style='text-align: right;'>
        <el-button @click="cancel">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="editSolutionFormSubmit('editSolutionForm')">{{ $t('submit') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import { solutionInfo, solutionUpdate } from '@/api'
  let thisVue = null
  export default {
    props: ['selItem', 'isDefault'],
    data () {
      let editSolutionForm = {
        url: '',
        id: ''
      }
      let editSolutionRules = {
        url: [
          {required: true, message: 'Image url is required', trigger: 'blur'},
          { pattern: /^(http([s]?):\/\/([\w.-]+)\/)([\w.-]+\/)*([\w.-]+)$/, message: "Image url starts with 'https://s3-us-west-2.amazonaws.com/edgescale.org/release/ls1046ardb/dcca_lsdk1706-ls1046_image_sdboot.tgz'", trigger: 'blur' }
        ]
      }
      return {
        solutionId: this.selItem.solutionId,
        loading: false,
        is_model_owner: false,
        editSolutionForm: editSolutionForm,
        editSolutionRules: editSolutionRules,
        solutionName: ''
      }
    },
    methods: {
      getSolutionDetail (solutionId) {
        thisVue.loading = true
        solutionInfo(solutionId).then(dat => {
          let res = dat.data
          thisVue.loading = false
          if (res) {
            let {link, id, is_default, solution} = res
            thisVue.solutionName = solution
            let url = ''
            if (link) {
              url = link
            }
            thisVue.is_model_owner = res.model.is_owner
            thisVue.editSolutionForm = {url, id, is_default}
          }
        }).catch(_ => {
          thisVue.loading = false
          return false
        })
      },
      getSolutionUrl () {
        thisVue.editSolutionForm.url = thisVue.selItem.solutionUrl
        thisVue.editSolutionForm.id = thisVue.selItem.solutionId
      },
      editSolutionFormSubmit (formName) {
        thisVue.$refs[formName].validate((valid) => {
          if (valid) {
            if (!thisVue.loading) {
              thisVue.loading = true
            }
            thisVue.editSolution()
          } else {
            return false
          }
        })
      },
      editSolution () {
        if (thisVue.isDefault === false) {
          thisVue.editSolutionForm.is_default = 'false'
        } else {
          thisVue.editSolutionForm.is_default = 'true'
        }
        let editSolutionFormData = thisVue.editSolutionForm
        solutionUpdate(editSolutionFormData).then(dat => {
          let res = dat.data
          thisVue.loading = false
          if (res.status === 'success') {
            thisVue.$message({message: thisVue.$t('update_success'), type: 'success'})
            thisVue.$emit('closeDialog')
          } else {
            thisVue.$message({type: 'error', message: thisVue.$t('update_fail')})
          }
        }).catch(_ => {
          thisVue.loading = false
          return false
        })
      },
      cancel () {
        thisVue.$emit('closeDialog')
      }
    },
    mounted: function () {
      thisVue = this
      thisVue.getSolutionUrl()
      thisVue.getSolutionDetail(thisVue.solutionId)
    },
    watch: {
      selItem: {
        handler: function (newVal, oldVal) {
          thisVue.solutionId = newVal.solutionId
          thisVue.getSolutionDetail(thisVue.solutionId)
        },
        deep: true
      }
    }
  }
</script>
