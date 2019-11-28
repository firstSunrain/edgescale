<template>
  <div class="dev-group" v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading...">
    <el-row>
      <el-col :span='24'>
        <el-col :span='12' class='opr-box'>
          <div style='font-size: 2rem;vertical-align: middel;'>{{groupName}}</div>
        </el-col>
        <el-col :span='12'>
          <div style='float: right;' v-if="groupType != 'default'">
            <el-button class="common-btn together-btn" size='small' icon='icon-plus3' @click="comDialog = true">{{ $t('add') }}</el-button>
            <el-button class="common-btn together-btn" size='small' type='' @click='removeDev' icon='icon-bin' :disabled='isDisabled'>{{ $t('remove') }}</el-button>
          </div>
        </el-col>
      </el-col>
      <el-col class='com-table' :span='24'>
        <el-table :data='tableData' @selection-change="handleSelectionChange" size='small'>
          <el-table-column type="selection" width="55" v-if="groupType != 'default'"></el-table-column>
          <el-table-column :label="$t('name')" width='200'>
            <template slot-scope='scope'>
              <router-link :to="{name: 'device_detail', params: {deviceId: scope.row.id}}" class='card-tit'>
                <span class='dev-name' v-if='scope.row.display_name'>{{scope.row.display_name}}</span>
                <el-tooltip effect="dark" v-else :content="scope.row.name" placement="top-start">
                  <span class='dev-name'>{{scope.row.name}}</span>
                </el-tooltip>
              </router-link>
            </template>
          </el-table-column>
          <el-table-column prop='model.model' :label="$t('model')"></el-table-column>
          <el-table-column prop='model.type' :label="$t('type')"></el-table-column>
          <el-table-column prop='model.platform' :label="$t('platform')"></el-table-column>
          <el-table-column prop='model.vendor' :label="$t('vendor')"></el-table-column>
          <el-table-column prop='customer' :label="$t('customer')"></el-table-column>
          <el-table-column sortable='true' prop='created_at' :label="$t('create_time')" width='160'></el-table-column>
          <el-table-column sortable='true' :label="$t('status')">
            <template slot-scope='scope'>
              <span class="status-on" type='' size="mini" v-if="scope.row.status == 'offline'">{{ $t('upper_offline') }}</span>
              <span class="status-off" type='' size="mini" v-if="scope.row.status == 'online'">{{ $t('upper_online') }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span='24' class='common-page'>
        <el-pagination background @current-change="handleCurrentChange"  @size-change="handleSizeChange" :current-page="page.number" :page-sizes="[10, 20, 30, 40]" :page-size="page.size" popper-class='page-pop' layout="total, slot, sizes, prev, pager, next" :total="page.total">
        </el-pagination>
      </el-col>
    </el-row>
    <!-- dialog -->
    <el-dialog :visible.sync='comDialog' :title="$t('add_device_to_group')" width='90%' :close-on-click-modal='false'>
      <deviceTable :groupId='groupId' @closeDialog='closeDialog'></deviceTable>
    </el-dialog>
  </div>
</template>

<script>
import { devGroupInfo, removeDevFromGroup } from '@/api'
import deviceTable from './table'
let thisVue = null

export default {
  components: {deviceTable},
  data () {
    return {
      loading: true,
      conditions: {},
      groupType: '',
      groupName: '',
      filter_name: '',
      comDialog: false,
      isDisabled: true,
      selDev: [],
      groupId: '',
      tableData: [],
      page: {
        size: 10,
        total: 0,
        number: 1
      }
    }
  },
  methods: {
    getGroupInfo () {
      let {size, number} = thisVue.page
      let offset = size * (number - 1)
      let limit = size
      thisVue.loading = true
      let params = {limit, offset, filter_name: thisVue.filter_name, id: thisVue.groupId}
      devGroupInfo(params).then(dat => {
        let res = dat.data
        thisVue.loading = false
        if (res) {
          thisVue.tableData = res.devices
          thisVue.page.total = res.device.total
          thisVue.groupName = res.name
        }
      }).catch(_ => {
        thisVue.loading = false
      })
    },
    removeDev () {
      thisVue.$confirm(thisVue.$t('remove_dev_from_group_tip'), thisVue.$t('remove'), {type: 'error', closeOnClickModal: false}).then(_ => {
        let params = {devices: thisVue.selDev}
        removeDevFromGroup(thisVue.groupId, params).then(dat => {
          let res = dat.data
          thisVue.loading = false
          if (thisVue.status === 'fail') {
            thisVue.$message({type: 'error', message: thisVue.$t('remove_from_group_fail')})
          } else {
            thisVue.$message({type: res.status, message: thisVue.$t('remove_from_group_success')})
            thisVue.getGroupInfo()
          }
        }).catch(_ => {
          thisVue.loading = false
        })
      }).catch(_ => {
        return false
      })
    },
    getConditions (data) {
      thisVue.condtions = data
    },
    closeDialog () {
      thisVue.comDialog = false
      thisVue.getGroupInfo()
    },
    handleSelectionChange (val) {
      if (val.length > 0) {
        thisVue.isDisabled = false
      } else {
        thisVue.isDisabled = true
      }
      thisVue.selDev = val.map(item => {
        return item.id
      })
    },
    handleCurrentChange (val) {
      thisVue.page.number = val
      thisVue.getGroupInfo()
    },
    handleSizeChange (val) {
      thisVue.page.size = val
      thisVue.getGroupInfo()
    }
  },
  mounted () {
    thisVue = this
    thisVue.groupId = thisVue.$route.params.id
    thisVue.groupType = thisVue.$route.query.type
    thisVue.getGroupInfo()
  }
}
</script>
<style scoped>
  .mr10{ margin-right:10px;}
  .ml10{ margin-left:10px;}
  .fl{ float: left;}
  .line-filter.mr10{margin-right:10px; }
  .search-input{width: 240px;margin-right: 10px;float:left;}
  .dev-name{text-overflow: ellipsis; overflow: hidden; white-space:nowrap;width: 180px;display: block;}
  .el-button.line-filter{
    height: 30px;
    width: 1px;
    background: #dcdfe6;
    cursor: auto;
    display: inline-block;
    padding-right: 0;
    padding-left: 0;
    border: 0;}
  .el-button.line-filter:hover, .el-button.line-filter:active, .el-button.line-filter:visited { color: #fff;
    border-color: #fff;
    background-color: #dcdfe6;}
  .el-button.line-filter.mr10{ margin:1px 10px 17px 10px;}
  .filter-container{ float:left;}
  .el-button-group{ float:left;    margin-top: -1px;}
  .el-select{ float:left;margin-right:4px;}
  .el-buttom{ float:left;}
  .opr-box{margin-bottom: 20px;}
</style>
