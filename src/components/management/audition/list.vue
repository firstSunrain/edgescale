<template>
  <div class="customer-box" v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading...">
    <el-row>
      <el-col :span='24' class='opr-box'>
        <el-col :span='22'>
          <div class='page-filter'>
            <el-input suffix-icon='el-icon-search' size='small' v-model='filter_text' class='common-input common-input-filter' @keyup.13.native='getTable' :placeholder="$t('filter_by_name')"></el-input>
            <el-select class="common-input" size='small' v-model="filter_type" filterable clearable :placeholder="$t('filter_by_type')" @change='getTable'>
              <el-option value='model' label='model'></el-option>
              <el-option value='solution' label='solution'></el-option>
              <el-option value='app' label='app'></el-option>
              </el-select>
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
        <el-table :data='tableData' size='small' v-if="page_list" @header-click='sortTable'>
          <el-table-column prop='username' :label="$t('username')"></el-table-column>
          <el-table-column prop='type' :label="$t('type')"></el-table-column>
          <el-table-column prop='username' :label="$t('name')"></el-table-column>
          <el-table-column prop='comment' :label="$t('description')"></el-table-column>
          <el-table-column prop='created_at' sortable='true' :label="$t('create_time')">
            <template slot-scope='scope'>
              <span>{{ scope.row.created_at | dateFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('status')">
            <template slot-scope='scope'>
              <div v-if='scope.row.status'>
                <span class="status-on" v-if="scope.row.approved">{{ $t('upper_accept') }}</span>
                <span class="status-off" v-else>{{ $t('upper_reject') }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('action')" width='100'>
            <template slot-scope='scope' v-if='!scope.row.status'>
              <el-tooltip class="item" effect="dark" :content="$t('audit')" placement="top">
                <i class="table-btn icon-hammer-wrench" @click="showDialog(scope.row.id)"></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <modelBlock :list='tableData' @editCustomer='showDialog' v-else></modelBlock>
      </el-col>
      <el-col :span='24' class='common-page'>
        <el-pagination background @current-change="handleCurrentChange"  @size-change="handleSizeChange" :current-page="page.number" :page-sizes="[10, 20, 30, 40]" :page-size="page.size" popper-class='page-pop' layout="total, slot, sizes, prev, pager, next" :total="page.total">
        </el-pagination>
      </el-col>
    </el-row>
    <!-- create Dialog -->
    <el-dialog :title="$t('audit')" :visible.sync='dialogVisible' :show-close='true' :close-on-click-modal='false'>
      <div v-loading='dialogLoading' element-loading-spinner="el-icon-loading" element-loading-text="loading...">
        <el-form ref='form' size='small' :model='form' label-width='130px'>
          <el-form-item :label="$t('permission')" prop='action'>
            <el-radio-group v-model="form.action">
              <el-radio-button label="reject">{{ $t('upper_reject') }}</el-radio-button>
              <el-radio-button label="accept">{{ $t('upper_accept') }}</el-radio-button>
            </el-radio-group>
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
import { getAudits, auditAction } from '@/api'
import modelBlock from './block'
let thisVue = null

export default {
  data () {
    return {
      loading: true,
      filter_text: '',
      filter_type: '',
      tableData: [],
      cur_id: null,
      page_list: true,
      orderBy: '',
      orderType: '',
      page: {
        size: 10,
        total: 0,
        number: 1
      },
      form: {
        action: 'reject'
      },
      dialogVisible: false,
      dialogLoading: false
    }
  },
  filters: {
    dateFormat (val) {
      if (val) {
        let _date = new Date(val)
        let y = _date.getFullYear()
        let m = _date.getMonth() + 1
        let d = _date.getDate()
        let h = _date.getHours() >= 10 ? _date.getHours() : `0${_date.getHours()}`
        let mm = _date.getMinutes() >= 10 ? _date.getMinutes() : `0${_date.getMinutes()}`
        let s = _date.getSeconds() >= 10 ? _date.getSeconds() : `0${_date.getSeconds()}`
        return `${y}-${m}-${d} ${h}:${mm}:${s}`
      } else {
        return ''
      }
    }
  },
  methods: {
    getTable () {
      thisVue.loading = true
      let {size, number} = thisVue.page
      let offset = size * (number - 1)
      let limit = size
      let params = {limit, offset, filter_text: thisVue.filter_text, filter_type: thisVue.filter_type, orderBy: thisVue.orderBy, orderType: thisVue.orderType}
      getAudits(params).then(dat => {
        let res = dat.data
        thisVue.loading = false
        thisVue.tableData = res.results
        thisVue.page.total = res.total
      }).catch(_ => {
        thisVue.loading = false
      })
    },
    submitForm (form) {
      let params = thisVue.form
      thisVue.$refs[form].validate(valid => {
        if (valid) {
          thisVue.dialogLoading = true
          auditAction(thisVue.cur_id, params).then(dat => {
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
    showDialog (id) {
      thisVue.dialogVisible = true
      thisVue.cur_id = id
    },
    closeDialog () {
      thisVue.dialogVisible = false
      thisVue.$refs['form'].resetFields()
    },
    sortTable (column, event) {
      if (!column.sortable) return
      thisVue.orderBy = column.property
      if (column.order === 'ascending') {
        thisVue.orderType = 'asc'
      } else {
        thisVue.orderType = 'desc'
      }
      thisVue.getTable()
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
