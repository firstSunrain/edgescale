<template>
  <div name="list" class='task-box'>
    <el-row v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="Loading....">
      <el-col :span='24'>
        <div class="page-filter">
        <el-col :span='22'>
          <el-select  class="common-input" v-model="taskStatusValue" @change="getAllTasks" :placeholder="$t('filter_by_status')" size='small'>
            <el-option v-for="item in taskStatusTypes" :key="item.key" :label="$t(item.value)" :value="item.key">
            </el-option>
          </el-select>
          <el-select class="common-input" v-model="queryTaskValuebyDeviceId" clearable @change="getAllTasks"  filterable :placeholder="$t('filter_by_dev')" size='small'>
            <el-option v-for="item in allDevicesValue" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
          <el-button  class="common-btn" size='small' :disabled="multipleSelectionTaskId.length?false:true" icon='icon-trash' @click="deleteTaskA(multipleSelectionTaskId)"> {{ $t('delete') }}</el-button>
        </el-col>
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
      <el-col :span='24' class='com-table' size='small'>
        <el-table ref="multipleTable" :data="showTasksData" tooltip-effect="dark" @selection-change="handleSelectionChange" @sort-change='sortTable' v-if="page_list">
          <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column prop="taskId" :label="$t('id')" sortable>
            <template slot-scope='scope'>
              <router-link :to="{name:'task_detail',params: { taskId:scope.row.id }}">
                {{scope.row.id}}
                <span class="label bg-success-400" v-if="scope.row.id ===  showTasksLatestData.id ">Latest</span>
              </router-link>
            </template>
          </el-table-column>
          <el-table-column :label="$t('type')" sortable>
            <template slot-scope='scope'>
              <span>{{ scope.row.type | capitalize }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('status')">
            <template slot-scope='scope'>
              <span class="status-on" type='info' v-if="scope.row.status == 'Complete'">{{ scope.row.status | capitalize }}</span>
              <span class="status-scheduled" v-else-if="scope.row.status == 'Scheduled'">{{ scope.row.status | capitalize }}</span>
              <span class="status-private" size="small" v-else-if="scope.row.status == 'Created'">{{ scope.row.status | capitalize }}</span>
              <span class="status-private" v-else>{{ scope.row.status | capitalize }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" :label="$t('create_time')" show-overflow-tooltip sortable>
          </el-table-column>
          <el-table-column :label="$t('action')" width='150'>
            <template slot-scope='scope'>
              <el-tooltip effect="dark" :content="$t('save_as_template')" placement="top">
                <i class="table-btn iconfont icon-save" @click="showDialog(scope.row.id)"></i>
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('delete')" placement="top">
                <i class="table-btn icon-trash" @click="deleteTaskA(scope.row.id)"></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <modelBlock :list='showTasksData' @delTemplate='deleteTaskA' @saveTemplate='showDialog' v-else></modelBlock>
      </el-col>

      <el-col :span='24' class="common-page">
        <el-pagination background @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="pageData.currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pageData.pageSize" layout="total, sizes, prev, pager, next" :total="pageData.total">
        </el-pagination>
      </el-col>

      <!-- save as template -->
      <el-dialog :visible.sync='dialogVisible' width="50%" :title="$t('save_as_template')">
        <div v-loading='temLoading' element-loading-spinner="el-icon-loading" element-loading-text="Loading....">
          <el-form :model='templateForm' size='small' label-width='160px' ref='templateForm' :rules='rules'>
            <el-form-item :label="$t('name')" prop='name'>
              <el-input v-model='templateForm.name'></el-input>
            </el-form-item>
            <el-form-item :label="$t('description')" prop='desc'>
              <el-input type='textarea' v-model='templateForm.desc'></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" style='text-align: right;'>
            <el-button @click="dialogVisible = false" size='small'>{{ $t('cancel') }}</el-button>
            <el-button type="primary" @click="saveAsTemplate" size='small'>{{ $t('submit') }}</el-button>
          </div>
        </div>
      </el-dialog>
    </el-row>
  </div>
</template>

<script>
  import { getTaskList, getTaskDev, taskDelete, taskTemplateSave } from '@/api'
  import modelBlock from './block'
  let thisVue = null

  export default {
    components: { modelBlock },
    data () {
      return {
        showTasksData: [],
        showTasksLatestData: [],
        multipleSelection: [],
        multipleSelectionTaskId: [],
        curTaskId: null,
        page_list: true,
        temLoading: false,
        taskStatusTypes: [
          {'key': '', 'value': 'all'},
          {'key': 'scheduled', 'value': 'scheduled'},
          {'key': 'created', 'value': 'created'},
          {'key': 'complete', 'value': 'complete'}
        ],
        taskStatusValue: '',
        allDevicesValue: [],
        queryTaskValuebyDeviceId: '',
        pageData: {
          'total': 0,
          'pageSize': 10,
          'currentPage': 1,
          'orderBy': '',
          'reverse': true
        },
        templateForm: {
          name: '',
          desc: ''
        },
        rules: {
          name: [{required: true, trigger: 'blur', message: this.$t('rule_name_require')}]
        },
        dialogVisible: false,
        tableList: [],
        loading: true,
        taskIds: null
      }
    },
    filters: {
      capitalize (val) {
        if (!val) return ''
        val = val.toString()
        return thisVue.$t(val.toLowerCase())
      }
    },
    methods: {
      handleSelectionChange (val) {
        thisVue.multipleSelection = val
        thisVue.multipleSelectionTaskId = []
        for (let item in thisVue.multipleSelection) {
          thisVue.multipleSelectionTaskId.push(thisVue.multipleSelection[item].id)
        }
      },
      getAllTasks () {
        thisVue.loading = true
        thisVue.showTasksData = []
        let params = {status: thisVue.taskStatusValue, device_id: thisVue.queryTaskValuebyDeviceId, limit: thisVue.pageData.pageSize, offset: (thisVue.pageData.currentPage - 1) * thisVue.pageData.pageSize, reverse: thisVue.pageData.reverse, orderBy: thisVue.pageData.orderBy}
        getTaskList(params).then(dat => {
          let res = dat.data
          thisVue.loading = false
          thisVue.pageData.total = res.total
          if (res.items && res.items.length >= 0) {
            thisVue.showTasksData = res.items
          }
          if (res.latest && thisVue.pageData.currentPage === 1) {
            thisVue.showTasksLatestData = res.latest
          }
        }).catch(_ => {
          thisVue.loading = false
        })
      },
      getAllDevices () {
        getTaskDev().then(dat => {
          let res = dat.data
          if (res.devices) {
            thisVue.allDevicesValue = res.devices
          }
        }).catch(_ => {
          return false
        })
      },
      deleteTaskA (taskId) {
        thisVue.$confirm(thisVue.$t('del_task_msg'), thisVue.$t('delete'), {type: 'error'}).then(() => {
          thisVue.loading = true
          let taskIds = typeof taskId !== 'object' ? taskId : taskId.join(',')
          taskDelete(taskIds).then(dat => {
            let res = dat.data
            thisVue.loading = false
            if (res.status === 'fail') {
              thisVue.$message({status: 'error', message: res.message})
            } else {
              thisVue.$message({message: thisVue.$t('operation_success'), type: 'success'})
              thisVue.getAllTasks()
            }
          }).catch(_ => {
            thisVue.loading = false
            return false
          })
        }).catch(() => {
          return false
        })
      },
      showDialog (id) {
        thisVue.dialogVisible = true
        thisVue.curTaskId = id
      },
      saveAsTemplate () {
        thisVue.temLoading = true
        let params = thisVue.templateForm
        params.task_id = thisVue.curTaskId.toString()
        taskTemplateSave(params).then(dat => {
          let res = dat.data
          thisVue.temLoading = false
          if (res.status === 'success') {
            thisVue.$message({type: 'success', message: res.message})
            thisVue.getAllTasks()
            thisVue.dialogVisible = false
          } else {
            thisVue.$message({type: 'error', message: res.message})
          }
        }).catch(_ => {
          thisVue.temLoading = false
          return false
        })
      },
      handleCurrentChange (val) {
        thisVue.pageData.currentPage = val
        thisVue.getAllTasks()
      },
      handleSizeChange (val) {
        thisVue.pageData.currentPage = 1
        thisVue.pageData.pageSize = val
        thisVue.getAllTasks()
      },
      sortTable (column, prop, order) {
        if (column.prop === 'taskId') {
          thisVue.pageData.orderBy = 'taskId'
        } else if (column.prop === 'create_time') {
          thisVue.pageData.orderBy = 'created_at'
        } else {
          return false
        }
        if (column.order === 'descending') {
          thisVue.pageData.reverse = true
        } else {
          thisVue.pageData.reverse = false
        }
        thisVue.getAllTasks()
      }
    },
    mounted () {
      thisVue = this
      thisVue.getAllTasks()
      thisVue.getAllDevices()
    }
  }
</script>

<style scoped>
  .task-box{padding: 20px;background-color: #fff;height: auto; overflow: hidden;}
  .opr-box{padding-bottom: 20px;}
  .list-tit{padding: 15px 20px; font-size: 2rem; border-bottom: 1px solid #ddd;}
  .cell .el-button--mini{width: 100px;}
  .el-select{vertical-align: middle;}
  .page-slot{font-weight: lighter;color: #606266;}
</style>
