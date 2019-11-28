<template>
  <div v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading...">
    <el-row>
      <el-col class='com-table' :span='24'>
        <el-table :data='tableData' size='small'>
          <el-table-column sortable='true' :label="$t('name')" width='300px'>
            <template slot-scope='scope'>
              <span class='con-wrap'>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column sortable='true' prop='mode.model' :label="$t('model')"></el-table-column>
          <el-table-column sortable='true' prop='mode.type' :label="$t('type')"></el-table-column>
          <el-table-column sortable='true' prop='mode.platform' :label="$t('platform')"></el-table-column>
          <el-table-column sortable='true' prop='mode.vendor' :label="$t('vendor')"></el-table-column>
          <el-table-column sortable='true' :label="$t('create_time')" width='180'>
            <template slot-scope='scope'>
              {{scope.row.created_at | dateFormat}}
            </template>
          </el-table-column>
          <!-- <el-table-column sortable='true' prop='created_at' label='Last Report Time' width='180'></el-table-column>
          <el-table-column sortable='true' label='Status'>
            <template slot-scope='scope'>
              <el-button type='danger' size="mini" v-if="scope.row.status == 'offline'">OFFLINE</el-button>
              <el-button type='success' size="mini" v-if="scope.row.status == 'online'">ONLINE</el-button>
            </template>
          </el-table-column> -->
        </el-table>
      </el-col>
      <el-col :span='24' class='common-page'>
        <el-pagination background @current-change="handleCurrentChange"  @size-change="handleSizeChange" :current-page="page.number" :page-sizes="[10, 20, 30, 40]" :page-size="page.size" popper-class='page-pop' layout="total, slot, sizes, prev, pager, next" :total="page.total">
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getMftDevs } from '@/api'
let thisVue = null

export default {
  props: ['mftId'],
  data () {
    return {
      loading: false,
      filter_location: '',
      filter_tag: '',
      filter_platform: '',
      tableData: [],
      selDev: [],
      addDialog: false,
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
      let {size, number} = thisVue.page
      let offset = size * (number - 1)
      let limit = size
      thisVue.loading = true
      getMftDevs(thisVue.mftId, {limit, offset}).then(dat => {
        let res = dat.data
        thisVue.loading = false
        thisVue.tableData = res.results
        thisVue.page.total = res.total
      }).catch(_ => {
        thisVue.loading = false
      })
    },
    handleCurrentChange (val) {
      thisVue.cur_page = val
      thisVue.getTable()
    },
    handleSizeChange (val) {
      thisVue.page_size = val
      thisVue.getTable()
    },
    closeDialog () {
      thisVue.addDialog = false
    }
  },
  mounted () {
    thisVue = this
    thisVue.getTable()
  }
}
</script>
<style scoped>
  .opr-box{padding-bottom: 15px;}
</style>
