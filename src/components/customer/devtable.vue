<template>
  <div v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading...">
    <!-- <el-row>
      <ve-histogram :data="chartData" :extend='barOption' :events="chartEvents"></ve-histogram>
    </el-row> -->
    <el-row>
      <el-col class='com-table' :span='24'>
        <el-table :data='tableData' @selection-change="handleSelectionChange" size='small'>
          <el-table-column type="selection" width="55" v-if='isEdit'></el-table-column>
          <el-table-column sortable='true' :label="$t('name')" width='200'>
            <template slot-scope='scope'>
              <router-link :to="{name: 'device_detail', params: {deviceId: scope.row.id}}" class='card-tit'>
                <span class='dev-name' v-if='scope.row.display_name'>{{scope.row.display_name}}</span>
                <el-tooltip effect="dark" v-else :content="scope.row.name" placement="top-start">
                  <span class='dev-name'>{{scope.row.name}}</span>
                </el-tooltip>
              </router-link>
            </template>
          </el-table-column>
          <el-table-column prop='mode.model' :label="$t('model')"></el-table-column>
          <el-table-column prop='mode.type' :label="$t('type')"></el-table-column>
          <el-table-column prop='mode.platform' :label="$t('platform')"></el-table-column>
          <el-table-column prop='mode.vendor' :label="$t('vendor')"></el-table-column>
          <el-table-column :label="$t('status')">
            <template slot-scope='scope'>
              <span class="status-on" type='' size="small" v-if="!scope.row.online">{{ $t('upper_online') }}</span>
              <span class="status-off" type='' size="small" v-if="scope.row.online">{{ $t('upper_offline') }}</span>
            </template>
          </el-table-column>
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
import { getCustomerDev } from '@/api'
let thisVue = null

export default {
  props: ['isEdit', 'customerId'],
  data () {
    let self = this
    this.chartEvents = {
      click: function (e) {
        console.log(e)
        self.getTable()
      }
    }
    return {
      loading: false,
      filter_location: '',
      filter_tag: '',
      filter_platform: '',
      tableData: [],
      selDev: [],
      addDialog: false,
      barOption: {
        color: ['#05b474', '#bf5a5a']
      },
      chartData: {
        columns: ['model', 'online', 'offline'],
        rows: []
      },
      page: {
        size: 10,
        total: 0,
        number: 1
      }
    }
  },
  methods: {
    getTable () {
      let {size, number} = thisVue.page
      let offset = size * (number - 1)
      let limit = size
      thisVue.loading = true
      getCustomerDev({offset, limit, id: thisVue.customerId}).then(dat => {
        let res = dat.data
        thisVue.loading = false
        if (res) {
          thisVue.tableData = res.results
          thisVue.page.total = res.total
        }
      }).catch(_ => {
        thisVue.loading = false
      })
    },
    handleSelectionChange (val) {
      thisVue.selDev = val.map(item => {
        return item.id
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
  .dev-name{text-overflow: ellipsis; overflow: hidden; white-space:nowrap;width: 180px;display: block;}
</style>
