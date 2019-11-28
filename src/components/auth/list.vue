<template>
  <div name="list" class='app-list'>
    <el-row class='list-box' v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading....">
      <el-col :span='24' class='opr-box'>
        <div class='page-filter'>
          <el-input class="common-input" clearable size='small' @keyup.native.enter='getTable' suffix-icon="el-icon-search" v-model="filter_text" :placeholder="$t('filter_by_name')"></el-input>
          <!-- status -->
          <el-select class="common-input" size='small' @change='getTable' v-model="filter_status" clearable :placeholder="$t(`filter_by_status`)">
            <el-option :label="$t('Approved')" value="approve"></el-option>
            <el-option :label="$t('Rejected')" value="reject"></el-option>
            <el-option :label="$t('Pending')" value="pending"></el-option>
          </el-select>
          <!-- type -->
          <el-select class="common-input" size='small' @change='getTable' v-model="filter_type" clearable :placeholder="$t(`filter_by_type`)">
            <el-option label="OEM" value="oem"></el-option>
            <el-option label="USER" value="user"></el-option>
          </el-select>
        </div>
      </el-col>
      <el-col :span='24' class='com-table'>
        <el-table :data='tableList' align='center' @header-click='sortTable'>
          <el-table-column :label="$t('name')">
            <template slot-scope='scope'>
              <span>{{scope.row.first_name}}.{{scope.row.last_name}}</span>
            </template>
          </el-table-column>
          <el-table-column prop='email' :label="$t('email')" width='200px'></el-table-column>
          <el-table-column prop='company_name' :label="$t('company')"></el-table-column>
          <el-table-column prop='telephone' :label="$t('telephone')"></el-table-column>
          <el-table-column prop='job_title' :label="$t('job')"></el-table-column>
          <el-table-column prop='account_type' :label="$t('type')" width='80px'></el-table-column>
          <el-table-column sortable='true' prop='created_at' :label="$t('create_time')"></el-table-column>
          <el-table-column :label="$t('status')">
            <template slot-scope='scope'>
              <span class="status-on" v-if="scope.row.status == 'Approved'">{{ $t('upper_accept') }}</span>
              <span class="status-off" v-if="scope.row.status == 'Rejected'">{{ $t('upper_reject') }}</span>
              <span class="status-new" v-if="scope.row.status == 'Pending'">{{ $t('not_audit') }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('action')" width='100'>
            <template slot-scope='scope' v-if="scope.row.status === 'Pending'">
              <el-tooltip class="item" effect="dark" :content="$t('audit')" placement="top">
                <i class="table-btn icon-hammer-wrench" @click="showDialog(scope.row.id)"></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span='24' class='common-page'>
        <el-pagination background @current-change="handleCurrentChange"  @size-change="handleSizeChange" :current-page="page.cur_page" :page-sizes="[10, 20, 30, 40]" :page-size="page.page_size" popper-class='page-pop' layout="total, slot, sizes, prev, pager, next" :total="page.total">
        </el-pagination>
      </el-col>
    </el-row>
    <!-- check dialog -->
    <el-dialog :title="$t('audit')" :visible.sync='dialogVisible' :show-close='true' :close-on-click-modal='false'>
      <div v-loading='dialogLoading' element-loading-spinner="el-icon-loading" element-loading-text="loading...">
        <el-form ref='form' size='small' :model='form' label-width='130px'>
          <el-form-item :label="$t('permission')" prop='action'>
            <el-radio-group v-model="form.action">
              <el-radio-button label="reject">{{ $t('upper_reject') }}</el-radio-button>
              <el-radio-button label="approve">{{ $t('upper_accept') }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer" style='text-align: right;'>
          <el-button size='small' @click="closeDialog">{{ $t('cancel') }}</el-button>
          <el-button size='small' type="primary" @click="authAction">{{ $t('submit') }}</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { accountList, accountAudit } from '@/api'
  let thisVue = null

  export default {
    data () {
      return {
        loading: false,
        dialogLoading: false,
        tableList: [],
        dialogVisible: false,
        filter_text: '',
        filter_status: '',
        filter_type: '',
        cur_id: '',
        orderBy: '',
        orderType: '',
        form: {
          action: 'approve'
        },
        page: {
          cur_page: 1,
          page_size: 10,
          total: 0
        }
      }
    },
    methods: {
      getTable () {
        thisVue.loading = true
        let limit = thisVue.page.page_size
        let offset = (thisVue.page.cur_page - 1) * limit
        let params = {limit, offset, filter_text: thisVue.filter_text, filter_status: thisVue.filter_status, filter_type: thisVue.filter_type, orderBy: thisVue.orderBy, orderType: thisVue.orderType}
        accountList(params).then(dat => {
          let res = dat.data
          thisVue.loading = false
          thisVue.tableList = res.accounts
          thisVue.page.total = res.total
        }).catch(_ => {
          thisVue.loading = false
        })
      },
      showDialog (id) {
        thisVue.cur_id = id
        thisVue.dialogVisible = true
      },
      closeDialog () {
        thisVue.dialogVisible = false
        thisVue.getTable()
      },
      authAction () {
        thisVue.dialogLoading = true
        accountAudit(thisVue.cur_id, thisVue.form).then(dat => {
          let res = dat.data
          thisVue.dialogLoading = false
          if (res.status === 'success') {
            thisVue.$message({type: 'success', message: res.message})
            thisVue.closeDialog()
          } else if (res.status === 'fail') {
            thisVue.$message({type: 'error', message: res.message})
          }
        }).catch(_ => {
          thisVue.dialogLoading = false
        })
      },
      handleCurrentChange (index) {
        thisVue.page.cur_page = index
        thisVue.getTable()
      },
      handleSizeChange (value) {
        thisVue.page.page_size = value
        thisVue.getTable()
      },
      sortTable (column, event) {
        if (column.sortable) {
          console.log(column)
          thisVue.orderBy = column.property
          if (column.order) {
            thisVue.orderType = column.order.substring(0, column.order.length - 6)
          }
          thisVue.getTable()
        }
      }
    },
    mounted () {
      thisVue = this
      thisVue.getTable()
    }
  }
</script>

<style scoped>
  .app-list{min-height: 500px;}
  .list-box{background-color: #fff; padding: 20px;}
  .opr-box{padding-bottom: 15px;}
</style>
