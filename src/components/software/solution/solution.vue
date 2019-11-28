<template>
  <div name="solution_list" class="sidebar-xs has-detached-left">
    <div class="row"  v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading...">
      <div class='frame-banner'>
        <div class='dash-item dash-item1' :class="{'active': !is_my_solution}" @click="changeType(false)" style="z-index: 4;"><span>{{ $t('public_solution') }}</span></div>
        <div class='dash-item dash-item3' :class="{'active': is_my_solution}" @click="changeType(true)" style="z-index: 2;"><span>{{ $t('private_solution') }}</span></div>
      </div>
      <!-- Detached content -->
      <div class="solution-content">
        <el-row class="solution-top">
          <el-col :span='22' class="device-filter">
            <div class="page-filter">
            <el-form :model="FilterSolutionForm" ref="FilterSolutionForm" label-position="top" class="demo-ruleForm" id="FilterSolutionFormSubmit">
              <el-input suffix-icon='el-icon-search' size='small' v-model='FilterSolutionForm.solution' class='common-input common-input-filter' @keyup.13.native='getSolutionsList' :placeholder="$t('filter_by_name')"></el-input>

              <el-select class="common-input" size='small' v-model="FilterSolutionForm.model_id" filterable clearable :placeholder="$t('filter_by_model')" @change='getSolutionsList'>
                <el-option v-for='(item, key) in modelList' :key='key' :value="item.id" :label="`${item.model}-${item.type}-${item.platform}-${item.vendor}`"></el-option>
                <a class='get-more' @click='getModelList'>{{ $t('more') }}...</a>
              </el-select>

              <el-input suffix-icon='el-icon-search' size='small' v-model='FilterSolutionForm.image' class='common-input common-input-filter' @keyup.13.native='getSolutionsList' :placeholder="$t('filter_by_image')"></el-input>

              <el-select class="common-input" size='small' v-model="FilterSolutionForm.version" filterable clearable :placeholder="$t('filter_by_version')" @change='getSolutionsList'>
                <el-option v-for="item in versionList" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
            </el-form>
            <el-button class="common-btn" v-if="is_my_solution" size='small' @click="$router.push({name: 'software_solution_create'})"><i class="icon-googleplus5 text-size-base"></i> <span> {{ $t('create') }}</span></el-button>
            </div>
          </el-col>
          <el-col :span='2' class="heading-elements not-collapsible solution-switch page-type">
            <el-button-group>
              <el-button :class="{'active':ListViewTrue==false}" icon="icon-list2" size='mini' @click="ListViewTrue=false"></el-button>
              <el-button :class="{'active':ListViewTrue==true}" icon="icon-grid6" size='mini' @click="ListViewTrue=true"></el-button>
            </el-button-group>
          </el-col>
        </el-row>
        <!-- Grid options -->
        <div v-if="ListViewTrue">
          <!-- Tasks grid -->
          <cardBlock :list='solutionsBoxList' :isMySolution='is_my_solution' @deploySolution='deployActioin' @delTag='handleClose' @bindTag='addTagToSolution' @delSolution='showSolutionModel' @shareSolution='showDialog' @editSolution='showDialog'></cardBlock>
          <!-- /tasks grid -->
        </div>
        <!-- /Grid options -->

        <!-- List options -->
        <div class="com-table" v-if="!ListViewTrue">
          <el-table :data='solutionsBoxList' size='small'>
            <el-table-column :label="$t('name')" width='200'>
              <template slot-scope='scope'>
                <router-link :to="{name:'software_solution_detail',params: { solutionId: scope.row.id }}" class='table-id con-wrap'>{{scope.row.solution}}</router-link>
              </template>
            </el-table-column>
            <el-table-column prop='model.model' :label="$t('model')">
              <template slot-scope='scope'>
                <span class='con-wrap'>{{scope.row.model.model}}-{{scope.row.model.platform}}-{{scope.row.model.type}}-{{scope.row.model.vendor}}</span>
              </template>
            </el-table-column>
            <el-table-column prop='image' :label="$t('image')">
              <template slot-scope='scope'>
                <span class='con-wrap'>{{scope.row.image}}</span>
              </template>
            </el-table-column>
            <el-table-column prop='version' :label="$t('version')" width='80'></el-table-column>
            <el-table-column :label="$t('action')" width='160'>
              <template slot-scope='scope'>
                <template v-if="is_my_solution">
                  <el-tooltip effect="dark" :content="$t('edit')" placement="top">
                    <i class='table-btn icon-pencil5' @click="showDialog('edit', scope.$index)"></i>
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('sign')" placement="top" v-if='scope.row.in_s3 && !scope.row.is_signed'>
                    <i class="table-btn icon-pencil6" @click="showDialog('sign', scope.$index)"></i>
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('share')" placement="top">
                    <i class="table-btn icon-hammer-wrench" @click="showDialog('audit', scope.$index)"></i>
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('delete')" placement="top" v-if='!scope.row.is_default'>
                    <i class="table-btn icon-trash" @click="showSolutionModel(scope.$index)"></i>
                  </el-tooltip>
                </template>
                <el-tooltip effect="dark" :content="$t('download')" placement="top">
                  <a :href="scope.row.link" class='table-btn icon-download4'></a>
                </el-tooltip>
                <el-tooltip effect="dark" :content="$t('deploy')" placement="top">
                  <i class='table-btn iconfont icon-deployment' @click="$router.push({name: 'software_solution_deploy_select_devices', params: {id: scope.row.id}})"></i>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class='common-page'>
          <el-pagination background @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="pageData.currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pageData.pageSize" layout="total, sizes, prev, pager, next" :total="pageData.total" class="btn-grey">
          </el-pagination>
        </div>
        <!-- List options -->
        
        <!-- /detached content -->
        <el-dialog :visible.sync='signDialog' :title="dialogTit" width='30%' :close-on-click-modal='false'>
          <div v-loading='diaLoading' element-loading-spinner="el-icon-loading" element-loading-text="loading...">
            <el-form :model='signForm' :rules='signRule' ref='signForm' size='mini' label-width='100px'>
              <el-form-item :label="$t('key_pair')" prop='key_id' v-if="diaType == 'sign'">
                <el-select v-model='signForm.key_id'>
                  <el-option v-for='(item, key) in keys' :key='key' :value="item.id" :label="item.name"></el-option>
                  <a class='get-more' @click='getKeys'>{{ $t('more') }}...</a>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('permission')" v-if="diaType == 'audit'" prop='permission'>
                <el-radio-group v-model="signForm.permission">
                  <el-radio-button label="private">{{ $t('upper_private') }}</el-radio-button>
                  <el-radio-button label="public">{{ $t('upper_public') }}</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="$t('description')" prop='description'>
                <el-input type="textarea" v-model='signForm.description'></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button size='small' @click="closeDialog('sign')">{{ $t('cancel') }}</el-button>
              <el-button type='primary' size='small' v-if="diaType == 'sign'" @click="submitForm('signForm')" :disabled='!signForm.key_id'>{{ $t('submit') }}</el-button>
              <el-button type='primary' size='small' v-if="diaType == 'audit'" @click="changePermission">{{ $t('submit') }}</el-button>
            </div>
          </div>
        </el-dialog>
        <!-- Edit -->
        <el-dialog :visible.sync='editDialog' :title="$t('edit')" :show-close='true' :close-on-click-modal='false'>
          <editSolution @closeDialog='closeDialog' :selItem='cur_item' :isDefault='isDefault'></editSolution>
        </el-dialog>
      </div>
      <!-- Detached content -->
    </div>
    <!--</el-row>-->
  </div>
</template>
<script>
  import { solutionList, createAudit, solutionSign, getKeyList, getModelList, solutionVersion, solutionTagDelete, solutionTagAdd, solutionDelete } from '@/api'
  import cardBlock from './block'
  import editSolution from './edit'

  let thisVue = null

  export default {
    components: {cardBlock, editSolution},
    data () {
      return {
        loading: true,
        ListViewTrue: false,
        signDialog: false,
        diaLoading: false,
        editDialog: false,
        diaType: 'sign',
        dialogTit: '',
        cur_id: '',
        isDefault: false,
        cur_item: {
          solutionId: '',
          solutionUrl: ''
        },
        keys: [],
        signForm: {
          key_id: '',
          permission: 'private',
          description: ''
        },
        signRule: {
          key_id: [{required: true, trigger: 'change', message: this.$t('rule_key_require')}]
        },
        is_my_solution: true,
        solutionsBoxList: [],
        modelList: {},
        versionList: [],
        FilterSolutionForm: {
          solution: '',
          model_id: '',
          version: '',
          image: ''
        },
        inputVisible: {},
        inputValue: {},
        deleteNameAttr: [],
        modalSolutionlId: null,
        status: '',
        pageData: {
          'total': 0,
          'totalPage': null,
          'pageSize': 10,
          'currentPage': 1,
          'orderBy': '',
          'reverse': true
        }
      }
    },
    methods: {
      getSolutionsList () {
        thisVue.loading = true
        let params = thisVue.FilterSolutionForm
        params['limit'] = thisVue.pageData.pageSize
        params['offset'] = (thisVue.pageData.currentPage - 1) * thisVue.pageData.pageSize
        params['my_solution'] = thisVue.is_my_solution
        solutionList(params).then(dat => {
          let res = dat.data
          thisVue.loading = false
          thisVue.pageData.total = res.total
          if (res && res.results) {
            thisVue.solutionsBoxList = res.results
          }
        }).catch(_ => {
          thisVue.loading = false
        })
      },
      changeType (val) {
        thisVue.is_my_solution = val
        thisVue.solutionsBoxList = []
        thisVue.getSolutionsList()
      },
      closeDialog (type) {
        if (type === 'sign') {
          thisVue.$refs['signForm'].resetFields()
          thisVue.signDialog = false
        } else {
          thisVue.editDialog = false
        }
        thisVue.getSolutionsList()
      },
      showDialog (type, val) {
        if (type !== 'edit') {
          thisVue.signDialog = true
          thisVue.diaType = type
          thisVue.cur_id = thisVue.solutionsBoxList[val].id
          if (type === 'sign') {
            thisVue.dialogTit = thisVue.$t('sign_solution')
          } else {
            thisVue.dialogTit = thisVue.$t('permission_setting')
          }
        } else {
          let _val = thisVue.solutionsBoxList[val]
          let {id, link} = _val
          thisVue.cur_item.solutionId = id
          thisVue.cur_item.solutionUrl = link
          thisVue.isDefault = _val.is_default
          thisVue.editDialog = true
        }
      },
      changePermission () {
        thisVue.diaLoading = true
        let {permission, description} = thisVue.signForm
        let params = {permission, description}
        params.approve_item = thisVue.cur_id
        params.approve_type = 'solution'
        createAudit(params).then(dat => {
          let res = dat.data
          thisVue.diaLoading = false
          if (res.status === 'fail') {
            thisVue.$message({type: 'error', message: res.message})
          } else {
            thisVue.$message({message: thisVue.$t('operation_success'), type: 'success'})
            thisVue.getSolutionsList()
            thisVue.closeDialog('sign')
          }
        }).catch(_ => {
          thisVue.diaLoading = false
        })
      },
      submitForm (form) {
        thisVue.$refs[form].validate(valid => {
          if (valid) {
            thisVue.diaLoading = true
            let {key_id, description} = thisVue.signForm
            let params = {key_id, description}
            params.solution_id = thisVue.cur_id
            solutionSign(params).then(dat => {
              let res = dat.data
              thisVue.diaLoading = false
              if (res.status === 'fail') {
                thisVue.$message({type: 'error', message: thisVue.$t('operation_fail')})
              } else {
                thisVue.$message({message: thisVue.$t('operation_success'), type: 'success'})
                thisVue.getSolutionsList()
                thisVue.closeDialog('sign')
              }
            }).catch(_ => {
              thisVue.diaLoading = false
            })
          }
        })
      },
      getKeys () {
        let offset = thisVue.keys.length
        getKeyList({limit: 10, offset}).then(dat => {
          let res = dat.data
          res.list.map(item => {
            thisVue.keys.push(item)
          })
        }).catch(_ => {
          return false
        })
      },
      deployActioin (val) {
        thisVue.$router.push({name: 'software_solution_deploy_select_devices', params: {id: val.id}})
      },
      getModelList () {
        let offset = thisVue.modelList.length
        getModelList({limit: 10, offset}).then(dat => {
          let res = dat.data
          thisVue.modelList = res.models
        }).catch(_ => {
          return false
        })
      },
      getVersionList () {
        solutionVersion().then(dat => {
          let res = dat.data
          if (res) {
            thisVue.versionList = res
          }
        }).catch(_ => {
          return false
        })
      },
      handleClose (solutionId, tagName) {
        thisVue.deleteTagToSolutionItem(solutionId, tagName)
      },
      deleteTagToSolutionItem (solutionId, tagName) {
        let params = {'solution_id': solutionId, 'tag_name': tagName}
        solutionTagDelete(params).then(dat => {
          let res = dat.data
          if (res.status === 'fail') {
            thisVue.$message({type: 'error', message: thisVue.$t('remove_tag_fail')})
          } else {
            thisVue.$message({message: thisVue.$t('remove_tag_success'), type: 'success'})
            thisVue.getSolutionsList()
          }
        }).catch(_ => {
          return false
        })
      },
      addTagToSolution (solutionId, tagName) {
        let tagNames = []
        tagNames.push(tagName)
        let params = {'solution_id': solutionId, 'tag_name': tagNames}
        solutionTagAdd(params).then(dat => {
          let res = dat.data
          if (res.status === 'fail') {
            thisVue.$message({type: 'error', message: thisVue.$t('add_tag_fail')})
          } else {
            thisVue.$message({message: thisVue.$t('add_tag_success'), type: 'success'})
            thisVue.getSolutionsList()
          }
        }).catch(_ => {
          return false
        })
      },
      showSolutionModel (index) {
        let id = thisVue.solutionsBoxList[index].id
        thisVue.$confirm(thisVue.$t('del_solution_msg'), thisVue.$t('delete'), {type: 'warning'}).then(function () {
          thisVue.delSolution(id)
        }).catch(_ => {
          return false
        })
      },
      delSolution (solutionId) {
        thisVue.loading = true
        solutionDelete({id: solutionId}).then(dat => {
          let res = dat.data
          if (res.status === 'success') {
            thisVue.$message({message: thisVue.$t('del_success'), type: 'success'})
            thisVue.getSolutionsList()
          } else {
            thisVue.$message({type: 'error', message: thisVue.$t('del_fail')})
          }
        }).catch(_ => {
          return false
        })
      },
      handleCurrentChange (val) {
        thisVue.pageData.currentPage = val
        thisVue.getSolutionsList()
      },
      handleSizeChange (val) {
        thisVue.pageData.pageSize = val
        thisVue.getSolutionsList()
      }
    },
    mounted () {
      thisVue = this
      thisVue.getModelList()
      thisVue.getVersionList()
      thisVue.getSolutionsList()
      thisVue.getKeys()
    }
  }
</script>
<style scoped>
  .app-list{min-height: 500px;}
  .opr-box{padding: 15px 20px;background-color: #fcfcfc;}
  .list-tit{padding: 15px 20px; font-size: 2rem; border-bottom: 1px solid #ddd;}
  .page-bar{text-align:right; padding: 15px 20px;}
  .cell .el-button--mini{width: 100px;}
  .page-slot{font-weight: lighter;color: #606266;}
  .select-model-class {padding: 0 !important;border: none !important;}
  .tx-overflow{word-break: break-all;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}
  .cursor{cursor: pointer;}
  .f-l{float: left;}
  .f-r{float: right;}
  .col-md-6:nth-child(2n+1) {clear: both;}
  .el-tag {margin-left: 10px;margin-top: 5px;}
  .button-newv-tag {margin-left: 10px;height: 32px;line-height: 30px;padding-top: 0;padding-bottom: 0;margin-top: 5px;}
  .input-new-tag {width: 90px;margin-left: 10px;vertical-align: bottom;}
  .el-tag--small {padding: 0 10px !important;height: 32px !important;line-height: 30px !important;}
  .el-pagination.is-background .btn-next.disabled, .el-pagination.is-background .btn-prev.disabled{ background:#fff!important;}
  .table-inbox tr td:not(:first-child){padding-left: 20px!important;}
  .el-dialog .el-select{width: 100%;}
  .solution-content{background-color: #fff;padding: 20px;height: auto; overflow: hidden;min-height: 500px;}
  .solution-tit{font-size: 16px; color: #666;margin-bottom: 20px;}
  .solution-switch{position: absolute;right: 0px;top: 10px;}
  .page-type{text-align: right;padding-top:9px;}
  .page-type .el-button{ margin:4px;padding: 0px; color: #aaa;
    border-color: #fff;
    background-color: #fff;}
  .page-type .el-button:focus,.page-type .el-button.active {
    color: #333;
    border-color: #fff;
    background-color: #fff;
  }
  .frame-banner{ margin-bottom:1px;padding-left:10px;background: #fff;box-shadow:0 1px 0 0 #cbd7e2;}
  .frame-banner .dash-item{ display:inline-block; margin: 0 15px -1px; padding: 17px 2px; cursor: pointer; border-bottom: 2px solid rgba(0,0,0,0);font-size:14px;color: #223c53;}
  .frame-banner .dash-item.active{ border-bottom: 2px solid #223c53;font-weight: bold;}
  .frame-banner .dash-item:hover{ border-bottom: 2px solid #223c53;}
</style>
<style>
  .page-type .el-button i{ padding-right:0;font-size:16px !important;}
  .page-type .el-button:hover,.page-type .el-button:focus, .page-type .el-button.active{ background:#fff;}
</style>
