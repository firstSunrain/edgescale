<template>
  <div v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading...">
    <el-row>
      <el-col class='com-table' :span='24'>
        <el-table :data='tableData' size='small'>
          <el-table-column prop='display_name' :label="$t('name')">
            <template slot-scope='scope'>
              <router-link :to="{name: 'device_detail', params: {deviceId: scope.row.id}}">
                <span v-if='scope.row.display_name' class='con-wrap'>{{scope.row.display_name}}</span>
                <span v-else class='con-wrap'>{{scope.row.name}}</span>
              </router-link>
            </template>
          </el-table-column>
          <el-table-column prop='model.model' :label="$t('model')"></el-table-column>
          <el-table-column prop='model.type' :label="$t('type')"></el-table-column>
          <el-table-column prop='model.platform' :label="$t('platform')"></el-table-column>
          <el-table-column prop='model.vendor' :label="$t('vendor')"></el-table-column>
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
import { devGroupInfo } from '@/api'
let thisVue = null

export default {
  props: ['groupId', 'devices'],
  data () {
    return {
      loading: false,
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
  methods: {
    getTable () {
      let {size, number} = thisVue.page
      let offset = size * (number - 1)
      let limit = size
      let params = {limit, offset, id: thisVue.groupId}
      thisVue.loading = true
      devGroupInfo(params).then(dat => {
        let res = dat.data
        thisVue.loading = false
        thisVue.tableData = res.devices
        thisVue.page.total = res.device.total
      }).catch(_ => {
        thisVue.loading = false
      })
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
    if (thisVue.groupId) {
      thisVue.getTable()
    }
  },
  watch: {
    groupId (newVal, oldVal) {
      thisVue.getTable()
    },
    devices (newVal, oldVal) {
      thisVue.tableData = newVal
      thisVue.page.total = newVal.length
    }
  }
}
</script>
<style scoped>
  .opr-box{padding-bottom: 15px;}
</style>
