<template>
  <div name="list" class='app-list detail-box' v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="Loading....">
    <el-row v-if="taskData && Object.keys(taskData).length">
      <div class="media stack-media-on-mobile text-left opr-box-container">
      <el-col :span='24' class='opr-box'>
        <el-col :span='18'>
          <div style='font-size: 2rem;vertical-align: middel;'>{{taskData.id}}</div>
        </el-col>
        <el-col :span='6' style='text-align:right;'>
          <el-button class="common-btn" plain size="small" @click="getTaskDetail(taskId)"><i class="icon-rotate-cw3"></i> {{ $t('refresh') }}</el-button>
        </el-col>
      </el-col>
      </div>

      <el-col :span='24' class='basic-box'>
        <el-collapse v-model='activeNames'>
          <!-- basic -->
          <el-collapse-item name='1'>
            <template slot='title'>
              <span class='collapse-tit'>{{ $t('basic_info') }}</span>
            </template>
            <ul>
              <li>
                <label style='font-size: 15px;'>
                  <i class='icon-diamond4 info-icon' style='color: #06bcbf;font-size: 10px;'></i>
                  <span style='padding: 0px 6px;font-weight: bold;'>{{ $t('type') }} :</span>
                  <span style='color: #444;'>{{taskData.type | capitalize}}</span>
                </label>
              </li>
              <li>
                <label style='font-size: 15px;'>
                  <i class='icon-diamond4 info-icon' style='color: #06bcbf;font-size: 10px;'></i>
                  <span style='padding: 0px 6px;font-weight: bold;'>{{ $t('create_time') }} :</span>
                  <span style='color: #444;'>{{taskData.create_time}}</span>
                </label>
              </li>
              <li v-if="taskData.type ==='deploy_app'">
                <i class='icon-diamond4 info-icon' style='color: #06bcbf;font-size: 10px;'></i>
                  <span style='padding: 0px 6px;font-weight: bold;'>{{ $t('status') }} :</span>
                  <router-link class="status-link-to" :to="{ name: 'software_app_deploy_status_list'}">
                    <span v-if="taskData.status=='Created'">
                      <span class="status-private">{{taskData.status | capitalize}} &gt;&gt;</span>
                    </span>
                    <span v-if="taskData.status=='Scheduled'">
                      <span class="status-scheduled">{{taskData.status | capitalize}} &gt;&gt;</span>
                    </span>
                    <span v-if="taskData.status=='Complete'">
                      <span class="status-on">{{taskData.status | capitalize}} &gt;&gt;</span>
                    </span>
                  </router-link>
              </li>
              <li v-else>
                <i class='icon-diamond4 info-icon' style='color: #06bcbf;font-size: 10px;'></i>
                  <span style='padding: 0px 6px;font-weight: bold;'>{{ $t('status') }} :</span>
                  <span style='color: #444;'>{{taskData.status | capitalize}}</span>
              </li>
            </ul>
          </el-collapse-item>
          <!-- deploy detail -->
          <el-collapse-item name='2'>
            <template slot='title'>
              <span class='collapse-tit'>{{ $t('upper_deploy_detail') }}</span>
            </template>
            <ve-histogram :data="barData" :extend='chartExtend'></ve-histogram>
          </el-collapse-item>
          <!-- task detail result -->
          <el-collapse-item  name='3' class='com-table'>
            <template slot="title">
              <span class='collapse-tit'>{{ $t('upper_task_result') }}</span>
            </template>
            <el-table :data='taskResultData' v-if="taskData.type ==='deploy_solution'">
              <el-table-column prop='container' :label="$t('solution_name')" width='300'></el-table-column>
              <el-table-column :label="$t('device_name')">
                <template slot-scope='scope'>
                  <span class='con-wrap'>{{scope.row.device_name}}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('status')">
                <template slot-scope='scope'>
                  <span class="heading-text text-status-style status-private" v-if="scope.row.status==='waiting'">{{scope.row.status}}</span>
                  <span class="heading-text text-status-style status-private" v-else-if="scope.row.status ==='pending'">{{scope.row.status}}</span>
                  <span class="heading-text text-status-style status-on" v-else-if="scope.row.status ==='running' || scope.row.status === 'OTA complete'">{{scope.row.status}}</span>
                  <span class="heading-text text-status-style status-private" v-else>{{scope.row.status}}</span>
                </template>
              </el-table-column>
              <el-table-column prop='create_time' :label="$t('create_time')" sortable></el-table-column>
            </el-table>
            <el-table :data='taskResultData' v-else>
              <el-table-column  :label="$t('name')">
                <template slot-scope='scope'>
                  <router-link :to="{ name: 'software_app_deploy_status_list'}">
                    {{scope.row.container}}
                  </router-link>
                </template>
              </el-table-column>
              <el-table-column :label="$t('device')">
                <template slot-scope='scope'>
                  <router-link :to="{ name: 'software_app_deploy_status_list'}" class='con-wrap'>
                    {{scope.row.device_name}}
                  </router-link>
                </template>
              </el-table-column>
              <el-table-column :label="$t('status')">
                <template slot-scope='scope'>
                  <span class="heading-text text-status-style status-private " v-if="scope.row.status==='Waiting'">{{scope.row.status | capitalize}}</span>
                  <span class="heading-text text-status-style status-private" v-else-if="scope.row.status ==='Pending'">{{scope.row.status | capitalize}}</span>
                  <span class="heading-text text-status-style status-on" v-else-if="scope.row.status ==='Running' || scope.row.status === 'OTA complete'">{{scope.row.status | capitalize}}</span>
                  <span class="heading-text text-status-style status-private" v-else>{{scope.row.status | capitalize}}</span>
                </template>
              </el-table-column>
              <el-table-column prop='create_time' :label="$t('create_time')" sortable></el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { getTaskInfo } from '@/api'

  let thisVue = null

  export default {
    data () {
      return {
        taskData: {},
        taskId: this.$route.params.taskId,
        taskResultData: [],
        activeNames: ['1', '2', '3'],
        loading: true,
        taskDetailStatusVisible: false,
        taskIds: null,
        chartExtend: {
          barMaxWidth: '30px',
          itemStyle: {barBorderRadius: 3},
          xAxis: {
            show: true,
            axisLabel: {
              interval: 0
            }
          },
          yAxis: { minInterval: 1 },
          label: {
            show: true,
            position: 'top'
          },
          legend: {show: false}
        },
        barData: {
          columns: ['name', 'count'],
          rows: []
        }
      }
    },
    filters: {
      capitalize (val) {
        if (!val) return ''
        val = val.toString()
        if (val.startsWith('ota-')) {
          val = val.replace(/^(ota-)/, 'ota_')
        }
        return thisVue.$t(val.toLowerCase())
      }
    },
    methods: {
      showModel (type, taskId) {
        thisVue.taskDetailStatusVisible = true
        if (type === 'warning') {
          thisVue.taskIds = taskId
        }
      },
      getTaskDetail (taskId) {
        thisVue.loading = true
        getTaskInfo(taskId).then(dat => {
          let res = dat.data
          thisVue.loading = false
          if (res.status === 'fail' && res.error === true) {
            thisVue.$message({status: 'error', message: res.message})
          } else {
            thisVue.taskData = res
            thisVue.taskDataType = res.type
            thisVue.taskResultData = []
            thisVue.barData.rows = []
            if (res.type === 'deploy_solution') {
              for (let item in res.statistics.data) {
                let _val = res.statistics.data
                thisVue.barData.rows.push({name: thisVue.$options.filters['capitalize'](item), count: _val[item]})
              }
              for (let i in res.status_payload) {
                let result = {
                  'create_time': null,
                  'container': null,
                  'status': null,
                  'device_name': null,
                  'id': null
                }
                result.create_time = res.create_time
                result.id = res.id
                result.container = res.payload.solution
                result.device_name = res.status_payload[i].device_name
                let resultObj = res.status_payload[i].payloads
                if (resultObj && resultObj[0].status) {
                  result.status = resultObj[0].status
                } else {
                  result.status = 'pending'
                }
                thisVue.taskResultData.push(result)
              }
            } else {
              let _appSts = ['Pending', 'Creating', 'Starting', 'Running', 'Failed', 'Deleting', 'Deleted']
              for (let item of _appSts) {
                let _val = res.statistics.data
                thisVue.barData.rows.push({name: thisVue.$options.filters['capitalize'](item), count: _val[item]})
              }
              for (let i in res.status_payload) {
                for (let j in res.status_payload[i].payloads) {
                  let resultObj = res.status_payload[i].payloads[j]
                  let result = {
                    'create_time': null,
                    'container': null,
                    'status': null,
                    'device_name': null,
                    'id': null
                  }
                  result.device_name = res.status_payload[i].device_name
                  result.id = res.id
                  if (resultObj && resultObj.status === 'fail') {
                    result.container = res.id
                    result.status = 'none'
                    result.create_time = 'none'
                  } else if (resultObj && resultObj.status === 'Failure') {
                    result.container = res.id
                    result.status = 'none'
                    result.create_time = 'none'
                  } else if (resultObj && resultObj.status === 'Ready to start') {
                    result = resultObj
                  } else {
                    if (resultObj && resultObj.metadata) {
                      let createTime = resultObj.metadata.creationTimestamp
                      result.container = resultObj.metadata.name
                      if (createTime) {
                        result.create_time = createTime
                      } else {
                        result.create_time = 'none'
                      }
                      if (resultObj && resultObj.status) {
                        result.status = resultObj.status.phase
                      }
                    }
                  }
                  thisVue.taskResultData.push(result)
                }
              }
            }
          }
        }).catch(_ => {
          thisVue.loading = false
          return false
        })
      }
    },
    mounted () {
      thisVue = this
      thisVue.getTaskDetail(thisVue.taskId)
    }
  }
</script>

<style scoped>
  .el-collapse{ padding:0;}
  .app-list{min-height: 500px;background: #fff;}
  .opr-box{padding-bottom: 10px;}
  .list-tit{padding: 15px 20px; font-size: 2rem; border-bottom: 1px solid #ddd;}
  .el-collapse li{list-style: none;}
  .cell .el-button--mini{width: 100px;}
  .el-button.label{padding: 2px 3px !important;}
  .text-status-style{
    max-width: 90%;
    white-space: normal;
  }
  .com-table .el-button{padding: 0px;margin: 0px;}
  .collapse-tit{border-left: 2px solid #0072ea;padding-left: 10px;}
  .status-link-to .status-on,  .status-link-to .status-private,  .status-link-to .status-scheduled{ width: auto;padding: 2px 4px;}
  .status-link-to .status-on:hover{ transition: all .5s ease-out;background-color:#ebf9f9;}
  .status-link-to .status-private:hover{ transition: all .5s ease-out;background-color:#f2f7fb;}
  .status-link-to .status-scheduled:hover{ transition: all .5s ease-out;background-color:#faf4fe;}
</style>
