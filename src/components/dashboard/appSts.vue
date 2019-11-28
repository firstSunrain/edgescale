<template>
  <div class="appSts" v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading...">
    <el-row>
      <el-col :span='24' class="group-con">
        <!-- card show -->
        <div class="group-chart" v-if='pieData.rows.length != 0'>
          <el-col :span='24'>
            <h4 style='text-align: center;margin-bottom: 20px;'>{{ $t('dash_app_chart_tit') }}</h4>
            <el-col :span='12'><ve-pie :data="pieData" :events='chartEvents'></ve-pie></el-col>
            <el-col :span='12'><ve-histogram :data="pieData" :extend='barOption' :events='chartEvents'></ve-histogram></el-col>
          </el-col>
        </div>
        <!-- table -->
        <div class='com-table'>
          <el-col :span='24' class='opr-box'>
            <el-input class='common-input search-input' suffix-icon='el-icon-search' @keyup.13.native='getTable' clearable size='small' v-model='filter_text' :placeholder="$t('filter_by_name')"></el-input>
          </el-col>
          <el-table :data='tableData' size='small'>
            <el-table-column :label="$t('name')">
              <template slot-scope='scope'>
                <router-link :to="{name: 'device_detail', params: {deviceId: scope.row.id}}" class='table-id'>
                  <span v-if='scope.row.display_name' class='con-wrap'>{{scope.row.display_name}}</span>
                  <span v-else class='con-wrap'>{{scope.row.name}}</span>
                </router-link>
              </template>
            </el-table-column>
            <el-table-column prop='mode.model' :label="$t('model')"></el-table-column>
            <el-table-column prop='mode.type' :label="$t('type')"></el-table-column>
            <el-table-column prop='mode.platform' :label="$t('platform')"></el-table-column>
            <el-table-column prop='mode.vendor' :label="$t('vendor')"></el-table-column>
            <el-table-column sortable='true' prop='created_at' :label="$t('create_time')" width='200'></el-table-column>
          </el-table>
        </div>
        <!-- page -->
        <div class='common-page'>
          <el-pagination background @current-change="handleCurrentChange"  @size-change="handleSizeChange" :current-page="page.cur_page" :page-sizes="[10, 20, 30, 40]" :page-size="page.size" popper-class='page-pop' layout="total, slot, sizes, prev, pager, next" :total="page.total">
          </el-pagination>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { appDeployStat } from '@/api'
let thisVue = null

export default {
  data () {
    this.chartEvents = {
      click: function (e) {
        thisVue.curApp = e.name
        thisVue.getTable()
      }
    }
    return {
      loading: false,
      filter_text: '',
      order_by: '',
      curApp: '',
      tableData: [],
      page: {
        cur_page: 1,
        size: 10,
        total: 0
      },
      barOption: {
        barMaxWidth: '30px',
        itemStyle: {barBorderRadius: 3},
        label: { show: true, position: 'top' },
        yAxis: { minInterval: 1 },
        xAxis: {
          axisLabel: {
            interval: 0,
            rotate: 30
          }
        }
      },
      pieData: {
        columns: ['name', 'count'],
        rows: []
      }
    }
  },
  methods: {
    getTable () {
      thisVue.loading = true
      let limit = thisVue.page.size
      let offset = (thisVue.page.cur_page - 1) * limit
      let appname = thisVue.curApp
      let device = thisVue.filter_text
      let params = {limit, offset, appname, device}
      appDeployStat(params).then(dat => {
        let res = dat.data
        thisVue.loading = false
        if (res.length > 0) {
          thisVue.tableData = res[0].items
          thisVue.page.total = res[0].total
        } else {
          thisVue.tableData = []
          thisVue.page.total = 0
        }
      }).catch(_ => {
        thisVue.loading = false
      })
    },
    getStatistics () {
      thisVue.loading = true
      appDeployStat().then(dat => {
        let res = dat.data
        thisVue.loading = false
        thisVue.pieData.rows = res.map(item => {
          let params = {name: item.name, count: item.total}
          return params
        })
      }).catch(_ => {
        thisVue.loading = false
      })
    },
    handleCurrentChange (val) {
      thisVue.page.cur_page = val
      thisVue.getTable()
    },
    handleSizeChange (val) {
      thisVue.page.size = val
      thisVue.getTable()
    },
    sortTable (column, event) {
      if (column.order === 'descending') {
        thisVue.order_by = `-${column.property}`
      } else {
        thisVue.order_by = `+${column.property}`
      }
      if (column.sortable) {
        thisVue.getTable()
      }
    }
  },
  mounted () {
    thisVue = this
    thisVue.getStatistics()
  }
}
</script>
<style scoped>
</style>
