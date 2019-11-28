<template>
  <div v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading...">
    <el-row>
      <el-col :span='24' class='frame-banner'>
        <div class='dash-item dash-item1' :class="{'active': curType=='app'}" @click="changeType('app')" style="z-index: 4;"><span>{{ $t('app') }}</span></div>
        <div class='dash-item dash-item3' :class="{'active': curType=='solution'}" @click="changeType('solution')" style="z-index: 2;"><span>{{ $t('solution') }}</span></div>
        <div class="top-bar">
          <div class="btn-group" v-if="curType == 'app'">
            <el-button class="common-btn together-btn" size='small' @click='groupDeploy' :disabled='!canDeploy'><i class="iconfont icon-deployment"></i>{{ $t('deploy') }}</el-button>
            <el-button class="common-btn together-btn" size='small' @click='showTemplateDialog' :disabled='!canDeploy'><i class="iconfont icon-save"></i>{{ $t('save_as_template') }}</el-button>
          </div>
        </div>
      </el-col>
      <el-col class='com-table' :span='24' v-if="curType=='app'">
        <el-table :data='appData' @selection-change="handleAppChange" size='small' key='app'>
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column :label="$t('name')">
            <template slot-scope='scope'>
              <img :src="scope.row.image" width='30' height="30" alt="" class='table-img'>
              <div class='table-id'>{{scope.row.name}}</div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('description')">
            <template slot-scope='scope'>
              <span class='con-wrap'>{{scope.row.description}}</span>
            </template>
          </el-table-column>
          <el-table-column sortable='true' :label="$t('status')">
            <template slot-scope='scope'>
              <el-button class="status-on" type='' size="mini" v-if="scope.row.is_public">{{ $t('upper_public') }}</el-button>
              <el-button class="status-private" type='' size="mini" v-if="!scope.row.is_public">{{ $t('upper_private') }}</el-button>
            </template>
          </el-table-column>
          <el-table-column :label="$t('arguments')" width='100px'>
            <template slot-scope='scope'>
              <el-tooltip effect="dark" :content="$t('more_arguments')" placement="top">
              <i class="table-btn icon-spinner4" @click='showAppParams(scope.row.id)'></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col class='com-table' :span='24' v-if="curType=='solution'">
        <el-table :data='solutionData' size='small' key='solution'>
          <el-table-column :label="$t('name')">
            <template slot-scope='scope'>
              <span class="con-wrap">{{scope.row.solution}}</span>
            </template>
          </el-table-column>
          <el-table-column prop='model.model' :label="$t('model')"></el-table-column>
          <el-table-column prop='model.type' :label="$t('type')"></el-table-column>
          <el-table-column prop='model.platform' :label="$t('platform')"></el-table-column>
          <el-table-column prop='model.vendor' :label="$t('vendor')"></el-table-column>
          <el-table-column :label="$t('permission')">
            <template slot-scope='scope'>
              <el-button class="status-on" type='' size="mini" v-if="scope.row.is_public">{{ $t('upper_public') }}</el-button>
              <el-button class="status-private" type='' size="mini" v-if="!scope.row.is_public">{{ $t('upper_private') }}</el-button>
            </template>
          </el-table-column>
          <el-table-column :label="$t('action')" width='100px'>
            <template slot-scope='scope'>
              <el-tooltip effect="dark" :content="$t('deploy')" placement="top">
                <i class="table-btn iconfont icon-deployment" @click='groupDeploy(scope.row)'></i>
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('save_as_template')" placement="top">
                <i class="table-btn icon-floppy-disk" @click='showTemplateDialog(scope.row)'></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span='24' class='common-page'>
        <el-pagination background @current-change="handleCurrentChange"  @size-change="handleSizeChange" :current-page="page.number" :page-sizes="[10, 20, 30, 40]" :page-size="page.size" popper-class='page-pop' layout="total, slot, sizes, prev, pager, next" :total="page.total">
        </el-pagination>
      </el-col>
      <!-- dialog -->
      <el-dialog :visible.sync='dialog' :title="$t('more_arguments')" width='60%' :modal='false' :close-on-click-modal='false'>
        <appArg @dockerConfig='getDockerConfig' ref='apparg' :appId='curAppId'></appArg>
      </el-dialog>
      <!-- template -->
      <el-dialog :visible.sync='temDialog' :rules='rules' :title="$t('save_as_template')" width='60%' :modal='false' :close-on-click-modal='false'>
        <el-form :model='templateForm' size='small' label-width='160px' ref='templateForm' :rules='rules'>
          <el-form-item :label="$t('name')" prop='name'>
            <el-input v-model='templateForm.name'></el-input>
          </el-form-item>
          <el-form-item :label="$t('description')" prop='desc'>
            <el-input type='textarea' v-model='templateForm.desc'></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="temDialog = false" size='small'>{{ $t('cancel') }}</el-button>
          <el-button type="primary" @click="saveAsTemplate('templateForm')" size='small'>{{ $t('submit') }}</el-button>
        </span>
      </el-dialog>
    </el-row>
  </div>
</template>

<script>
import { applicationList, solutionList, deployGroup, taskTemplateSave } from '@/api'
import appArg from './apparg'
let thisVue = null

export default {
  components: { appArg },
  props: ['groupId'],
  data () {
    return {
      loading: false,
      appData: [],
      solutionData: [],
      dialog: false,
      curType: 'app',
      appParams: {},
      solutionParams: {},
      temDialog: false,
      curAppId: '',
      canDeploy: false,
      page: {
        size: 10,
        total: 0,
        number: 1
      },
      templateForm: {
        name: '',
        desc: '',
        body: null
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
      }
    }
  },
  methods: {
    getApp () {
      let {size, number} = thisVue.page
      let offset = size * (number - 1)
      let limit = size
      thisVue.loading = true
      applicationList({limit, offset}).then(dat => {
        let res = dat.data
        thisVue.loading = false
        if (res) {
          thisVue.appData = res.applications
          thisVue.page.total = res.total
        }
      }).catch(_ => {
        thisVue.loading = false
      })
    },
    showAppParams (id) {
      thisVue.curAppId = id
      thisVue.dialog = true
    },
    getDockerConfig (config, version) {
      thisVue.appParams[thisVue.curAppId] = {version: version, parameters: config}
      thisVue.dialog = false
      thisVue.$refs.apparg.resetForm()
    },
    getSolution () {
      let {size, number} = thisVue.page
      let offset = size * (number - 1)
      let limit = size
      thisVue.loading = true
      solutionList({limit, offset}).then(dat => {
        let res = dat.data
        thisVue.loading = false
        if (res) {
          thisVue.solutionData = res.results
          thisVue.page.total = res.total
        }
      }).catch(_ => {
        thisVue.loading = false
      })
    },
    changeType (type) {
      thisVue.curType = type
      if (type === 'app') {
        thisVue.getApp()
      } else if (type === 'solution') {
        thisVue.getSolution()
      }
    },
    groupDeploy (setVal) {
      thisVue.loading = true
      let payload = null
      if (thisVue.curType === 'app') {
        payload = []
        for (let item in thisVue.appParams) {
          let _item = thisVue.appParams[item]
          let cur = {}
          cur.version = _item.version
          cur.parameters = JSON.parse(_item.parameters)
          cur.application_id = item
          payload.push(cur)
        }
      } else if (thisVue.curType === 'solution') {
        let {id, solution, model_id, version, link} = setVal
        payload = {solution_id: id, solution, model_id, version, url: link}
      }
      let params = {group_id: thisVue.groupId, type: `deploy_${thisVue.curType}`, payload}
      deployGroup(params).then(dat => {
        let res = dat.data
        thisVue.loading = false
        if (res.status === 'success') {
          thisVue.$message({type: res.status, message: thisVue.$t('create_task_success')})
          thisVue.closeDialog()
        } else {
          thisVue.$message({type: 'error', message: thisVue.$t('create_task_fail'), duration: 0, showClose: true})
        }
      }).catch(_ => {
        thisVue.loading = false
      })
    },
    showTemplateDialog (val) {
      thisVue.temDialog = true
      if (val) {
        thisVue.solutionParams = val
      }
    },
    saveAsTemplate (form) {
      thisVue.$refs[form].validate(valid => {
        if (valid) {
          thisVue.loading = true
          let payload = null
          if (thisVue.curType === 'app') {
            payload = []
            for (let item in thisVue.appParams) {
              let _item = thisVue.appParams[item]
              let cur = {}
              cur.version = _item.version
              cur.parameters = JSON.parse(_item.parameters)
              cur.application_id = item
              payload.push(cur)
            }
          } else if (thisVue.curType === 'solution') {
            let {id, solution, model_id, version, link} = thisVue.solutionParams
            payload = {solution_id: id, solution, model_id, version, url: link}
          }
          let params = thisVue.templateForm
          params.body = {group_id: thisVue.groupId, type: `deploy_${thisVue.curType}`, payload}
          taskTemplateSave(params).then(dat => {
            let res = dat.data
            thisVue.loading = false
            if (res.status === 'success') {
              thisVue.$message({type: res.status, message: res.message})
              thisVue.temDialog = false
              thisVue.closeDialog()
            } else {
              thisVue.$message({type: 'error', message: res.message})
            }
          }).catch(_ => {
            thisVue.loading = false
          })
        }
      })
    },
    closeDialog () {
      thisVue.$emit('closeDialog')
    },
    handleAppChange (val) {
      if (val.length === 0) {
        thisVue.canDeploy = false
      } else {
        thisVue.canDeploy = true
        val.map(item => {
          if (!thisVue.appParams.hasOwnProperty(item.id)) {
            thisVue.appParams[item.id] = {version: item.version[0], parameters: JSON.stringify(thisVue.createAppForm)}
          }
        })
      }
    },
    handleCurrentChange (val) {
      thisVue.page.number = val
      if (thisVue.curType === 'app') {
        thisVue.getApp()
      } else if (thisVue.curType === 'solution') {
        thisVue.getSolution()
      }
    },
    handleSizeChange (val) {
      thisVue.page.size = val
      if (thisVue.curType === 'app') {
        thisVue.getApp()
      } else if (thisVue.curType === 'solution') {
        thisVue.getSolution()
      }
    }
  },
  mounted () {
    thisVue = this
    thisVue.getApp()
  }
}
</script>
<style scoped>
  .opr-box{padding-bottom: 15px;}
  .table-id{display: inline-block;margin-top:4px;}
  .table-img{float: left; margin-right: 6px;border-radius: 50%;}
  .top-bar{float: right;padding-top: 12px;}
  .frame-banner{ margin-bottom:1px;padding-left:10px;background: #fff;box-shadow:0 1px 0 0 #cbd7e2;margin-bottom: 20px;}
  .frame-banner .dash-item{ display:inline-block; margin: 0 15px -1px; padding: 17px 2px; cursor: pointer; border-bottom: 2px solid rgba(0,0,0,0);font-size:14px;color: #223c53;}
  .frame-banner .dash-item.active{ border-bottom: 2px solid #223c53;font-weight: bold;}
  .frame-banner .dash-item:hover{ border-bottom: 2px solid #223c53;}
</style>
