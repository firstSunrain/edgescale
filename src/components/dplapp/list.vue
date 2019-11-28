<template>
  <div class="dpl-box" v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading...">
    <el-row :gutter='20'>
      <el-col :span='24' style='position: relative;margin-bottom: 10px;'>
        <div class='frame-banner'>
          <div class='dash-item dash-item1' :class="{'active': activeName=='latest'}" @click="tabChange('latest')" style="z-index: 4;"><span>{{ $t('latest_deploy') }}</span></div>
          <div class='dash-item dash-item2' :class="{'active': activeName=='history'}" @click="tabChange('history')" style="z-index: 3;"><span>{{ $t('history_deploy') }}</span></div>
        </div>
        <div class='page-filter'>
          <el-input suffix-icon='el-icon-search' size='small' v-model='filter_name' class='common-input common-input-filter' @keyup.13.native='getTable' :placeholder="$t('filter_by_name')" clearable></el-input>
          <el-input suffix-icon='el-icon-search' size='small' v-model='filter_dev' class='common-input common-input-filter' @keyup.13.native='getTable' :placeholder="$t('filter_by_dev')" clearable></el-input>
          <!-- location -->
          <el-select class="common-input" size='small' @change='getTable' v-model="filter_status" filterable clearable :placeholder="$t(`filter_by_status`)">
            <el-option label="pending" value="pending"></el-option>
            <el-option label="waiting" value="waiting"></el-option>
            <el-option label="running" value="running"></el-option>
          </el-select>
        </div>
      </el-col>
      <el-col :span='24' style='padding: 0px;' v-if="activeName == 'latest'">
        <el-col :span='12'>
          <!-- <el-divider><span class='divider-w'>Task Information</span></el-divider> -->
          <ul class='task-detail'>
            <li class='task-box'>
              <span class='card-tit'>Task ID</span>
              <span class='card-div'>{{ taskInfo.taskId }}</span>
            </li>
            <li class='task-box'>
              <span class='card-tit'>Create Time</span>
              <span class='card-div'>{{ taskInfo.create_time }}</span>
            </li>
            <li class='task-box'>
              <span class='card-tit'>Status</span>
              <span class='card-div'>{{ taskInfo.status }}</span>
            </li>
            <li class='task-box'>
              <span class='card-tit'>Type</span>
              <span class='card-div'>{{ taskInfo.type }}</span>
            </li>
            <li class='task-box' v-if="taskInfo.type == 'deploy_app'">
              <span class='card-tit'>App Name</span>
              <span class='card-div'><router-link :to="{ name: 'software_app_detail', params: { appId: taskInfo.appId, appPermission: 'my' }}">{{ taskInfo.appId }}</router-link></span>
            </li>
            <li class='task-box'>
              <span class='card-tit'>Version</span>
              <span class='card-div'>{{ taskInfo.version }}</span>
            </li>
          </ul>
        </el-col>
        <el-col :span='12'>
          <template  v-for='(item, key) in status_all'>
            <el-col :span='8' :key='key'>
              <div class='stat-card' :style='`border-top: 2px solid ${item.color};`'>
                <h1><i :class='item.icon'></i>{{item.number}}</h1>
                <p>{{item.name}}</p>
              </div>
            </el-col>
          </template>
        </el-col>
      </el-col>
      <el-col :span='24' class='com-table'>
        <el-table :data='tableData' size='small' @header-click='sortTable'>
          <el-table-column :label="$t('name')">
            <template slot-scope='scope'>
              <router-link :to="{name: 'app_deploy_detail', params: {id: scope.row.id}}">
                <span v-if='scope.row.app_name'>{{scope.row.app_name}}</span>
                <span v-else>{{scope.row.solution_name}}</span>
              </router-link>
            </template>
          </el-table-column>
          <el-table-column :label="$t('type')">
            <template slot-scope='scope'>
              <span>app</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('device_name')">
            <template slot-scope='scope'>
              <router-link :to="{name: 'device_detail', params: {deviceId: scope.row.device_id}}">
                <span v-if='scope.row.display_name'>{{scope.row.display_name}}</span>
                <span v-else>{{scope.row.device_name}}</span>
              </router-link>
            </template>
          </el-table-column>
          <el-table-column :label="$t('status')">
            <template slot-scope='scope'>
              <span class="status-private" v-if="scope.row.status === 'waiting'">{{ scope.row.status | capitalize }}</span>
              <span class="status-private" v-else-if="scope.row.status === 'pending'">{{ scope.row.status | capitalize }}</span>
              <span class="status-on" v-else-if="scope.row.status === 'running'">{{ scope.row.status | capitalize }}</span>
              <span class="status-retired" v-else>{{scope.row.status | capitalize}}</span>
            </template>
          </el-table-column>
          <el-table-column sortable='true' prop='create_time' width='180' :label="$t('create_time')"></el-table-column>
          <el-table-column :label="$t('action')" width='100'>
            <template slot-scope='scope'>
              <el-tooltip class="item" effect="dark" :content="$t('stop')" placement="top">
                <i class="table-btn icon-pause" @click="deployAction('stop', scope.$index)"></i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="$t('start')" placement="top">
                <i class="table-btn icon-play3" @click="deployAction('start', scope.$index)"></i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="$t('delete')" placement="top">
                <i class="table-btn icon-trash" @click="deployAction('delete', scope.$index)"></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <div class='common-page'>
          <el-pagination background @current-change="handleCurrentChange"  @size-change="handleSizeChange" :current-page="page.number" :page-sizes="[10, 20, 30, 40]" :page-size="page.size" popper-class='page-pop' layout="total, slot, sizes, prev, pager, next" :total="page.total">
          </el-pagination>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getAllDeployment, deploymentAction, getTaskLatest } from '@/api'
let thisVue = null

export default {
  data () {
    return {
      loading: true,
      filter_status: '',
      filter_name: '',
      filter_dev: '',
      filter_taskid: '',
      tableData: [],
      activeName: 'latest',
      taskInfo: {},
      orderBy: '',
      orderType: '',
      page: {
        size: 10,
        total: 0,
        number: 1
      },
      form: {
        name: '',
        description: '',
        id: ''
      },
      rules: {
        name: [{required: true, trigger: 'blur', message: this.$t('rule_name_require')}]
      },
      status_all: [
        {name: 'Pending', color: '#b3841c', icon: 'el-icon-share', number: 12},
        {name: 'Creating', color: '#b3841c', icon: 'el-icon-help', number: 8},
        {name: 'Running', color: '#189471', icon: 'el-icon-refresh', number: 6},
        {name: 'Stopped', color: '#85930d', icon: 'el-icon-video-pause', number: 9},
        {name: 'Failed', color: '#85930d', icon: 'el-icon-warning-outline', number: 2},
        {name: 'Deleted', color: '#b94848', icon: 'el-icon-circle-close', number: 1}
      ]
    }
  },
  filters: {
    capitalize (val) {
      if (!val) return ''
      val = val.toString().toLowerCase()
      return thisVue.$t(val)
    },
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
      let orderBy = thisVue.orderBy
      let orderType = thisVue.orderType
      let params = {limit, offset, filter_status: thisVue.filter_status, filter_taskid: thisVue.filter_taskid, filter_dev: thisVue.filter_dev, filter_name: thisVue.filter_name, orderBy, orderType}
      getAllDeployment(params).then(dat => {
        let res = dat.data
        thisVue.loading = false
        thisVue.tableData = res.list
        thisVue.page.total = res.total
      }).catch(_ => {
        thisVue.loading = false
      })
    },
    taskLatest () {
      thisVue.loading = true
      getTaskLatest().then(dat => {
        let res = dat.data
        thisVue.loading = false
        thisVue.filter_taskid = res.id
        thisVue.getTable()
        for (let i in res.statistics.data) {
          for (let j of thisVue.status_all) {
            if (j.name === i) {
              j.number = res.statistics.data[i]
            }
          }
        }
        if (res.type === 'deploy_app') {
          thisVue.taskInfo = {type: res.type, create_time: res.create_time, taskId: res.id, status: res.status, version: res.payload[0].version, appId: res.payload[0].application_id}
        }
      }).catch(_ => {
        thisVue.loading = false
      })
    },
    tabChange (type) {
      thisVue.activeName = type
      thisVue.filter_taskid = ''
      if (type === 'latest') {
        thisVue.taskLatest()
      } else {
        thisVue.getTable()
      }
    },
    deployAction (type, index) {
      let id = thisVue.tableData[index].id
      thisVue.$confirm(thisVue.$t('want_to_continue'), thisVue.$t(type), {type: 'warning'}).then(_ => {
        thisVue.loading = true
        deploymentAction({action: type, id}).then(dat => {
          let res = dat.data
          thisVue.loading = false
          if (res.status === 'success') {
            thisVue.$message({message: thisVue.$t('del_success'), type: 'success'})
            if (thisVue.activeName === 'latest') {
              thisVue.taskLatest()
            } else {
              thisVue.getTable()
            }
          } else {
            thisVue.$message({message: thisVue.$t('operation_fail'), type: 'error'})
          }
        }).catch(_ => {
          thisVue.loading = false
        })
      }).catch(_ => {
        return false
      })
    },
    handleSelectionChange (val) {
      thisVue.deployDevIds.push(val.id)
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
    thisVue.taskLatest()
  }
}
</script>
<style scoped>
.opr-box{margin-top: 20px;}
.common-page{padding-bottom: 20px;}
.divider-w{color: #a5a0a0;font-weight: normal;}
.page-filter{position: absolute;right: 10px;padding: 0px;width: auto;top: 18px;}
.stat-card{border: 1px solid #e8e8e8;border-radius: 5px 5px 0px 0px;text-align: center;margin-bottom: 10px;}
.stat-card h1{font-size: 50px;margin: 20px 0px 0px 0px;line-height: 40px;}
.stat-card h1 i{font-size: 36px;padding-right: 5px;}
.stat-card p{font-weight: bold;}
.card-div{padding: 2px 10px;}
.card-tit{font-weight: bold;padding: 3px 10px;display: inline-block;width: 100px;text-align: right;}
.task-box{padding: 0px !important;list-style: none;}
.task-detail{border: 1px solid #e8e8e8;padding: 20px 0px;border-top: 2px solid #85930d;border-radius: 5px 5px 0px 0px;}
</style>