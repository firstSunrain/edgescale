<template>
  <div class="solution-group" v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading...">
    <el-row>
        <el-col :span='24'>
          <div class="page-filter">
            <el-input suffix-icon='el-icon-search' size='small' v-model='filter_text' class='common-input common-input-filter' @keyup.13.native.stop='getTable' :placeholder="$t('filter_by_name')"></el-input>
            <el-select class="common-input" size='small' v-model="filter_version" filterable clearable :placeholder="$t('filter_by_version')" @change='getTable'>
              <el-option v-for="item in versions" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </div>
          <div class="device-switch">
            <el-col class='page-type'>
              <el-button-group class="list-block-toggle">
                <el-button :class="{'active':page_list==true}" icon="icon-list2" size='mini' @click="page_list=true"></el-button>
                <el-button :class="{'active':page_list==false}" icon="icon-grid6" size='mini' @click="page_list=false"></el-button>
              </el-button-group>
            </el-col>
          </div>
      </el-col>
      <el-col :span='24' class='com-table'>
        <el-table :data='tableData' size='small' v-if="page_list">
          <el-table-column sortable='true' :label="$t('name')">
            <template slot-scope='scope'>
              <router-link class="con-wrap" :to="{name: 'solution_detail', params: {id: scope.row.id}}">{{scope.row.solution}}</router-link>
            </template>
          </el-table-column>
          <el-table-column prop='model.model' :label="$t('model')"></el-table-column>
          <el-table-column prop='model.platform' :label="$t('platform')"></el-table-column>
          <el-table-column prop='model.vendor' :label="$t('vendor')"></el-table-column>
          <el-table-column prop='model.type' :label="$t('type')"></el-table-column>
          <el-table-column prop='version' :label="$t('version')"></el-table-column>
          <el-table-column :label="$t('action')" width='100'>
            <template slot-scope='scope'>
              <el-tooltip effect="dark" :content="$t('deploy')" placement="top">
                <i class="table-btn iconfont icon-deployment" @click="showDialog(scope.row)"></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <modelBlock :list='tableData' @deploySolution='showDialog' v-else></modelBlock>
      </el-col>
      <el-col :span='24' class='common-page'>
        <el-pagination background @current-change="handleCurrentChange"  @size-change="handleSizeChange" :current-page="page.number" :page-sizes="[10, 20, 30, 40]" :page-size="page.size" popper-class='page-pop' layout="total, slot, sizes, prev, pager, next" :total="page.total">
        </el-pagination>
      </el-col>
    </el-row>
    <!-- dialog -->
    <el-dialog :visible.sync='comDialog' :title="$t('deploy')" width='80%' :close-on-click-modal='false'>
      <div v-loading='loadingDev' element-loading-spinner="el-icon-loading" element-loading-text="loading...">
        <div class='page-filter'>
          <devSearch class="devSearch-box" @getSelDev='getSelDev' :modelId='modelId'>
            <div class="btn-group" slot='other' style='float: right;'>
              <el-button class="common-btn together-btn" size='small' type="primary" @click="deploySolution" :disabled='deployDevIds.length==0'>
                <i class="iconfont icon-deployment"></i>{{ $t('deploy') }}
              </el-button>
              <el-button class="common-btn together-btn" size='small' @click="innerTemplateDialog = true" :disabled='deployDevIds.length==0'>
                <i class="iconfont icon-save"></i>{{ $t('save_as_template') }}
              </el-button>
            </div>
          </devSearch>
        </div>
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
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { solutionList, solutionVersion, taskCreate, taskTemplateSave } from '@/api'
import modelBlock from './block'
import devSearch from './devSearch'
let thisVue = null

export default {
  components: { modelBlock, devSearch },
  data () {
    return {
      loading: false,
      loadingDev: false,
      loadingInner: false,
      filter_text: '',
      filter_version: '',
      versions: [],
      comDialog: false,
      tableData: [],
      deployDevIds: [],
      curSolution: null,
      page_list: true,
      templateForm: {
        name: '',
        desc: ''
      },
      rules: {
        name: [{required: true, trigger: 'blur', message: this.$t('rule_name_require')}]
      },
      innerTemplateDialog: false,
      modelId: '',
      orderBy: '',
      orderType: '',
      page: {
        size: 10,
        total: 0,
        number: 1
      }
    }
  },
  methods: {
    getTable () {
      thisVue.loading = true
      let {size, number} = thisVue.page
      let offset = size * (number - 1)
      let limit = size
      let version = thisVue.filter_version
      let solution = thisVue.filter_text
      solutionList({limit, offset, version, solution, my_solution: true}).then(dat => {
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
    getVersionList () {
      solutionVersion().then(dat => {
        let res = dat.data
        if (res) {
          thisVue.versions = res
        }
      }).catch(_ => {
        thisVue.loading = false
      })
    },
    getSelDev (val) {
      thisVue.deployDevIds = []
      val.map(item => {
        thisVue.deployDevIds.push(item.id)
      })
    },
    showDialog (val) {
      thisVue.comDialog = true
      thisVue.curSolution = val
      thisVue.modelId = val.model.id
    },
    deploySolution () {
      thisVue.loadingDev = true
      let {id, solution, model_id, version, link} = thisVue.curSolution
      let payload = {solution_id: id, solution, model_id, version, url: link}
      let params = {device_ids: thisVue.deployDevIds, type: 'deploy_solution', payload}
      taskCreate({task: params}).then(dat => {
        let res = dat.data
        thisVue.loadingDev = false
        if (res.status === 'fail') {
          thisVue.$message({type: res.status, message: thisVue.$t('create_task_fail')})
        } else {
          thisVue.$message({type: res.status, message: thisVue.$t('create_task_success')})
          thisVue.comDialog = false
          thisVue.$router.push({name: 'task_detail', params: {taskId: res.task.id}})
        }
      }).catch(_ => {
        thisVue.loadingDev = false
      })
    },
    saveTemplate (form) {
      thisVue.$refs[form].validate(valid => {
        if (valid) {
          thisVue.loadingInner = true
          let {id, solution, model_id, version, link} = thisVue.curSolution
          let payload = {solution_id: id, solution, model_id, version, url: link}
          let params = thisVue.templateForm
          params.body = {device_ids: thisVue.deployDevIds, type: 'deploy_solution', payload}
          taskTemplateSave(params).then(dat => {
            let res = dat.data
            thisVue.loadingInner = false
            if (res.status === 'fail') {
              thisVue.$message({type: res.status, message: thisVue.$t('create_template_fail')})
            } else {
              thisVue.$message({type: res.status, message: thisVue.$t('create_template_success')})
              thisVue.innerTemplateDialog = false
              thisVue.comDialog = false
            }
          }).catch(_ => {
            thisVue.loadingInner = false
          })
        }
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
    thisVue.getVersionList()
    thisVue.getTable()
  }
}
</script>
<style scoped>
  .opr-box{padding-bottom: 15px;}
  .search-input{width: 300px;margin-right: 10px;}
  .table-btn{padding: 0px;margin: 0px;}
  .el-select{vertical-align: middle;}
  .devSearch-box{ float: left;width: auto;padding-right: 0;}
</style>
