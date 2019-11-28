<template>
  <div name="list" class="sidebar-xs has-detached-left">
    <div class="container-box" v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading...">
      <div class='device-top'>
        <div class="page-filter">
          <!-- name -->
          <el-input size='small' class='common-input' @keyup.native.13='getAllDevices' v-model='filterAttr.filter_name' :placeholder="$t('filter_by_name')"></el-input>
          <!-- location -->
          <el-select class="common-input" size='small' @change='getAllDevices' v-model="filterAttr.filter_location" filterable clearable :placeholder="$t(`filter_by_location`)">
            <el-option v-for="item in locations" :key="item" :label="item" :value="item"></el-option>
          </el-select>
          <!-- platform -->
          <el-select class="common-input" size='small' @change='getAllDevices' v-model='filterAttr.filter_model' filterable clearable :placeholder="$t('filter_by_model')">
              <el-option v-for='(item, key) in models' :key='key' :value="item.id" :ref="`model${item.id}`" :label="`${item.model}-${item.type}-${item.platform}-${item.vendor}`"></el-option>
              <a class='get-more' @click='getAllModels'>{{ $t('more') }}...</a>
          </el-select>
          <!-- tags -->
          <el-select class="common-input" size='small' @change='getAllDevices' v-model="filterAttr.filter_tag" filterable clearable :placeholder="$t('filter_by_tags')">
            <el-option v-for="item in tagsData" :key="item.id" :label="item.name" :value="item.name"></el-option>
          </el-select>

          <div class="btn-group">
            <el-button class="common-btn together-btn" size='small' @click="createDialog = true">
              <i class="icon-googleplus5"></i>{{ $t('create') }}
            </el-button>
            <el-button class="common-btn together-btn" size='small' @click="del" :disabled='selectDevs.length == 0'>
              <i class="icon-trash"></i>{{ $t('delete') }}
            </el-button>
            <template v-if='!viewModeGrid'>
              <el-button class="common-btn together-btn" size='small' @click="comDialog=true" :disabled='selectDevs.length == 0'>
                <i class="iconfont icon-save"></i>{{ $t('save_as_group') }}
              </el-button>
              <el-button class="common-btn together-btn" size='small' :disabled='selectDevs.length == 0' @click="bindingTagDialogVisible = true">
                <i class="icon-link"></i>{{ $t('bind_tags') }}
              </el-button>
            </template>
          </div>
        </div>

          <div class="device-switch">
            <el-col class='page-type'>
            <el-button-group class="list-block-toggle">
              <el-button :class="{'active':viewModeGrid==false}" icon="icon-list2" size='mini' @click="viewModeGrid=false"></el-button>
              <el-button :class="{'active':viewModeGrid==true}" icon="icon-grid6" size='mini' @click="viewModeGrid=true"></el-button>
            </el-button-group>
          </el-col>
        </div>
      </div>
      <div class='com-table' v-if="!viewModeGrid">
        <el-table :data='showDevicesData' size='small' @selection-change="handleSelectionChange" @header-click='sortTable'>
          <el-table-column width="40" type='selection'></el-table-column>
          <el-table-column :label="$t('name')">
            <template slot-scope='scope'>
              <router-link :to="{name: 'device_detail', params: {deviceId: scope.row.id}}" class='table-id'>
                <span v-if='scope.row.display_name' class='dev-name con-wrap'>{{scope.row.display_name}}</span>
                <span v-else class='dev-name con-wrap'>{{scope.row.name}}</span>
              </router-link>
              <router-link v-if='scope.row.has_sub' :to="{name: 'device_sub_list', params: {id: scope.row.id}}" class='tree-link'>
                <i class="table-btn icon-tree6"></i>
              </router-link>
            </template>
          </el-table-column>
          <el-table-column :label="$t('model')" width='240'>
            <template slot-scope='scope'>
              {{scope.row.mode.model}}-{{scope.row.mode.type}}-{{scope.row.mode.platform}}-{{scope.row.mode.vendor}}
            </template>
          </el-table-column>
          <el-table-column :label="$t('last_report')">
            <template slot-scope='scope'>
              {{scope.row.last_report | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column prop='local_ip' :label="$t('local_ip')"></el-table-column>
          <el-table-column prop='created_at' sortable='true' :label="$t('create_time')" width='160'></el-table-column>
          <el-table-column :label="$t('status')">
            <template slot-scope='scope'>
              <span class="status-on" v-if="scope.row.status == 'online'">{{ $t('upper_online') }}</span>
              <span class="status-off" v-else="scope.row.status == 'offline'">{{ $t('upper_offline') }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('lifecycle')">
            <template slot-scope='scope'>
              <span class="status-on" v-if="scope.row.lifecycle == 'created'">{{ $t('created') }}</span>
              <span class="status-new" v-else-if="scope.row.lifecycle == 'new'">{{ $t('new') }}</span>
              <span class="status-auth" v-else-if="scope.row.lifecycle == 'auth'">{{ $t('auth') }}</span>
              <span class="status-scheduled" v-else-if="scope.row.lifecycle == 'active'">{{ $t('active') }}</span>
              <span class="status-inactive" v-else-if="scope.row.lifecycle == 'inactive'">{{ $t('inactive') }}</span>
              <span class="status-lowershelf" v-else="scope.row.lifecycle == 'retired'">{{ $t('retired') }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('action')" width='80'>
            <template slot-scope='scope'>
              <el-dropdown placement='bottom' trigger='click'>
                <span class="el-dropdown-link">
                  <i class="table-btn icon-menu5"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <template v-if="scope.row.lifecycle != 'retired'">
                    <el-dropdown-item v-if="scope.row.lifecycle == 'active'">
                      <div @click="Unenroll(scope.row.name, 'INACTIVE', 'Inactive')">
                        <i class="table-btn icon-switch"></i><span> {{ $t('Inactive') }}</span>
                      </div>
                    </el-dropdown-item>
                    <el-dropdown-item v-else>
                      <div @click="Unenroll(scope.row.name, 'ACTIVE', 'Active')">
                        <i class="table-btn icon-switch" style="color: #a2b3c2;"></i><span> {{ $t('Active') }}</span>
                      </div>
                    </el-dropdown-item>
                    <template v-if="scope.row.status == 'online'">
                      <el-dropdown-item>
                        <div @click='destroyDevice(scope.$index)'>
                          <i class="table-btn iconfont icon-xiaohuiwenjian"></i><span> {{ $t('destroy') }}</span>
                        </div>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <div @click="changeDeviceStatus('reset', scope.$index)">
                          <i class="table-btn iconfont icon-reset"></i><span> {{ $t('reset') }}</span>
                        </div>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <div @click="changeDeviceStatus('reboot', scope.$index)">
                          <i class="table-btn iconfont icon-reboot1"></i><span> {{ $t('reboot') }}</span>
                        </div>
                      </el-dropdown-item>
                    </template>
                  </template>
                  <el-dropdown-item>
                    <div @click='del(scope.$index)'>
                      <i class="table-btn icon-trash"></i><span> {{ $t('delete') }}</span>
                    </div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- Tasks grid -->
      <div class="row" v-if="viewModeGrid">
        <cardBlock :list='showDevicesData' @delDevice='del' @destroy='destroyDevice' @changeStatus='changeDeviceStatus' @enrollDevice='Unenroll' @delTag='handleClose' @bindTag='addTagToDevice'></cardBlock>
      </div>
      <!-- Pagination -->
      <div class="common-page">
        <el-pagination background @current-change="handleCurrentChange"  @size-change="handleSizeChange" :current-page="pageData.currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pageData.pageSize" popper-class='page-pop' layout="total, slot, sizes, prev, pager, next" :total="pageData.total"></el-pagination>
      </div>
    </div>
    <!--binding tag dialog-->
    <el-dialog :title="$t('bind_tags')" :visible.sync="bindingTagDialogVisible" :close-on-click-modal='false'>
      <el-select size='small' v-model="bindingTag" style="width:100%" filterable clearable allow-create>
        <el-option v-for="item in tagsData" :key="item.name" :label="item.name" :value="item.name"></el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button size='small' @click="bindingTagDialogVisible=false">{{ $t('cancel') }}</el-button>
        <el-button size='small' type="primary" @click="addTagToDevice(selectDevs, bindingTag)">{{ $t('submit') }}</el-button>
      </div>
    </el-dialog>
    <!-- save as group -->
    <el-dialog :visible.sync='comDialog' :title="$t('save_as_group')" :show-close='true' :close-on-click-modal='false'>
      <createGroup :condition='filterAttr' :selectDevs='selectDevs' @closeDialog='closeDialog'></createGroup>
    </el-dialog>
    <!-- create -->
    <el-dialog :visible.sync='createDialog' :title="$t('create')" :show-close='true' :close-on-click-modal='false'>
      <createDev @closeDialog='closeDialog'></createDev>
    </el-dialog>
  </div>
</template>

<script>
  import createGroup from './saveGroup'
  import cardBlock from './block'
  import createDev from './create'
  import { getDevList, getDevTagList, getDevAttrsList, getDevAttrName, devTagAdd, devTagDelete, devDelete, devEnroll, getDevCert, changeDevStatus, getModelList } from '@/api'

  let thisVue = null

  export default {
    components: { createGroup, cardBlock, createDev },
    data () {
      return {
        loading: true,
        delayNum: 600,
        unenroll: {},
        comDialog: false,
        createDialog: false,
        downloadIcon: 'icon-arrow-down7',
        isFilterResult: false,
        selectDevs: [],
        showDevicesData: [],
        tagsData: [],
        bindingTag: '',
        bindingTagDialogVisible: false,
        viewModeGrid: false,
        locations: [],
        models: [],
        filterAttr: {
          filter_tag: [],
          filter_name: '',
          filter_location: '',
          filter_model: '',
          orderBy: '',
          orderType: ''
        },
        pageData: {
          total: 0,
          pageSize: 10,
          currentPage: 1
        }
      }
    },
    filters: {
      dateFormat (val) {
        if (val) {
          let _date = new Date(val.toString())
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
      Unenroll (name, status, operateName) {
        let message = thisVue.$t(`${operateName}_enroll_msg`)
        thisVue.$confirm(message, thisVue.$t(operateName), {type: 'warning', dangerouslyUseHTMLString: true}).then(() => {
          thisVue.loading = true
          devEnroll({name, status}).then(dat => {
            let res = dat.data
            if (res.status === 'ACTIVE') {
              thisVue.$message({type: 'success', message: thisVue.$t('active_dev_msg')})
              thisVue.unenroll[name] = true
              thisVue.downloadDeviceCertificate(name)
            } else if (res.status === 'INACTIVE') {
              thisVue.$message({type: 'success', message: thisVue.$t('inactive_dev_msg')})
              thisVue.unenroll[name] = false
            }
            thisVue.getAllDevices()
          }).catch(_ => {
            thisVue.loading = false
          })
        }).catch(() => {
          return false
        })
      },
      downloadCSV (data, fileName) {
        var blob = new Blob([data], {type: 'text/plain;charset=utf-8;'})
        let body = document.getElementsByTagName('body')[0]
        let anchor = document.createElement('a')
        anchor.class = 'downloadDeviceCer'
        body.appendChild(anchor)

        if (window.navigator.msSaveBlob) { // IE
          window.navigator.msSaveOrOpenBlob(blob, fileName)
        } else if (navigator.userAgent.search('Firefox') !== -1) { // Firefox
          body.style.display = 'none'

          anchor.href = 'data:attachment/csv;charset=utf-8,' + encodeURIComponent(data)
          anchor.download = fileName
          anchor.click()
          anchor.remove()
        } else { // Chrome
          anchor.href = URL.createObjectURL(blob)
          anchor.download = fileName
          anchor.click()
          anchor.remove()
        }
        thisVue.$alert(thisVue.$t('refer_guide'), {
          confirmButtonText: thisVue.$t('cancel'),
          type: 'info'
        })
      },
      downloadDeviceCertificate (deviceName) {
        thisVue.loading = true
        getDevCert({device_name: deviceName}).then(dat => {
          let res = dat.data
          thisVue.loading = false
          let filename = 'bootstrap-enroll-' + deviceName + '.sh'
          thisVue.downloadCSV(res, filename)
        }).catch(_ => {
          thisVue.loading = false
          thisVue.downloadIcon = 'icon-arrow-down7'
        })
      },
      destroyDevice (index) {
        let dev = thisVue.showDevicesData[index]
        thisVue.$confirm(thisVue.$t('destroy_msg'), thisVue.$t('destroy'), {type: 'error'}).then(_ => {
          let params = {name: dev.name, status: 'DESTRUCTIVE'}
          thisVue.loading = true
          devEnroll(params).then(dat => {
            let res = dat.data
            if (res.status === 'DESTRUCTIVE') {
              thisVue.$message({type: 'success', message: thisVue.$t('destroy_dev_success')})
              thisVue.getAllDevices()
            } else {
              thisVue.$message({type: 'error', message: thisVue.$t('destroy_dev_fail')})
            }
          }).catch(_ => {
            thisVue.loading = false
          })
        }).catch(_ => {
          return false
        })
      },
      changeDeviceStatus (type, index) {
        let dev = thisVue.showDevicesData[index]
        thisVue.$confirm(thisVue.$t('want_to_continue'), thisVue.$t(type), {type: 'error'}).then(_ => {
          let params = {action: type, device_id: dev.name}
          thisVue.loading = true
          changeDevStatus(params).then(dat => {
            thisVue.loading = false
            let res = dat.data
            if (res.status === 'success') {
              thisVue.$message({type: 'success', message: thisVue.$t('operation_success')})
              thisVue.getAllDevices()
            } else {
              thisVue.$message({type: 'error', message: thisVue.$t('operation_fail')})
            }
          }).catch(_ => {
            thisVue.$message({type: 'error', message: thisVue.$t('operation_fail')})
            thisVue.loading = false
          })
        }).catch(_ => {
          return false
        })
      },
      handleCurrentChange (val) {
        thisVue.pageData.currentPage = val
        thisVue.getAllDevices()
      },
      handleSizeChange (val) {
        thisVue.pageData.pageSize = val
        thisVue.getAllDevices()
      },
      sortTable (column, event) {
        if (column.sortable) {
          thisVue.filterAttr.orderBy = column.property
          if (column.order) {
            thisVue.filterAttr.orderType = column.order.substring(0, column.order.length - 6)
          }
          thisVue.getAllDevices()
        }
      },
      handleClose (deviceName, tagName) {
        thisVue.deleteTagToDeviceItem(deviceName, tagName)
      },
      getAllDevices () {
        thisVue.loading = true
        let limit = thisVue.pageData.pageSize
        let offset = limit * (thisVue.pageData.currentPage - 1)
        let {filter_location, filter_tag, filter_name, filter_model, orderBy, orderType} = thisVue.filterAttr
        let params = {filter_location, filter_tag, filter_name, filter_model, limit, offset, orderBy, orderType}
        getDevList(params).then(dat => {
          let res = dat.data
          thisVue.loading = false
          if (res && res.results) {
            thisVue.showDevicesData = res.results
            thisVue.pageData.total = res.total
          }
        }).catch(_ => {
          thisVue.loading = false
        })
      },
      getAllTags () {
        getDevTagList().then(dat => {
          let res = dat.data
          if (res) {
            thisVue.tagsData = res
          }
        }).catch(_ => {
          return false
        })
      },
      getAllModels () {
        let offset = thisVue.models.length
        getModelList({limit: 10, offset}).then(dat => {
          let res = dat.data
          res.models.map(item => {
            thisVue.models.push(item)
          })
        }).catch(_ => {
          thisVue.loading = false
        })
      },
      getAllDeviceAttributes () {
        getDevAttrsList().then(dat => {
          let res = dat.data
          if (res && res.attributes) {
            res.attributes.map(item => {
              if (item.name === 'location') {
                thisVue.getAllDeviceAttributeValuesById(item.id, item.name)
              }
            })
          }
        }).catch(_ => {
          return false
        })
      },
      getAllDeviceAttributeValuesById (id) {
        getDevAttrName({attr_id: id}).then(dat => {
          let res = dat.data
          if (res) {
            thisVue.locations = res.values
          }
        }).catch(_ => {
          return false
        })
      },
      addTagToDevice (devs, tagName) {
        let _data = {'tag_name': tagName, 'device_ids': devs}
        devTagAdd(_data).then(dat => {
          let res = dat.data
          if (res.status === 'fail') {
            thisVue.$message({type: 'error', message: thisVue.$t('operation_fail')})
          } else if (res.status === 'success') {
            thisVue.$message({message: thisVue.$t('add_tag_success'), type: 'success'})
            thisVue.bindingTagDialogVisible = false
            thisVue.getAllDevices()
          }
        }).catch(_ => {
          return false
        })
      },
      deleteTagToDeviceItem (deviceName, tagName) {
        let params = {name: tagName, devId: deviceName}
        devTagDelete(params).then(dat => {
          let res = dat.data
          if (res.status === 'fail') {
            thisVue.$message({type: 'error', message: thisVue.$t('operation_fail')})
          } else {
            thisVue.$message({message: thisVue.$t('del_tag_success'), type: 'success'})
            thisVue.getAllDevices()
          }
        }).catch(_ => {
          return false
        })
      },
      closeDialog () {
        thisVue.comDialog = false
        thisVue.createDialog = false
        thisVue.getAllDevices()
      },
      handleSelectionChange (val) {
        thisVue.selectDevs = val.map(item => {
          return item.id
        })
      },
      del (index) {
        let params = {}
        if (typeof index === 'number') {
          let id = thisVue.showDevicesData[index].id
          params.device_ids = [id]
        } else {
          params.device_ids = thisVue.selectDevs
        }
        thisVue.$confirm(thisVue.$t('del_device_msg'), thisVue.$t('delete'), {type: 'warning'}).then(_ => {
          thisVue.loading = true
          devDelete(params).then(dat => {
            let res = dat.data
            thisVue.loading = false
            if (res.status === 'success') {
              thisVue.$message({message: thisVue.$t('dev_del_msg_success'), type: 'success'})
              thisVue.getAllDevices()
            } else if (res.status === 'fail') {
              thisVue.$message({type: 'error', message: res.message})
            }
          }).catch(_ => {
            return false
          })
        }).catch(_ => {
          return false
        })
      }
    },
    mounted () {
      thisVue = this
      thisVue.getAllDevices()
      thisVue.getAllTags()
      thisVue.getAllDeviceAttributes()
      thisVue.getAllModels()
    }
  }
</script>
<style scoped>
  .container-box{background-color: #fff;padding: 20px;height: auto;overflow: hidden; min-height:500px;}
  .dev-name{width: 80%;display: inline-block;vertical-align: middle;}
  .tree-link{float: right;vertical-align: middle;display: inline-block;}
</style>
<style>
  .dev-table .el-table__body-wrapper{overflow-x: auto;}
</style>
