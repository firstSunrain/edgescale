<template>
  <div name="list" class='app-list'>
    <el-row class='list-box' v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading....">
      <el-col :span='24'>
        <div class='page-filter'>
          <el-input class="common-input" clearable size='small' @keyup.native.enter='getTable' suffix-icon="el-icon-search" v-model="filter_text" :placeholder="$t('filter_by_name')"></el-input>
          <el-button class="common-btn" size='small' @click="deletePrj" :disabled='!isDel'><i class="icon-trash"></i>{{ $t('delete') }}</el-button>
          <el-button class="common-btn" size='small' @click="showDialog('create')"><i class="icon-googleplus5 text-size-base"></i>{{ $t('create') }}</el-button>
        </div>
      </el-col>
      <el-col :span='24' class='com-table'>
        <el-table :data='tableList' align='center' @header-click='sortTable' @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column :label="$t('name')">
            <template slot-scope='scope'>
              {{scope.row.name}}
            </template>
          </el-table-column>
          <el-table-column sortable prop='created_at' :label="$t('create_time')"></el-table-column>
          <el-table-column sortable prop='updated_at' :label="$t('update_time')"></el-table-column>
          <el-table-column label='Action' width='150'>
            <template slot-scope='scope'>
              <el-tooltip effect="dark" content="edit" placement="top-start">
                <i class="icon-pencil7 table-btn" @click="showDialog('edit', scope.$index)"></i>
              </el-tooltip>
              <el-tooltip effect="dark" content="delete" placement="top-start">
                <i class="icon-trash table-btn" @click='deletePrj(scope.$index)'></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span='24' class='common-page'>
        <el-pagination background @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="pageData.currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pageData.pageSize" layout="total, sizes, prev, pager, next" :total="pageData.total">
        </el-pagination>
      </el-col>
    </el-row>
    <!-- create Vnedor -->
    <el-dialog :visible.sync='comDialog' :title="$t(dialogType)" :show-close='true' :close-on-click-modal='false'>
      <createVendor @closeDialog='closeDialog' v-if="dialogType == 'create'"></createVendor>
      <editVendor @closeDialog='closeDialog' v-if="dialogType == 'edit'" :vendorId='cur_id'></editVendor>
    </el-dialog>
  </div>
</template>

<script>
  import { vendorList, vendorDelete } from '@/api'
  import createVendor from './create'
  import editVendor from './edit'

  let thisVue = null

  export default {
    components: { createVendor, editVendor },
    data () {
      return {
        tableList: [],
        loading: true,
        filter_text: '',
        isDel: 0,
        selItem: [],
        comDialog: false,
        dialogType: 'create',
        cur_id: '',
        pageData: {
          total: 0,
          pageSize: 10,
          currentPage: 1
        },
        orderBy: '',
        orderType: ''
      }
    },
    methods: {
      getTable () {
        thisVue.loading = true
        let limit = thisVue.pageData.pageSize
        let offset = (thisVue.pageData.currentPage - 1) * limit
        let params = {limit, offset, orderType: thisVue.orderType, orderBy: thisVue.orderBy, filter_name: thisVue.filter_text}
        vendorList(params).then(dat => {
          let res = dat.data
          thisVue.loading = false
          thisVue.pageData.total = res.total
          if (res.vendors && res.vendors.length >= 0) {
            thisVue.tableList = res.vendors
          }
        }).catch(_ => {
          thisVue.loading = false
        })
      },
      handleSelectionChange (val) {
        thisVue.isDel = val.length
        thisVue.selItem = val.map(item => {
          return item.id
        })
      },
      deletePrj (index) {
        thisVue.$confirm(thisVue.$t('want_to_continue'), thisVue.$t('delete'), {type: 'error'}).then(() => {
          let params = {}
          if (typeof index === 'number') {
            params.ids = [thisVue.tableList[index].id]
          } else {
            params.ids = thisVue.selItem
          }
          thisVue.loading = true
          vendorDelete(params).then(dat => {
            let res = dat.data
            thisVue.loading = false
            if (res.status === 'success') {
              thisVue.$message({ message: res.message, type: 'success' })
              thisVue.getTable()
            } else {
              thisVue.$message({ type: 'error', message: res.message })
            }
          }).catch(_ => {
            thisVue.loading = false
          })
        }).catch(() => {
          return false
        })
      },
      closeDialog () {
        thisVue.comDialog = false
        thisVue.getTable()
      },
      showDialog (type, index) {
        thisVue.comDialog = true
        thisVue.dialogType = type
        if (type === 'edit') {
          thisVue.cur_id = thisVue.tableList[index].id
        }
      },
      handleCurrentChange (val) {
        thisVue.pageData.currentPage = val
        thisVue.getTable()
      },
      handleSizeChange (val) {
        thisVue.pageData.currentPage = 1
        thisVue.pageData.pageSize = val
        thisVue.getTable()
      },
      sortTable (column, event) {
        if (column.sortable) {
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
  .list-box{background-color: #fff;padding: 20px;}
</style>
