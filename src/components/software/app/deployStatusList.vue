<template>
  <div name="device_status_list" class="sidebar-xs has-detached-right" v-loading="loading" element-loading-text="loading..." element-loading-spinner="el-icon-loading">
    <div class="app-status-box">
      <el-row>
        <el-col :span='22'>
          <el-select class="common-input" @change='getContainerStatuses' v-model='filter_status' size='small' :placeholder="$t('filter_by_status')">
            <el-option v-for="(item, key) in containerStatusTypes" :key="key" :label="$t(key)" :value="key"></el-option>
          </el-select>
          <div class="btn-group">
            <el-button class="common-btn together-btn select-all-wrap" @click="exchangeCheckedAll" v-if='!page_list'>
              <div class="checker">
              <span :class="isCheckedAll===true ? 'checked':''">
                <input  type="checkbox" class="ischecked">
              </span>
              </div>
              <span class="" v-if="isCheckedAll===true">{{ $t('clear_all') }}</span>
              <span class="" v-else>{{ $t('select_all') }}</span>
            </el-button>
            <el-button type="button" class="common-btn together-btn" :disabled="isCheckedApp.length ?false:true"  @click="deleteApp(isCheckedApp)"><i class="icon-trash"></i>{{ $t('delete') }}</el-button>
            <el-button type="button" class="common-btn together-btn" @click='getContainerStatuses'><i class="icon-rotate-cw3"></i>{{ $t('refresh') }}</el-button>
          </div>
        </el-col>
        <el-col :span='2' class='page-type'>
          <el-button-group>
            <el-button :class="{'active':page_list==true}" icon="icon-list2" size='mini' @click="page_list=true"></el-button>
            <el-button :class="{'active':page_list==false}" icon="icon-grid6" size='mini' @click="page_list=false"></el-button>
          </el-button-group>
        </el-col>
      </el-row>
      <!-- /tasks options -->
      <el-row :gutter='10' style='clear: both;'>
        <el-col class='com-table' :span='24'  v-if="page_list">
          <el-table :data='containerResultData' size='small' @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" :selectable='checkSelect'></el-table-column>
            <el-table-column sortable='true' width='460' :label="$t('device_name')" prop='device_name'></el-table-column>
            <el-table-column :label="$t('message')">
              <template slot-scope='scope'>
                <span class="con-wrap">{{ scope.row.message }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('status')" width='100'>
              <template slot-scope='scope'>
                <span class="status-private" v-if="scope.row.status === 'waiting'">{{ scope.row.status | capitalize }}</span>
                <span class="status-private" v-else-if="scope.row.status === 'pending'">{{ scope.row.status | capitalize }}</span>
                <span class="status-on" v-else-if="scope.row.status === 'running'">{{ scope.row.status | capitalize }}</span>
                <span class="status-retired" v-else>{{scope.row.status | capitalize}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('create_time')">
              <template slot-scope='scope'>
                <span>{{scope.row.start_time | dateFormat}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('action')" width='100'>
              <template slot-scope='scope'>
                <el-tooltip class="item" effect="dark" :content="$t('app_log')" placement="top">
                  <i class="table-btn icon-menu6" @click='showDialog(scope.$index)'></i>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" v-if="scope.row.status !== 'deleting'" :content="$t('delete')" placement="top">
                  <i class="table-btn icon-trash" @click='deleteApp(scope.row.container)'></i>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col v-if="!page_list" :span='12' v-for="(item,index) in containerResultData" :key='index'>
          <div class="panel panel-default">
            <div class="panel-heading">
              <div class="checker" style="display: inline;" @click="updateIsChecked(item.container)">
                <span :class="isChecked[item.container]===true ? 'checked':''">
                  <input  type="checkbox" class="styled">
                </span>
              </div>
              <h6 class="tit">
                <el-tooltip effect="dark" :content="item.container" placement="top-start">
                  <a  :href="'http://'+containerStatusesData[index].status.hostIP+':5000/'" target="_blank" v-if="item.container==='aiwebapp'&& item.status ==='running'">
                    <span class="ellipsis inline-block" style="width: 20em">{{ item.container }}</span> <i class="glyphicon glyphicon-arrow-right"></i>
                  </a>
                  <span class="ellipsis inline-block" style="width: 20em" v-else>
                  {{ item.container }}
                </span>
                </el-tooltip>
              </h6>
              <div class="heading-elements">
                <span class="status-private" v-if="item.status==='waiting'">{{ item.status | capitalize }}</span>
                <span class="status-private" v-else-if="item.status ==='pending'">{{ item.status | capitalize }}</span>
                <span class="status-on" v-else-if="item.status ==='running'">{{ item.status | capitalize }}</span>
                <span class="status-private" v-else>{{item.status | capitalize}}</span>
              </div>
            </div>

            <div class="panel-body">
              <p class='con-wrap'>
                <span class="status-mark bg-success2 "></span>
                {{ $t('device') }}: {{ item.device_name}}
              </p>
              <p v-if="item.reason">
                <span class="status-mark bg-danger"></span>
                {{ $t('reason') }}: {{ item.reason }}
              </p>
              <p v-else>
                <span class="status-mark bg-success2"></span>
                {{ $t('reason') }}: {{ item.status | capitalize }}
              </p>
              <p v-if="item.message" class='con-wrap'>
                <span class="status-mark bg-danger2"></span>
                {{ $t('message') }}: {{ item.message }}
              </p>
              <p v-else>
                <span class="status-mark bg-success2"></span>
                {{ $t('message') }}: success
              </p>
              <p>
                <span class="status-mark bg-success2"></span>
                {{ $t('start_time') }}: {{ item.start_time }}
              </p>
            </div>
            <div class="card-opr-container card-opr-wrap">
              <el-dropdown trigger="click" class='card-opr'>
                <span class="el-dropdown-link" style="display: none;"> <i class="icon-menu9"></i> </span>
                <el-dropdown-menu slot="dropdown" class="dropdown-menu-sty">
                  <el-dropdown-item>
                    <div  @click="showDialog(index)">
                      <i class="icon-menu6"></i> {{ $t('app_log') }}
                    </div>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <div @click="deleteApp(item.container)">
                      <i class="table-btn icon-trash"></i> {{ $t('remove') }}
                    </div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </el-col>
      </el-row>
      <div :span='24' class='common-page'>
        <el-pagination background @current-change="handleCurrentChange"  @size-change="handleSizeChange" :current-page="page.number" :page-sizes="[10, 20, 30, 40]" :page-size="page.size" popper-class='page-pop' layout="total, slot, sizes, prev, pager, next" :total="page.total">
        </el-pagination>
      </div>
    </div>
    <el-dialog :title="$t('log')" :visible.sync='dialogVisible' :show-close='true' :close-on-click-modal='false'>
      <pre><code class="json" v-html="log">{{ log }}</code></pre>
    </el-dialog>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { getAppDeploy, appDeployDelete } from '@/api'

  let thisVue = null
  export default {
    data () {
      return {
        loading: true,
        page_list: true,
        isFilterResult: true,
        dialogVisible: false,
        modalDeviceId: null,
        modalDeviceName: null,
        containerStatusesData: [],
        log: null,
        containerResultData: [],
        containerStatusTypes: {},
        containerStatusValue: 'all',
        filter_status: '',
        isChecked: {},
        isCheckedApp: [],
        isCheckedAll: false,
        pickerOptions2: {
          shortcuts: [{
            text: 'last week',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: 'late month',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: 'The last three months',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        value3: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
        value4: '',
        page: {
          size: 10,
          total: 0,
          number: 1
        }
      }
    },
    filters: {
      capitalize (val) {
        if (!val) return ''
        val = val.toString()
        return thisVue.$t(val.toLowerCase())
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
      handleCurrentChange (val) {
        thisVue.page.number = val
        thisVue.getContainerStatuses()
      },
      handleSizeChange (val) {
        thisVue.page.size = val
        thisVue.getContainerStatuses()
      },
      handleSelectionChange (val) {
        thisVue.isCheckedApp = val.map(item => {
          return item.container
        })
      },
      checkSelect (row, index) {
        if (row.status === 'deleting') {
          return false
        }
        return true
      },
      exchangeCheckedAll () {
        thisVue.isCheckedAll = !thisVue.isCheckedAll
        thisVue.isChecked = {}
        thisVue.isCheckedApp = []
        for (let i in thisVue.containerResultData) {
          let key = thisVue.containerResultData[i].container
          Vue.set(thisVue.isChecked, key, thisVue.isCheckedAll)
        }
        for (let item in thisVue.isChecked) {
          if (thisVue.isChecked[item] === true) {
            thisVue.isCheckedApp.push(item)
          }
        }
      },
      updateIsChecked (key) {
        if (thisVue.isChecked[key] === undefined) {
          Vue.set(thisVue.isChecked, key, true)
        } else {
          Vue.set(thisVue.isChecked, key, !thisVue.isChecked[key])
        }
        thisVue.isCheckedApp = []
        for (let item in thisVue.isChecked) {
          if (thisVue.isChecked[item] === true) {
            thisVue.isCheckedApp.push(item)
          }
        }
      },
      getContainerStatuses () {
        thisVue.loading = true
        let {size, number} = thisVue.page
        let offset = size * (number - 1)
        let limit = size
        getAppDeploy({limit, offset, status: thisVue.filter_status}).then(dat => {
          let res = dat.data
          thisVue.loading = false
          if (res) {
            thisVue.loading = false
            thisVue.page.total = res.total
            thisVue.containerStatusesData = res.items
            thisVue.containerResultData = []
            thisVue.containerStatusTypes = {
              'all': res.items.length
            }
            for (let j in res.items) {
              let resultObj = res.items[j]
              let result = {
                'start_time': null,
                'container': null,
                'status': null,
                'device_name': null,
                'reason': null,
                'message': null
              }
              if (resultObj.metadata) {
                result.device_name = resultObj.metadata.nodename
                result.start_time = resultObj.metadata.creationTimestamp
                result.container = resultObj.metadata.name
              }
              if (resultObj.status) {
                result.status = resultObj.status.phase.toLowerCase()
                result.reason = resultObj.status.reason
                result.message = resultObj.status.message
              }
              if (thisVue.containerStatusTypes[result.status]) {
                thisVue.containerStatusTypes[result.status] += 1
              } else {
                thisVue.containerStatusTypes[result.status] = 1
              }
              thisVue.containerResultData.push(result)
            }
          }
        }).catch(_ => {
          thisVue.loading = false
        })
      },
      showDialog (index) {
        thisVue.dialogVisible = true
        thisVue.log = thisVue.containerStatusesData[index]
      },
      deleteApp (names) {
        thisVue.$confirm(thisVue.$t('want_to_continue'), thisVue.$t('delete'), {type: 'warning'}).then(_ => {
          thisVue.loading = true
          let device = {}
          device['names'] = typeof names !== 'object' ? [names] : names
          appDeployDelete(device).then(dat => {
            thisVue.loading = false
            thisVue.modalDeviceName = null
            thisVue.isCheckedApp = []
            thisVue.isChecked = []
            thisVue.$message({message: thisVue.$t('delete_deploy_success'), type: 'success'})
            thisVue.getContainerStatuses()
          }).catch(_ => {
            thisVue.loading = false
          })
        }).catch(_ => {
          return false
        })
      }
    },
    mounted: function () {
      thisVue = this
      thisVue.getContainerStatuses()
    }
  }
</script>
<style scoped="">
  pre {
    height: 300px;
  }
  .has-detached-right .app-status-box {
     padding: 20px;
     min-height: 460px;
     background-color: #fff;
  }
  .status-private,status-on{ width: auto;padding: 2px 5px;color: #6097cc;border: 1px solid #6097cc;font-size: 11px;line-height: initial;}
  .select-all-wrap{ width:110px;}
  .checker span{ width:14px;height:14px;border: 1px solid #dcdfe6;background:#fff;}
  .checker span:hover{ border: 1px solid #345682;}
  .checker span:after{ width: 14px;height: 14px;position: absolute;top: -1px;left: -1px;background: #245682;color: #fff;text-align: center;border: 1px solid #345682;border-radius: 2px;}
  .ischecked{ }
  .card-opr{ border-top:0;}
  .card-opr-wrap{ }
  .card-opr-wrap .card-opr{ margin-left:0;width:100%;}
  .panel{ border-color:#e1e3e6;background: #f5f6f7; border-top: 2px solid #d3d9df;box-shadow: none;}
  .panel-heading .tit{ margin: 0 0 0 3px;display: inline-block;line-height: 13px;color:#223c53;font-size: 16px;font-weight:bold;}
  .panel-default > .panel-heading{ padding-bottom:11px;background-color: #f5f6f7;border:0;}
  .heading-elements{ margin-top:-12px;}
  .panel-body{ margin: 0 20px;background: #fff;border-radius: 3px;}
  .panel-body p{ font-size:14px;}
  .bg-success2{ background:#2ec7c9;border-color:#2ec7c9;}
  .bg-danger2{ background:#f68873;border-color:#f68873;}
  .status-mark{ margin-right: 2px;}
</style>
