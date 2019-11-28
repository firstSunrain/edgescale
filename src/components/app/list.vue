<template>
  <div class="app-group" v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading...">
    <el-row>
      <el-col :span='24'>
        <div class="page-filter">
        <el-col :span='22' class='filter-box'>
          <el-input class="common-input" suffix-icon='el-icon-search' size='small' clearable @keyup.13.native='getTable' v-model='filter_text' :placeholder="$t('filter_by_tags')"></el-input>
        </el-col>
          <div class="device-switch">
            <el-col class='page-type'>
              <el-button-group class="list-block-toggle">
                <el-button :class="{'active':page_list==true}" icon="icon-list2" size='mini' @click="page_list=true"></el-button>
                <el-button :class="{'active':page_list==false}" icon="icon-grid6" size='mini' @click="page_list=false"></el-button>
              </el-button-group>
            </el-col>
          </div>
        </div>
      </el-col>
      <el-col :span='24' class='com-table'>
        <el-table :data='tableData' size='small' v-if="page_list">
          <el-table-column :label="$t('name')">
            <template slot-scope='scope'>
              <router-link :to="{name: 'app_detail', params: {id: scope.row.id}}" class='table-id'>{{scope.row.name}}</router-link>
              <img v-if='scope.row.image' :src="scope.row.image" width='30' height="30" alt="" class='table-img'>
              <img v-else :src="icon" width='30' height="30" alt="" class='table-img'>
            </template>
          </el-table-column>
          <el-table-column sortable='true' :label="$t('permission')">
            <template slot-scope='scope'>
              <div class="block-w">
                <span class="status-on" type='success' size="mini" v-if="scope.row.is_public">{{ $t('upper_public') }}</span>
                <span class="status-private" type='danger' size="mini" v-else="!scope.row.is_public">{{ $t('upper_private') }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('description')">
            <template slot-scope='scope'>
              <span class='con-wrap'>{{scope.row.description}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('action')" width='100'>
            <template slot-scope='scope'>
              <el-tooltip effect="dark" :content="$t('deploy')" placement="top">
                <i class="table-btn iconfont icon-deployment" @click="showDialog(scope.row.id)"></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <modelBlock :list='tableData' @editModel='showDialog' v-else></modelBlock>
      </el-col>
      <el-col :span='24' class='common-page'>
        <el-pagination background @current-change="handleCurrentChange"  @size-change="handleSizeChange" :current-page="page.number" :page-sizes="[10, 20, 30, 40]" :page-size="page.size" popper-class='page-pop' layout="total, slot, sizes, prev, pager, next" :total="page.total">
        </el-pagination>
      </el-col>
    </el-row>
    <!-- dialog -->
    <el-dialog :visible.sync='comDialog' :title="$t('deploy')" width='90%' :close-on-click-modal='false'>
      <div v-loading='loadingDev' element-loading-spinner="el-icon-loading" element-loading-text="loading...">
        <div class='page-filter'>
          <el-col :span='14'><search @getFilter='getFilter'></search></el-col>
          <el-col :span='10'>
            <div style='float: right;'>
              <el-select class='common-input' v-model='appVersion' size='small'>
                <el-option v-for='(item, key) in appVersions' :key='key' :value='item' :label='item'></el-option>
              </el-select>
              <el-button class="common-btn together-btn" size='small' type="primary" @click="deployApp" :disabled='deployDevIds.length == 0'>
                <i class="iconfont icon-deployment"></i>{{ $t('deploy') }}
              </el-button>
              <el-button class="common-btn together-btn" size='small' type="warning" @click="innerTemplateDialog = true" :disabled='deployDevIds.length == 0'>
                <i class="iconfont icon-save"></i>{{ $t('save_as_template') }}
              </el-button>
              <el-button class="common-btn together-btn" size='small' icon='icon-spinner4' @click="innerDialog = true">{{ $t('more_arguments') }}</el-button>
            </div>
          </el-col>
        </div>
        <!-- inner dialog of arguments -->
        <el-dialog :visible.sync='innerDialog' :title="$t('add_docker_arguments')" width='60%' append-to-body :close-on-click-modal='false'>
          <appArg @dockerConfig='getDockerConfig'></appArg>
        </el-dialog>
        <!-- inner dialog of template Form -->
        <el-dialog :visible.sync='innerTemplateDialog' :rules='rules' :title="$t('save_as_template')" width='50%' append-to-body :close-on-click-modal='false'>
          <div v-loading='loadingInner' element-loading-spinner="el-icon-loading" element-loading-text="loading...">
            <el-form :model='templateForm' size='small' label-width='160px' ref='templateForm' :rules='rules'>
              <el-form-item :label="$t('name')" prop='name'>
                <el-input v-model='templateForm.name'></el-input>
              </el-form-item>
              <el-form-item :label="$t('description')" prop='desc'>
                <el-input type='textarea' v-model='templateForm.desc'></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="innerTemplateDialog = false" size='small'>{{ $t('cancel') }}</el-button>
              <el-button type="primary" @click="saveTemplate('templateForm')" size='small'>{{ $t('submit') }}</el-button>
            </div>
          </div>
        </el-dialog>
        <!-- table part -->
        <div class="com-table">
          <el-table :data='devList' size='small' @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column width='300' :label="$t('name')">
              <template slot-scope='scope'>
                <span class='con-wrap' v-if='scope.row.display_name'>{{scope.row.display_name}}</span>
                <span class='con-wrap' v-else>{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('model')">
              <template slot-scope='scope'>
                {{scope.row.mode.model}}-{{scope.row.mode.type}}-{{scope.row.mode.platform}}-{{scope.row.mode.vendor}}
              </template>
            </el-table-column>
            <el-table-column :label="$t('create_time')" width='200'>
              <template slot-scope='scope'>
                <span>{{scope.row.created_at | dateFormat}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('status')">
              <template slot-scope='scope'>
                <el-button class="status-on" size="mini" v-if="scope.row.status === 'online'">{{ $t('upper_online') }}</el-button>
                <el-button class="status-off" size="mini" v-else="!scope.row.status === 'offline'">{{ $t('upper_offline') }}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class='common-page'>
          <el-pagination background @current-change="devCurrentChange"  @size-change="devSizeChange" :current-page="pageDev.number" :page-sizes="[10, 20, 30, 40]" :page-size="pageDev.size" popper-class='page-pop' layout="total, slot, sizes, prev, pager, next" :total="pageDev.total">
          </el-pagination>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDevList, appVersionList, taskCreate, taskTemplateSave, applicationList } from '@/api'
import Favicon from '../../../static/img/SMBRouterF.png'
import modelBlock from './block'
import appArg from './apparg'
import search from './search'
let thisVue = null

export default {
  data () {
    return {
      loading: true,
      loadingDev: true,
      loadingInner: false,
      icon: Favicon,
      filter_text: '',
      comDialog: false,
      tableData: [],
      cur_id: null,
      appVersions: [],
      appVersion: '',
      devList: [],
      deployDevIds: [],
      page_list: true,
      templateForm: {
        name: '',
        desc: ''
      },
      rules: {
        name: [{required: true, trigger: 'blur', message: this.$t('rule_name_require')}]
      },
      createAppForm: {
        dynamic_commands: '',
        dynamic_args: '',
        dynamic_host_network: false,
        dynamic_ports: [{ containerPort: '', hostPort: '' }],
        dynamic_volumes: [{ mountPathReadOnly: false, hostPath: '', mountPath: '' }],
        dynamic_env: [{ name: '', value: '' }],
        dynamic_cap_add: false
      },
      innerDialog: false,
      innerTemplateDialog: false,
      filterAttr: {
        filter_location: '',
        filter_tag: '',
        filter_model: '',
        filter_name: ''
      },
      orderBy: '',
      orderType: '',
      page: {
        size: 10,
        total: 0,
        number: 1
      },
      pageDev: {
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
      thisVue.loading = true
      let {size, number} = thisVue.page
      let offset = size * (number - 1)
      let limit = size
      // let url = ''
      // if (thisVue.filter_text) {
      //   url = `/applications/filter?tag_names=${thisVue.filter_text}`
      // } else {
      //   url = `/applications?offset=${offset}&limit=${limit}`
      // }
      let params = {limit, offset, filter_tag: thisVue.filter_text}
      applicationList(params).then(dat => {
        let res = dat.data
        thisVue.loading = false
        thisVue.tableData = res.applications
        thisVue.page.total = res.total
      }).catch(_ => {
        thisVue.loading = false
        return false
      })
    },
    getFilter (val) {
      thisVue.filterAttr = val
      thisVue.getAllDevices()
    },
    getAllDevices () {
      thisVue.loadingDev = true
      let limit = thisVue.pageDev.size
      let offset = limit * (thisVue.pageDev.number - 1)
      let {filter_location, filter_tag, filter_name, filter_model} = thisVue.filterAttr
      let params = {filter_location, filter_tag, filter_name, filter_model, limit, offset, orderBy: thisVue.orderBy, orderType: thisVue.orderType}
      getDevList(params).then(dat => {
        let res = dat.data
        thisVue.loadingDev = false
        if (res && res.results) {
          thisVue.devList = res.results
          thisVue.pageDev.total = res.total
        }
      }).catch(_ => {
        thisVue.loadingDev = false
        return false
      })
    },
    getAppVersion (id) {
      thisVue.loadingDev = true
      appVersionList(id).then(dat => {
        let res = dat.data
        thisVue.appVersions = res.versions
        thisVue.appVersion = res.versions[0]
      }).catch(_ => {
        return false
      })
    },
    showDialog (id) {
      thisVue.comDialog = true
      thisVue.cur_id = id
      thisVue.getAllDevices()
      thisVue.getAppVersion(id)
    },
    deployApp () {
      thisVue.loadingDev = true
      let payload = {version: thisVue.appVersion, application_id: thisVue.cur_id, parameters: thisVue.createAppForm}
      let params = {device_ids: thisVue.deployDevIds, type: 'deploy_app', payload: [payload]}
      taskCreate({task: params}).then(dat => {
        let res = dat.data
        thisVue.loadingDev = false
        if (res.status === 'fail') {
          thisVue.$message({type: 'error', message: thisVue.$t('create_task_fail')})
        } else {
          thisVue.$message({type: 'success', message: thisVue.$t('create_task_success')})
          thisVue.comDialog = false
          thisVue.$router.push({name: 'task_detail', params: {taskId: res.task.id}})
        }
      }).catch(_ => {
        thisVue.loadingDev = false
        return false
      })
    },
    saveTemplate (form) {
      thisVue.$refs[form].validate(valid => {
        if (valid) {
          thisVue.loadingInner = true
          let payload = {version: thisVue.appVersion, application_id: thisVue.cur_id, parameters: thisVue.createAppForm}
          let params = thisVue.templateForm
          params.body = {device_ids: thisVue.deployDevIds, type: 'deploy_app', payload: [payload]}
          taskTemplateSave(params).then(dat => {
            let res = dat.data
            thisVue.loadingInner = false
            if (res.status === 'fail') {
              thisVue.$message({type: res.status, message: thisVue.$t('create_template_fail')})
            } else {
              thisVue.$message({type: res.status, message: thisVue.$t('create_template_success')})
              thisVue.comDialog = false
              thisVue.innerTemplateDialog = false
            }
          }).catch(_ => {
            thisVue.loadingInner = false
            return false
          })
        }
      })
    },
    getDockerConfig (data) {
      thisVue.createAppForm = data
      thisVue.innerDialog = false
    },
    handleSelectionChange (val) {
      thisVue.deployDevIds = val.map(item => {
        return item.id
      })
    },
    handleCurrentChange (val) {
      thisVue.page.number = val
      thisVue.getTable()
    },
    handleSizeChange (val) {
      thisVue.page.size = val
      thisVue.getTable()
    },
    devCurrentChange (val) {
      thisVue.pageDev.number = val
      thisVue.getAllDevices()
    },
    devSizeChange (val) {
      thisVue.pageDev.size = val
      thisVue.getAllDevices()
    }
  },
  mounted () {
    thisVue = this
    thisVue.getTable()
  },
  components: { modelBlock, appArg, search }
}
</script>
<style scoped>
  .opr-box{padding-bottom: 15px;}
  .search-input{width: 300px;margin-right: 10px;}
  .table-id{display: inline-block;    position: absolute;
    top: 28px;
    left: 58px;
    -webkit-transform: translate(-50%,-50%);
    transform: translateY(-50%);}
  .table-img{border-radius: 50%;float: left;width:40px;height: 40px;}
  .page-type{text-align: right;}
  .page-type .el-button{padding: 8px;}
  .filter-box .el-input{vertical-align: middle;}
  .inline-form{position: relative;margin-bottom: 10px;}
  .inline-form .el-input{display: inline-block;width: 30%;}
  .item-add{font-size: 20px; color: #16d8d2; position: absolute; top: 3px; left: 80%;cursor: pointer;}
  .item-red{color: #ca3a3a;}
  .page-type{text-align: right;}
  .page-type .el-button{margin:4px;padding: 0px; color: #aaa;
    border-color: #fff;
    background-color: #fff;}
  .page-type .el-button:focus,.page-type .el-button.active {
    color: #333;
    border-color: #fff;
    background-color: #fff;
  }
</style>
<style>
  .page-type .el-button i{ font-size:16px !important;}
</style>
