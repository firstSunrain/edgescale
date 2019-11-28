<template>
  <div class="customer-box" v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading...">
    <el-row>
      <el-col :span='24' class='opr-box'>
        <el-col :span='22'>
          <div class='page-filter'>
            <el-input suffix-icon='el-icon-search' size='small' v-model='filter_text' class='common-input common-input-filter' @keyup.13.native='getTable' :placeholder="$t('filter_by_name')"></el-input>
            <el-button class="common-btn" size='small' @click="showDialog('add')">
              <i class="icon-googleplus5 text-size-base"></i>
              <span>{{ $t('create') }}</span>
            </el-button>
          </div>
        </el-col>
        <el-col :span='2' class='page-type'>
          <el-button-group>
            <el-button :class="{'active':page_list==true}" icon="icon-list2" size='mini' @click="page_list=true"></el-button>
            <el-button :class="{'active':page_list==false}" icon="icon-grid6" size='mini' @click="page_list=false"></el-button>
          </el-button-group>
        </el-col>
      </el-col>
      <el-col :span='24' class='com-table'>
        <el-table :data='tableData' size='small' v-if="page_list">
          <el-table-column :label="$t('name')">
            <template slot-scope='scope'>
              <router-link :to="{name: 'customer_detail', params: {id: scope.row.id}}">{{scope.row.name}}</router-link>
            </template>
          </el-table-column>
          <el-table-column prop='description' :label="$t('description')"></el-table-column>
          <el-table-column prop='created_at' :label="$t('create_time')"></el-table-column>
          <el-table-column prop='updated_at' :label="$t('update_time')"></el-table-column>
          <el-table-column :label="$t('action')" width='100'>
            <template slot-scope='scope'>
              <!-- <el-tooltip class="item" effect="dark" :content="$t('edit')" placement="top">
                <i class="table-btn icon-pencil5" @click="showDialog('edit', scope.row)"></i>
              </el-tooltip> -->
              <el-tooltip class="item" effect="dark" :content="$t('delete')" placement="top">
                <i class="table-btn icon-trash" @click="del(scope.$index)"></i>
              </el-tooltip>
              <router-link v-if="$store.state.account_type === 'OEM'" :to="{'name': 'mft_list'}" class='table-btn'><i class="iconfont icon-piliangdaoru"></i></router-link>
            </template>
          </el-table-column>
        </el-table>
        <modelBlock :list='tableData' @editCustomer='showDialog' @delCustomer='del' v-else></modelBlock>
      </el-col>
      <el-col :span='24' class='common-page'>
        <el-pagination background @current-change="handleCurrentChange"  @size-change="handleSizeChange" :current-page="page.number" :page-sizes="[10, 20, 30, 40]" :page-size="page.size" popper-class='page-pop' layout="total, slot, sizes, prev, pager, next" :total="page.total">
        </el-pagination>
      </el-col>
    </el-row>
    <!-- create Dialog -->
    <el-dialog :title='dialogTit' :visible.sync='dialogVisible' :show-close='true' :close-on-click-modal='false'>
      <div v-loading='dialogLoading' element-loading-spinner="el-icon-loading" element-loading-text="loading...">
        <el-form ref='form' size='small' :model='form' :rules='rules' label-width='130px'>
          <el-form-item :label="$t('name')" prop='name'>
            <el-input type="text" v-model='form.name'></el-input>
          </el-form-item>
          <el-form-item :label="$t('description')" prop='description'>
            <el-input type="textarea" v-model='form.description'></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" style='text-align: right;'>
          <el-button size='small' @click="closeDialog">{{ $t('cancel') }}</el-button>
          <el-button size='small' type="primary" @click="submitForm('form')">{{ $t('submit') }}</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCustomerList, customerDelete, customerOpr } from '@/api'
import modelBlock from './block'
let thisVue = null

export default {
  data () {
    return {
      loading: true,
      filter_text: '',
      tableData: [],
      page_list: true,
      page: {
        size: 10,
        total: 0,
        number: 1
      },
      form: {
        name: '',
        description: '',
        id: ''
      },
      rules: {
        name: [{required: true, trigger: 'blur', message: this.$t('rule_name_require')}]
      },
      dialogTit: this.$t('create'),
      dialogVisible: false,
      dialogType: 'add',
      dialogLoading: false
    }
  },
  methods: {
    getTable () {
      thisVue.loading = true
      let {size, number} = thisVue.page
      let offset = size * (number - 1)
      let limit = size
      let params = {limit, offset, filter_name: thisVue.filter_text}
      getCustomerList(params).then(dat => {
        let res = dat.data
        thisVue.loading = false
        if (res) {
          thisVue.tableData = res.customers
          thisVue.page.total = res.total
        }
      }).catch(_ => {
        thisVue.loading = false
      })
    },
    del (index) {
      let id = thisVue.tableData[index].id
      thisVue.$confirm(thisVue.$t('customer_del_msg'), thisVue.$t('delete'), {type: 'warning'}).then(_ => {
        thisVue.loading = true
        customerDelete({customer_id: id}).then(dat => {
          let res = dat.data
          thisVue.loading = false
          if (res.status === 'success') {
            thisVue.$message({message: thisVue.$t('del_success'), type: 'success'})
            thisVue.getTable()
          } else {
            thisVue.$message({message: thisVue.$t('del_fail'), type: 'error'})
            thisVue.dialogVisible = false
          }
        }).catch(_ => {
          thisVue.loading = false
        })
      }).catch(_ => {
        return false
      })
    },
    submitForm (form) {
      let url = 'customers'
      let method = 'post'
      let {name, description} = thisVue.form
      let params = {name, description}
      if (thisVue.dialogType === 'edit') {
        let {id, isActive} = thisVue.form
        params.customer_id = id
        params.is_active = isActive
        url = `customers/${id}`
        method = 'put'
      }
      thisVue.$refs[form].validate(valid => {
        if (valid) {
          thisVue.dialogLoading = true
          customerOpr(method, url, params).then(dat => {
            let res = dat.data
            thisVue.dialogLoading = false
            if (res.status === 'fail') {
              thisVue.$message({message: thisVue.$t('operation_fail'), type: 'error'})
            } else {
              thisVue.$message({message: thisVue.$t('operation_success'), type: 'success'})
              thisVue.closeDialog()
              thisVue.getTable()
            }
          }).catch(_ => {
            thisVue.dialogLoading = false
          })
        }
      })
    },
    showDialog (type, val) {
      thisVue.dialogType = type
      thisVue.dialogVisible = true
      if (type === 'edit') {
        thisVue.dialogTit = thisVue.$t('edit')
        let {name, description, id} = val
        let isActive = val.is_active
        thisVue.form = {name, description, id, isActive}
      } else {
        thisVue.form = {name: '', description: '', id: ''}
      }
    },
    closeDialog () {
      thisVue.$refs['form'].resetFields()
      thisVue.dialogTit = thisVue.$t('create')
      thisVue.dialogVisible = false
    },
    handleSelectionChange (val) {
      thisVue.deployDevIds.push(val.id)
    },
    handleCurrentChange (val) {
      thisVue.page.number = val
      thisVue.getTable()
    },
    handleSizeChange (val) {
      thisVue.page.size = val
      thisVue.getTable()
    }
  },
  mounted () {
    thisVue = this
    thisVue.getTable()
  },
  components: { modelBlock }
}
</script>
<style scoped>
  .el-select{width: 100%;}
  .page-type{text-align: right;}
  .page-type .el-button{margin:4px;padding: 0px; color: #c7cbd2;
    border-color: #fff;
    background-color: #fff;}
  .page-type .el-button:focus,.page-type .el-button.active {
    color: #1a2e40;
    border-color: #fff;
    background-color: #fff;
  }
</style>
<style>
  .page-type .el-button i{ padding-right:0;font-size:16px !important;}
  .upload-icon input{display: none;}
  .btn-filter button{ height:32px;}
</style>
