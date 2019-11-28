<template>
  <div class="fuse-box" v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading...">
    <el-row>
      <el-col :span='24' class=''>
        <el-col :span='22' class='filter-box'>
          <el-input suffix-icon='el-icon-search' size='small' v-model='filter_text' class='common-input common-input-filter' @keyup.13.native='getTable' :placeholder="$t('filter_by_name')"></el-input>
          <el-button class="common-btn" size='small' @click="$router.push({name: 'fuse_create'})">
            <i class="icon-googleplus5"></i>
            <span>{{ $t('create') }}</span>
          </el-button>
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
          <el-table-column :label="$t('name')">
            <template slot-scope='scope'>
              <router-link :to="{name: 'fuse_detail', params: {id: scope.row.id}}">{{scope.row.name}}</router-link>
            </template>
          </el-table-column>
          <el-table-column prop='key_pair' :label="$t('key_pair')"></el-table-column>
          <el-table-column prop='create_time' sortable='true' :label="$t('create_time')" width='160'>
            <template slot-scope='scope'>
              <span>{{scope.row.create_time | dateFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column prop='update_time' sortable='true' :label="$t('update_time')" width='160'>
            <template slot-scope='scope'>
              <span>{{scope.row.update_time | dateFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('action')" width='100'>
            <template slot-scope='scope'>
              <el-tooltip class="item" effect="dark" :content="$t('delete')" placement="top">
                <i class="table-btn icon-trash" @click="del(scope.row.id)"></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <modelBlock :list='tableData' @delCustomer='del' v-else></modelBlock>
      </el-col>
      <el-col :span='24' class='page-bar common-page'>
        <el-pagination background @current-change="handleCurrentChange"  @size-change="handleSizeChange" :current-page="page.number" :page-sizes="[10, 20, 30, 40]" :page-size="page.size" popper-class='page-pop' layout="total, slot, sizes, prev, pager, next" :total="page.total">
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getFuseList, fuseDelete } from '@/api'
import modelBlock from './block'
let thisVue = null

export default {
  data () {
    return {
      loading: true,
      filter_text: '',
      tableData: [],
      page_list: true,
      orderBy: '',
      orderType: '',
      page: {
        size: 10,
        total: 0,
        number: 1
      }
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
      let params = {limit, offset, orderType: thisVue.orderType, orderBy: thisVue.orderBy, filter_text: thisVue.filter_text}
      getFuseList(params).then(dat => {
        let res = dat.data
        thisVue.loading = false
        thisVue.tableData = res.list
        thisVue.page.total = res.total
      }).catch(_ => {
        thisVue.loading = false
      })
    },
    del (id) {
      thisVue.$confirm(thisVue.$t('want_to_continue'), thisVue.$t('delete'), {type: 'warning'}).then(_ => {
        thisVue.loading = true
        fuseDelete(id).then(dat => {
          let res = dat.data
          thisVue.loading = false
          if (res.status === 'success') {
            thisVue.$message({message: thisVue.$t('operation_success'), type: 'success'})
            thisVue.getTable()
          } else {
            thisVue.$message({message: thisVue.$t('operation_error'), type: 'error'})
            thisVue.dialogVisible = false
          }
        }).catch(_ => {
          thisVue.loading = false
        })
      }).catch(_ => {
        return false
      })
    },
    handleCurrentChange (val) {
      thisVue.page.number = val
      thisVue.getTable()
    },
    handleSizeChange (val) {
      thisVue.page.size = val
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
  },
  components: { modelBlock }
}
</script>
<style scoped>
  .opr-box{padding-bottom: 15px;}
  .el-select{width: 100%;}
  .filter-box .el-input{vertical-align: middle;}
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
