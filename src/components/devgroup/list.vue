<template>
  <div class="dev-group" v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading...">
    <el-row :gutter='20' style='position: relative;'>
      <el-col :span='4' class='group-item'>
        <ul class='group-item-ul'>
          <li><div class='item-tit' :class="{'item-tit-active': isActive == 'all'}" @click="clearFilter">{{ $t('all_my_group') }}</div></li>
          <li v-for='(value, key) in treeData'>
            <div class='item-tit' :class="{'item-tit-active': isActive == key}" @click='toggleStyle(key)'>
              {{value.type | capitalize}}
            </div>
            <transition name='fade'>
              <div v-if='isActive == 0'>
                <template v-for='(item, index) in value.results'>
                  <div class='item-list' :class="{'item-list-active': isListActive == item.id}" @click="handleItemSelect(item.id, item.name)">
                    <el-tooltip effect="dark" :content="item.name" placement="top-start">
                      <span>{{item.name}}</span>
                    </el-tooltip>
                  </div>
                </template>
              </div>
            </transition>
          </li>
        </ul>
      </el-col>
      <el-col :span='20' class="group-con">
        <div class="page-filter">
          <el-input class="common-input" size='small' clearable prefix-icon="el-icon-search" @keyup.enter.native='getDevGroups' v-model='filter_name' :placeholder="$t('filter_by_name')" :disabled="isActive != 'all'"></el-input>
          <el-button class="line-filter"></el-button>
          <div class="btn-group">
            <el-button class="common-btn together-btn" size='small' @click="showDialog({type: 'create', title: $t('create'), width: '40%'})" icon='icon-googleplus5'>{{ $t('create') }}</el-button>
            <el-button class="common-btn together-btn" size='small' icon='icon-trash' :disabled='!canDel' @click='deleteGropu(selGroups)'>{{ $t('delete') }}</el-button>
          </div>
        </div>
        <!-- card show -->
        <div v-if="isCardShow" class='group-card-box' v-loading='cardLoading' element-loading-spinner="el-icon-loading" element-loading-text="chart data loading...">
          <el-card class="group-box-card">
            <div slot="header" class="card-tit-wrap">
              <router-link :to="{name: 'device_group_detail', params: {id: defaultGroup.id}, query: {type: 'default'}}" class='card-tit'>{{defaultGroup.name}}</router-link>
              <div class="action">
                <el-tooltip effect="dark" :content="$t('deploy')" placement="top">
                  <i class="table-btn iconfont icon-deployment" @click="showDialog({type: 'deploy', title: $t('deploy'), val: defaultGroup.id})"></i>
                </el-tooltip>
              </div>
            </div>
            <div class="group-chart">
              <el-col :span='12'>
                <h4>{{ $t('dev_loc_chart') }}</h4>
                <ve-histogram v-if='chartData.rows.length != 0' :data="chartData" :extend='barOption'></ve-histogram>
                <p class='no-data' v-else>
                  <img class="no-data-img" src="../../../static/img/no-data.png" alt="">
                  <span class="no-data-txt">{{ $t('no_data') }}</span>
                </p>
              </el-col>
              <el-col :span='12'>
                <h4>{{ $t('dev_status_chart') }}</h4>
                <ve-pie v-if='posData.rows.length != 0' :data="posData" :extend='pieOption'></ve-pie>
                <p class='no-data' v-else>
                  <img class="no-data-img" src="../../../static/img/no-data.png" alt="">
                  <span class="no-data-txt">{{ $t('no_data') }}</span>
                </p>
              </el-col>
            </div>
          </el-card>
        </div>
        <!-- table -->
        <div v-else class='com-table'>
          <el-table :data='tableData' @selection-change="handleSelectionChange" size='small' @header-click='sortTable'>
            <el-table-column type="selection" width="40"></el-table-column>
            <el-table-column sortable='true' prop='name' :label="$t('name')">
              <template slot-scope='scope'>
                <router-link :to="{name: 'device_group_detail', params: {id: scope.row.id}}">{{scope.row.name}}</router-link>
              </template>
            </el-table-column>
            <el-table-column sortable='true' prop='updated_at' :label="$t('update_time')"></el-table-column>
            <el-table-column sortable='true' prop='created_at' :label="$t('create_time')"></el-table-column>
            <el-table-column :label="$t('action')">
              <template slot-scope='scope'>
                <el-tooltip effect="dark" :content="$t('deploy')" placement="top">
                  <i class="table-btn iconfont icon-deployment" @click="showDialog({type: 'deploy', title: $t('deploy'), val: scope.row.id})"></i>
                </el-tooltip>
                <el-tooltip effect="dark" :content="$t('edit')" placement="top">
                  <i class="table-btn icon-pencil5" @click="showDialog({type: 'edit', title: $t('edit'), val: scope.row, width: '40%'})"></i>
                </el-tooltip>
                <el-tooltip effect="dark" :content="$t('delete')" placement="top">
                  <i class="table-btn icon-trash" @click='deleteGropu(scope.$index, true)'></i>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <!-- page -->
          <div class='common-page'>
            <el-pagination background @current-change="handleCurrentChange"  @size-change="handleSizeChange" :current-page="page.cur_page" :page-sizes="[10, 20, 30, 40]" :page-size="page.size" popper-class='page-pop' layout="total, slot, sizes, prev, pager, next" :total="page.total">
            </el-pagination>
          </div>
        </div>
        <!-- dialog -->
        <el-dialog :visible.sync='comDialog' :title='comTit' :width='dialogWidth'>
          <createGroup @closeDialog='closeDialog' :groupItem='groupItem' v-if="dialogType == 'create' || dialogType == 'edit'"></createGroup>
          <deployGroup @closeDialog='closeDialog' :groupId='groupItem.id' v-if="dialogType == 'deploy'"></deployGroup>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getDevGroupList, groupModelList, groupChartInfo, groupDelete } from '@/api'
import createGroup from './create'
import deployGroup from './deploy'
let thisVue = null

export default {
  components: { createGroup, deployGroup },
  data () {
    return {
      msg: '',
      loading: false,
      cardLoading: false,
      comDialog: false,
      comTit: '',
      isCardShow: false,
      isActive: 'all',
      isListActive: null,
      dialogWidth: '80%',
      dialogType: 'create',
      groupItem: {id: '', name: '', description: ''},
      defaultGroup: {},
      filter_name: '',
      selGroups: [],
      canDel: false,
      order_by: '',
      tableData: [],
      page: {
        cur_page: 1,
        size: 10,
        total: 0
      },
      treeData: [],
      barOption: {
        legend: {padding: [20, 0]},
        label: { show: true, position: 'top' },
        yAxis: { minInterval: 1 },
        xAxis: {
          show: true,
          axisLabel: {
            interval: 0
          }
        },
        barMaxWidth: '30px',
        itemStyle: {barBorderRadius: 3},
        color: ['#4CAF50', '#f56c6c']
      },
      pieOption: {
        legend: {padding: [20, 0]},
        color: ['#4CAF50', '#f56c6c']
      },
      chartData: {
        columns: ['position', 'online', 'offline'],
        rows: []
      },
      posData: {
        columns: ['status', 'number'],
        rows: []
      }
    }
  },
  methods: {
    getDevGroups () {
      thisVue.loading = true
      let limit = thisVue.page.size
      let offset = (thisVue.page.cur_page - 1) * limit
      let params = {limit, offset, order_by: thisVue.order_by, filter_name: thisVue.filter_name}
      getDevGroupList(params).then(dat => {
        let res = dat.data
        thisVue.loading = false
        if (res) {
          thisVue.tableData = res.groups
          thisVue.page.total = res.total
        }
      }).catch(_ => {
        thisVue.loading = false
      })
    },
    getGroupModelList () {
      thisVue.loading = true
      groupModelList().then(dat => {
        let res = dat.data
        thisVue.loading = false
        if (res) {
          thisVue.treeData = res
        }
      }).catch(_ => {
        thisVue.loading = false
      })
    },
    getGroupChart () {
      thisVue.cardLoading = true
      let params = {filter_name: thisVue.defaultGroup.id}
      groupChartInfo(params).then(dat => {
        let res = dat.data
        thisVue.cardLoading = false
        if (res) {
          let status = res.by_status
          let pos = res.by_continent
          let arr = []
          for (let value in pos) {
            let position = value
            let {offline, total, online} = pos[value]
            if (offline) {
              online = total - offline
            }
            if (online) {
              offline = total - online
            }
            arr.push({position, online, offline})
          }
          thisVue.chartData.rows = arr
          thisVue.posData.rows = [
            { 'status': 'online', 'number': status.online },
            { 'status': 'offline', 'number': status.offline }
          ]
        } else {
          thisVue.chartData.rows = []
          thisVue.posData.rows = []
        }
      }).catch(_ => {
        thisVue.cardLoading = false
      })
    },
    deleteGropu (ids, type) {
      if (type) {
        ids = [thisVue.tableData[ids].id]
      }
      thisVue.$confirm(thisVue.$t('del_group_msg'), thisVue.$t('delete'), {type: 'warning'}).then(_ => {
        thisVue.delGroup(ids)
      }).catch(_ => {
        return false
      })
    },
    delGroup (ids) {
      thisVue.loading = true
      groupDelete({group_ids: ids}).then(dat => {
        let res = dat.data
        thisVue.loading = false
        if (res.status === 'success') {
          thisVue.$message({message: thisVue.$t('del_group_success'), type: 'success'})
          thisVue.getDevGroups()
        } else {
          thisVue.$message({message: thisVue.$t('del_group_fail'), type: 'error'})
        }
      }).catch(_ => {
        thisVue.loading = false
      })
    },
    handleCurrentChange (val) {
      thisVue.cur_page = val
      thisVue.getDevGroups()
    },
    handleSizeChange (val) {
      thisVue.page_size = val
      thisVue.getDevGroups()
    },
    handleItemSelect (id, name) {
      thisVue.isListActive = id
      thisVue.isCardShow = true
      thisVue.defaultGroup = {id, name}
      thisVue.getGroupChart()
    },
    toggleStyle (val) {
      thisVue.isActive = val
    },
    handleSelectionChange (val) {
      if (val.length > 0) {
        thisVue.canDel = true
      } else {
        thisVue.canDel = false
      }
      thisVue.selGroups = val.map(item => {
        return item.id
      })
    },
    clearFilter () {
      thisVue.isActive = 'all'
      thisVue.isListActive = null
      thisVue.filter_name = ''
      thisVue.isCardShow = false
      thisVue.getDevGroups()
    },
    showDialog ({type, title, val, width}) {
      thisVue.comDialog = true
      thisVue.comTit = title
      thisVue.dialogType = type
      if (width) {
        thisVue.dialogWidth = width
      } else {
        thisVue.dialogWidth = '80%'
      }
      if (type === 'edit') {
        let {id, name, description} = val
        thisVue.groupItem = {id, name, description}
      } else if (type === 'deploy') {
        thisVue.groupItem = {id: val}
      } else {
        thisVue.groupItem = {id: '', name: '', description: ''}
      }
    },
    closeDialog () {
      thisVue.comDialog = false
      thisVue.filter_name = ''
      thisVue.getDevGroups()
    },
    sortTable (column, event) {
      if (column.order === 'descending') {
        thisVue.order_by = `-${column.property}`
      } else {
        thisVue.order_by = `+${column.property}`
      }
      if (column.sortable) {
        thisVue.getDevGroups()
      }
    }
  },
  filters: {
    capitalize (val) {
      if (!val) return ''
      val = val.toString()
      return thisVue.$t(val)
    }
  },
  mounted () {
    thisVue = this
    thisVue.getDevGroups()
    thisVue.getGroupModelList()
  }
}
</script>
<style scoped>
  .group-item{height: auto;height: 620px;
    margin: -23px 0 -22px -10px;
    padding: 15px 10px;overflow: hidden;background: #f1f4f7;border-radius: 3px;
    -webkit-box-shadow: 0px 2px 5px 0px rgba(237,237,237,1);
    box-shadow: 0px 2px 5px 0px rgba(237,237,237,1);
    -webkit-box-shadow: 0px 0px 0px 1px rgba(156, 165, 173,0.2);
    box-shadow: 0px 0px 0px 1px rgba(156, 165, 173,0.2);}
  .group-con{height: auto;padding-left: 20px;padding-right: 0px;}
  .no-data{ text-align:center; font-size: 20px;font-weight: bold;color: #d4d5d6;}
  .no-data-txt{ display: block;margin: 17px 0 86px;line-height: 20px;font-size: 18px;color: #d4d9e0;}
  .no-data-img{ width:142px;margin:12px 0 -35px;}
  .list-tit{font-size: 14px;background-color: #f0f0f0;color: #444;line-height: 30px;padding-left: 10px;font-weight: 500;margin-bottom: 10px;}
  .search-input{width: 240px;margin-right: 10px;}
  .group-opr{margin-bottom: 20px;}
  .card-tit-wrap{ overflow: hidden;}
  .card-tit-wrap .action{ float: right;margin-top:9px;.cursor: pointer;}
  .card-tit-wrap .action i:hover{ color:#5ca3e2;}
  .el-card{box-shadow: none;border-color: #e6ecef;border-radius: 0px;margin-bottom: 10px;}
  .el-checkbox{margin: 0px;}
  .card-tit{color: #3090e4;padding-left: 10px;line-height: 40px;font-size: 14px;}
  .card-tit:hover{ color:#35a1ff;text-decoration: underline;}
  .btn-red{color: #a54747;}
  .group-card-box{margin-bottom: 20px;}
  .group-item-ul{padding: 0px; margin: 0px;overflow: auto;height: 100%;}
  .group-item-ul li{ list-style: none; }
  .item-tit{margin-bottom:8px;padding-left: 10px; line-height: 32px; font-size: 14px; color: #245682;cursor: pointer;border-radius: 3px;}
  .item-list{padding: 0px 10px; line-height: 30px; font-size: 14px; cursor: pointer; width: 100%; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;}
  .item-tit:hover{ background:#ebedf0;}
  .item-tit-active{ background-color: #245682;color:#fff;}
  .item-tit-active:hover{ background-color: #245682;color:#fff;}
  .fade-enter-active/*, .fade-leave-active*/ {
    transition: opacity .5s;
  }
  .fade-enter/*, .fade-leave-to*/ /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  .item-list{ color:#6d757b;}
  .item-list:hover{ color:#245682;}
  .item-list-active{ color: #245682;font-weight: bold;}
  .item-list-active:hover{ color:#245682;}
  .el-button.line-filter{ height: 30px;
    width: 1px;
    background: #dcdfe6;
    cursor: auto;
    display: inline-block;
    padding-right: 0;
    padding-left: 0;
    border: 0;}
  .el-button.line-filter:hover, .line-filter:active, .line-filter:visited { color: #fff;
    border-color: #fff;
    background-color: #dcdfe6;}
  .el-button-group .el-button{ height:32px;}
  .btn-filter-refresh{ padding-bottom:7px;}
  .el-button.btn-filter-refresh{ float:right;color: #333;padding: 4px 3px 2px 4px;margin: 0;border:0;}
  .el-button.btn-filter-refresh:hover{ background: #f2f2f2;}
  .el-button.btn-filter-refresh .text-size-base{ font-size:16px;}
  .el-button.btn-filter-refresh:focus{ background-color:#fff;}
  .group-chart{ }
  .group-chart h4{ margin: 20px 0 25px; text-align: center;color: #245682;}
  .el-button-group i.icon-deployment{font-size: 18px !important;}
</style>
<style>
  .group-box-card .el-card__header{padding: 0px 10px !important;background-color: #f1f4f7;}
  .el-dialog__body{padding-top: 0px;}
</style>
