<template>
  <div name="list" class='app-list'>
    <el-row class='list-box' v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading....">
      <el-col :span='24' class="page-filter">
          <el-select class="common-input" v-model='status' size='small' :placeholder="$t('filter_by_status')" @change='getTable'>
            <el-option :label="$t('all')" value=''></el-option>
            <el-option :label="$t('builder_inprogress')" value='InProgress'></el-option>
            <el-option :label="$t('builder_succeeded')" value='Succeeded'></el-option>
            <el-option :label="$t('builder_failed')" value='Failed'></el-option>
          </el-select>
          <div class="btn-group">
            <el-button class='common-btn together-btn' size='small' @click='toCreate'><i class="icon-googleplus5"></i>{{ $t('create') }}</el-button>
          </div>
      </el-col>

      <el-col class="com-table" :span='24'>
        <el-table :data='tableList' align='center' @header-click='sortTable'>
          <el-table-column sortable='false' :label="$t('name')">
            <template slot-scope='scope'>
              <router-link :to="'/builder/detail/'+scope.row.name">{{scope.row.name}}</router-link>
            </template>
          </el-table-column>
          <el-table-column :label="$t('status')">
            <template slot-scope='scope'>
              <span class="status-scheduled" v-if="scope.row.status == 'Pended'">{{ $t('builder_pended') }}</span>
              <span class="status-off" v-if="scope.row.status == 'FAILED'">{{ $t('builder_failed') }}</span>
              <span class="status-retired" v-if="scope.row.status == 'FAULT'">{{ $t('builder_fault') }}</span>
              <span class="status-new" v-if="scope.row.status == 'STOPPED'">{{ $t('builder_stop') }}</span>
              <span class="status-lowershelf" v-if="scope.row.status == 'TIMED_OUT'">{{ $t('builder_time_out') }}</span>
              <span class="status-on" v-if="scope.row.status == 'SUCCEEDED'">{{ $t('builder_succeeded') }}</span>
              <span class="status-private" v-if="scope.row.status == 'IN_PROGRESS'" :loading='true'>{{ $t('builder_inprogress') }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('type')" prop='category'></el-table-column>
          <el-table-column sortable='false' :label="$t('create_time')" prop='created'></el-table-column>
          <el-table-column :label="$t('last_build')" width='300px'>
            <template slot-scope='scope'>
              <router-link :to="{name: 'build_log', query: {name: scope.row.name, executionId: scope.row.id}}">{{scope.row.id}}</router-link>
            </template>
          </el-table-column>
          <el-table-column :label="$t('action')" width='150'>
            <template slot-scope='scope'>
              <el-tooltip :open-delay='delayNum' effect="dark" :content="$t('start')" placement="top">
                <i class="table-btn icon-play3" @click='startPrj(scope.row.name)'></i>
              </el-tooltip>
              <el-tooltip :open-delay='delayNum' effect="dark" :content="$t('edit')" placement="top">
                <i class="table-btn icon-pencil5" @click='toEdit(scope.row.name)'></i>
              </el-tooltip>
              <el-tooltip :open-delay='delayNum' effect="dark" :content="$t('delete')" placement="top">
                <i class="table-btn icon-trash" @click='deletePrj(scope.$index)'></i>
              </el-tooltip>
              <el-tooltip :open-delay='delayNum' effect="dark" :content="$t('create')" placement="top" v-if="scope.row.category == 'solution' && scope.row.status == 'SUCCEEDED'">
                <i class="table-btn icon-googleplus5" @click='createItem(scope.row)'></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-col>

      <el-col :span='24' class='common-page'>
        <el-pagination background @current-change="handleCurrentChange"  @size-change="handleSizeChange" :current-page="cur_page" :page-sizes="[10, 20, 30, 40]" :page-size="page_size" popper-class='page-pop' layout="total, slot, sizes, prev, pager, next" :total="total">
          <!-- <span class='page-slot'>projects per page</span> -->
        </el-pagination>
      </el-col>

    </el-row>
  </div>
</template>

<script>
  import { builderPrjList, builderPrjDelete, builderPrjStart, solutionCreate } from '@/api'

  let thisVue = null

  export default {
    data () {
      return {
        tableList: [],
        dialogType: 'create',
        delayNum: 600,
        loading: true,
        status: '',
        cur_page: 1,
        page_size: 10,
        total: 0,
        orderBy: '',
        reverse: null
      }
    },
    methods: {
      getTable () {
        thisVue.loading = true
        let params = {status: thisVue.status, size: thisVue.page_size, page: thisVue.cur_page, reverse: thisVue.reverse, orderBy: thisVue.orderBy}
        builderPrjList(params).then(dat => {
          let res = dat.data
          thisVue.loading = false
          thisVue.total = res.total
          if (res.projects && res.projects.length >= 0) {
            thisVue.tableList = res.projects
          }
        }).catch(_ => {
          thisVue.loading = false
        })
      },
      toCreate () {
        thisVue.$router.push('/builder/create')
      },
      deletePrj (index) {
        let name = thisVue.tableList[index].name
        thisVue.$confirm(thisVue.$t('if_continue'), thisVue.$t('delete'), {type: 'error'}).then(() => {
          thisVue.loading = true
          builderPrjDelete(name).then(dat => {
            let res = dat.data
            thisVue.loading = false
            if (res.Success) {
              thisVue.$message({type: 'success', message: res.Success})
              thisVue.getTable()
            }
          }).catch(_ => {
            thisVue.loading = false
          })
        }).catch(() => {
          return false
        })
      },
      createItem (val) {
        let params = {solution: val.name, model_id: val.model, version: 'latest', url: val.output + val.source}
        thisVue.$confirm(thisVue.$t('if_continue'), thisVue.$t('create'), {type: 'info'}).then(_ => {
          thisVue.loading = true
          solutionCreate(params).then(dat => {
            let res = dat.data
            thisVue.loading = false
            if (res && res.status === 'success') {
              thisVue.getTable()
            } else {
              thisVue.$message({type: 'error', message: res.message})
            }
          }).catch(_ => {
            thisVue.loading = false
          })
        }).catch(_ => {
          return false
        })
      },
      startPrj (name) {
        thisVue.$confirm(thisVue.$t('builder_start_msg'), thisVue.$t('start'), {type: 'warning'}).then(() => {
          thisVue.loading = true
          builderPrjStart(name, {'action': 'start'}).then(dat => {
            let res = dat.data
            thisVue.loading = false
            if (res.Success) {
              thisVue.$message({type: 'success', message: res.Success})
              thisVue.getTable()
            }
          }).catch(_ => {
            thisVue.loading = false
          })
        }).catch(() => {
          return false
        })
      },
      toEdit (name) {
        thisVue.$router.push('/builder/edit/' + name)
      },
      handleCurrentChange (val) {
        thisVue.cur_page = val
        thisVue.getTable()
      },
      handleSizeChange (val) {
        thisVue.page_size = val
        thisVue.getTable()
      },
      sortTable (column, event) {
        if (column.label === 'UpdateTime') {
          thisVue.orderBy = 'updated'
        } else if (column.label === 'CreateTime') {
          thisVue.orderBy = 'created'
        } else if (column.label === 'Name') {
          thisVue.orderBy = 'name'
        } else {
          return false
        }
        if (column.order === 'descending') {
          thisVue.reverse = true
        } else {
          thisVue.reverse = false
        }
        thisVue.getTable()
      }
    },
    mounted () {
      thisVue = this
      thisVue.getTable()
    }
  }
</script>

<style scoped>
  .app-list{ min-height: 500px;padding: 20px;background: #fff;}
  .list-box{background-color: #fff;}
  .opr-box{ }
  .list-tit{padding: 15px 20px; font-size: 2rem; border-bottom: 1px solid #ddd;}
  .page-bar{text-align:right; padding: 15px 20px;}
  .cell .el-button--mini{width: 100px;}
  .page-slot{font-weight: lighter;color: #606266;}
</style>
