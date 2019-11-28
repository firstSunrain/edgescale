<template>
  <div name="list" class="sidebar-xs has-detached-left">
    <div class='frame-banner'>
      <div class='dash-item dash-item1' :class="{'active': !is_my_model}" @click="changeType(false)" style="z-index: 4;"><span>{{ $t('public_model') }}</span></div>
      <div class='dash-item dash-item3' :class="{'active': is_my_model}" @click="changeType(true)" style="z-index: 2;"><span>{{ $t('private_model') }}</span></div>
    </div>
    <el-row class="container-box" v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading...">
      <div class='device-top'>
        <div class='page-filter'>
          <el-input class="common-input" clearable size='small' @keyup.native.enter='getModels' suffix-icon="el-icon-search" v-model="filterData.model" :placeholder="$t('filter_by_model')"></el-input>
          <el-input class="common-input" clearable size='small' @keyup.native.enter='getModels' suffix-icon="el-icon-search" v-model="filterData.type" :placeholder="$t('filter_by_type')"></el-input>
          <el-input class="common-input" clearable size='small' @keyup.native.enter='getModels' suffix-icon="el-icon-search" v-model="filterData.vendor" :placeholder="$t('filter_by_vendor')"></el-input>
          <el-input class="common-input" clearable size='small' @keyup.native.enter='getModels' suffix-icon="el-icon-search" v-model="filterData.platform" :placeholder="$t('filter_by_platform')"></el-input>
          <el-button class="common-btn" v-if='is_admin' size='small' @click="showDialog('create')"><i class="icon-googleplus5 text-size-base"></i>{{ $t('create') }}</el-button>
          <el-button class="common-btn" v-if='is_admin' size='small' @click="del" :disabled='selMod.length == 0'><i class="icon-trash"></i>{{ $t('delete') }}</el-button>
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
      <el-col :span='24' class="com-table" v-if="!viewModeGrid">
        <el-table :data='showModelsData' size='small' @selection-change="handleSelectionChange">
          <el-table-column type='selection' width='55'></el-table-column>
          <el-table-column sortable :label="$t('model')">
            <template slot-scope='scope'>
              <router-link :to="{name: 'model_detail', query: {id: scope.row.id, is_owner: scope.row.is_owner}}">{{scope.row.model}}</router-link>
            </template>
          </el-table-column>
          <el-table-column prop='type' :label="$t('type')"></el-table-column>
          <el-table-column prop='vendor' :label="$t('vendor')"></el-table-column>
          <el-table-column prop='platform' :label="$t('platform')"></el-table-column>
          <el-table-column :label="$t('permission')" width='120'>
            <template slot-scope='scope'>
              <span class="status-on" size="mini" v-if="scope.row.is_public">{{ $t('upper_public') }}</span>
              <span class="status-private" size="mini" v-else="!scope.row.is_public">{{ $t('upper_private') }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('action')" width='100' v-if='is_my_model'>
            <template slot-scope='scope' v-if='scope.row.is_owner'>
              <!-- <el-tooltip class="item" effect="dark" :content="$t('edit')" placement="top">
                <i class="table-btn icon-pencil5" @click="showDialog('edit', scope.row.id)"></i>
              </el-tooltip> -->
              <el-tooltip class="item" effect="dark" :content="$t('audit')" placement="top">
                <i class="table-btn icon-hammer-wrench" @click="showDialog('audit', scope.row.id)"></i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="$t('delete')" placement="top">
              <i class="table-btn icon-trash" @click="del(scope.$index)"></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span='24' v-else><modelBlock :list='showModelsData' @del='del' @edit='showDialog'></modelBlock></el-col>
      <!-- Pagination -->
      <el-col :span='24'>
        <div class="common-page" style='text-align: right;margin-top: 20px;'>
          <el-pagination background @current-change="handleCurrentChange"  @size-change="handleSizeChange" :current-page="pageData.currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pageData.pageSize" popper-class='page-pop' layout="total, slot, sizes, prev, pager, next" :total="pageData.total"></el-pagination>
        </div>
      </el-col>
      <!-- audit dialog -->
      <el-dialog :visible.sync='auditDialog' :title="$t('audit')" :show-close='true' :close-on-click-modal='false'>
        <div v-loading='diaLoading' element-loading-spinner="el-icon-loading" element-loading-text="loading...">
          <el-form :model='form' ref='form' size='mini' label-width='100px'>
            <el-form-item :label="$t('permission')" prop='permission'>
              <el-radio-group v-model="form.permission">
                <el-radio-button label="private">{{ $t('upper_private') }}</el-radio-button>
                <el-radio-button label="public">{{ $t('upper_public') }}</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('description')" prop='description'>
              <el-input type="textarea" v-model='form.description'></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button size='small' @click="closeDialog">{{ $t('cancel') }}</el-button>
            <el-button type='primary' size='small' @click="auditModel">{{ $t('submit') }}</el-button>
          </div>
        </div>
      </el-dialog>
      <!-- create dialog -->
      <el-dialog :visible.sync='createDialog' :title="$t(dialogType)" :show-close='true' :close-on-click-modal='false'>
        <createModel @closeDialog='closeDialog' v-if="dialogType == 'create'"></createModel>
        <editModel @closeDialog='closeDialog' v-if="dialogType == 'edit'" :modelId='cur_id'></editModel>
      </el-dialog>
    </el-row>
  </div>
</template>
<script>
  import { getModelList, modelDelete, createAudit } from '@/api'
  import modelBlock from './block'
  import createModel from './create'
  import editModel from './edit'

  let thisVue = null

  export default {
    components: {modelBlock, createModel, editModel},
    data () {
      return {
        counter: 0,
        showModelsData: [],
        loading: true,
        viewModeGrid: false,
        createDialog: false,
        dialogType: 'create',
        is_my_model: true,
        cur_id: '',
        selMod: [],
        auditDialog: false,
        diaLoading: false,
        pageData: {
          total: 0,
          pageSize: 10,
          currentPage: 1
        },
        form: {
          permission: 'public',
          description: ''
        },
        filterData: {
          model: '',
          type: '',
          platform: '',
          vendor: ''
        }
      }
    },
    computed: {
      is_admin: function () {
        return this.$store.state.account_type === 'OEM'
      }
    },
    methods: {
      handleCurrentChange (val) {
        thisVue.pageData.currentPage = val
        thisVue.getModels()
      },
      handleSizeChange (val) {
        thisVue.pageData.pageSize = val
        thisVue.getModels()
      },
      closeDialog () {
        thisVue.createDialog = false
        thisVue.auditDialog = false
        thisVue.getModels()
      },
      handleSelectionChange (val) {
        thisVue.selMod = val.map(item => {
          return item.id
        })
      },
      showDialog (type, val) {
        if (type === 'audit') {
          thisVue.auditDialog = true
        } else {
          thisVue.createDialog = true
          thisVue.dialogType = type
        }
        thisVue.cur_id = val
      },
      auditModel () {
        let params = thisVue.form
        params.approve_type = 'model'
        params.approve_item = thisVue.cur_id
        thisVue.diaLoading = true
        createAudit(params).then(dat => {
          let res = dat.data
          thisVue.diaLoading = false
          if (res.status === 'fail') {
            thisVue.$message({type: 'error', message: thisVue.$t('operation_fail')})
          } else if (res.status === 'success') {
            thisVue.$message({message: thisVue.$t('create_audit_request'), type: 'success'})
            thisVue.closeDialog()
          }
        }).catch(_ => {
          thisVue.diaLoading = false
        })
      },
      getModels () {
        thisVue.loading = true
        let {model, type, platform, vendor} = thisVue.filterData
        let limit = thisVue.pageData.pageSize
        let offset = limit * (thisVue.pageData.currentPage - 1)
        let params = {model, type, platform, vendor, limit, offset, my_model: thisVue.is_my_model.toString()}
        getModelList(params).then(dat => {
          let res = dat.data
          thisVue.loading = false
          if (res) {
            thisVue.showModelsData = res.models
            thisVue.pageData.total = res.total
          } else {
            thisVue.showModelsData = []
          }
        }).catch(_ => {
          thisVue.loading = false
        })
      },
      changeType (val) {
        thisVue.is_my_model = val
        thisVue.getModels()
      },
      del (index) {
        let modelId = []
        if (typeof index === 'number') {
          modelId = [thisVue.showModelsData[index].id]
        } else {
          modelId = thisVue.selMod
        }
        thisVue.$confirm(thisVue.$t('model_del_msg'), thisVue.$t('delete'), {type: 'warning'}).then(_ => {
          thisVue.loading = true
          modelDelete({model_ids: modelId}).then(dat => {
            let res = dat.data
            thisVue.loading = false
            if (res.status === 'fail') {
              thisVue.$message({type: 'error', message: thisVue.$t('model_del_fail')})
            } else if (res.status === 'success') {
              thisVue.$message({message: thisVue.$t('operation_success'), type: 'success'})
              thisVue.getModels()
            }
          }).catch(_ => {
            thisVue.loading = false
          })
        }).catch(_ => {
          return false
        })
      }
    },
    mounted () {
      thisVue = this
      thisVue.getModels()
    }
  }
</script>
<style scoped>
  .container-box{background-color: #fff;padding: 20px;}
</style>
