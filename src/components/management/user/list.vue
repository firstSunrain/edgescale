<template>
  <div name="list" class='app-list'>
    <el-row class='list-box' v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading....">
      <el-col :span='24' class='opr-box'>
        <div class='page-filter'>
          <el-input class="common-input" clearable size='small' @keyup.native.enter='getTable' suffix-icon="el-icon-search" v-model="filter_text" :placeholder="$t('filter_by_name')"></el-input>
          <el-button class="common-btn" size='small' @click="comDialog = true"><i class="icon-googleplus5 text-size-base"></i>{{ $t('create') }}</el-button>
        </div>
      </el-col>
      <el-col :span='24' class='com-table'>
        <el-table :data='tableList' align='center' @header-click='sortTable'>
          <el-table-column sortable='false' :label="$t('name')">
            <template slot-scope='scope'>
              <router-link :to="{name: 'manage_user_detail', params: {id: scope.row.id}}">{{scope.row.username}}</router-link>
            </template>
          </el-table-column>
          <el-table-column :label="$t('email')" prop='email'></el-table-column>
          <el-table-column sortable='false' :label="$t('create_time')" prop='created_at'></el-table-column>
          <el-table-column :label="$t('update_time')" prop='updated_at'></el-table-column>
          <el-table-column :label="$t('status')">
            <template slot-scope='scope'>
              <span class="status-on" v-if="scope.row.status == 'active'">{{ $t('active') }}</span>
              <span class="status-off" v-else="scope.row.status == 'inactive'">{{ $t('inactive') }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('action')" width='120'>
            <template slot-scope='scope'>
              <el-tooltip :open-delay='delayNum' effect="dark" :content="$t('change_user_status')" placement="top-start">
                <i class="table-btn icon-stop" v-if="scope.row.status == 'inactive'" @click="changeStatus(scope.$index, 'active')"></i>
                <i class="table-btn icon-checkmark-circle2" v-if="scope.row.status == 'active'" @click="changeStatus(scope.$index, 'inactive')"></i>
              </el-tooltip>
              <el-tooltip :open-delay='delayNum' effect="dark" content="Setting" placement="top-start">
                <i class="table-btn icon-cog4" @click="showDialog(scope.row.username)"></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-col>

      <el-col :span='24' class='common-page'>
        <el-pagination background @current-change="handleCurrentChange"  @size-change="handleSizeChange" :current-page="cur_page" :page-sizes="[10, 20, 30, 40]" :page-size="page_size" popper-class='page-pop' layout="total, sizes, prev, pager, next" :total="total">
        </el-pagination>
      </el-col>

      <!-- change password dialog -->
      <el-dialog :title="$t('setting_limit')" :visible.sync='isDialog' width='50%' :show-close='false'>
        <el-form status-icon :model='diaForm' ref='diaForm' :rules='rules' label-width="100px" class="demo-ruleForm">
          <el-form-item :label="$t('user_id')" prop="username">
            <el-input size='small' v-model='diaForm.username' disabled></el-input>
          </el-form-item>
          <el-form-item :label="$t('limit_type')" prop="limit_type_id">
            <el-select v-model='diaForm.limit_type_id' @change="limitTypeChange">
              <template v-for="(value, key) in limit_type">
                <el-option :label='value.name' :value='value.id'></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('max_limit')" prop='max_limit'>
            <el-input size='small' type='number' v-model='diaForm.max_limit' auto-complete='off'></el-input>
          </el-form-item>
          <el-form-item :label="$t('max_seconds')" prop='max_seconds' v-if='hasMaxseconds'>
            <el-input size='small' type='number' v-model='diaForm.max_seconds' auto-complete='off'></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size='small' @click="cancle('diaForm')">{{ $t('cancel') }}</el-button>
          <el-button size='small' type="primary" @click="submitDialog('diaForm')">{{ $t('submit') }}</el-button>
        </span>
      </el-dialog>
      <!-- create dialog -->
      <el-dialog :visible.sync='comDialog' :title="$t('create')" :show-close='true' :close-on-click-modal='false'>
        <createUser @closeDialog='closeDialog'></createUser>
      </el-dialog>
    </el-row>
  </div>
</template>

<script>
  import { userList, userLimit, userLimitType, userOperation } from '@/api'
  import createUser from './create'
  let thisVue = null

  export default {
    components: { createUser },
    data () {
      return {
        diaForm: {
          limit_type_id: null,
          username: null,
          max_limit: null,
          max_seconds: null
        },
        comDialog: false,
        hasMaxseconds: false,
        limit_type: [],
        tableList: [],
        delayNum: 600,
        loading: true,
        isDialog: false,
        cur_page: 1,
        page_size: 10,
        total: 0,
        orderBy: '',
        reverse: null,
        filter_text: '',
        rules: {
          max_limit: [
            { required: true, message: 'max_limit is required', trigger: 'blur' }
          ],
          limit_type_id: [
            { required: true, message: 'limit_type_id is required', trigger: 'change' }
          ]
        }
      }
    },
    methods: {
      getTable () {
        thisVue.loading = true
        let offset = (thisVue.cur_page - 1) * thisVue.page_size
        let limit = thisVue.page_size
        let params = {filter_text: thisVue.filter_text, offset, limit, reverse: thisVue.reverse, orderBy: thisVue.orderBy}
        userList(params).then(dat => {
          let res = dat.data
          thisVue.loading = false
          thisVue.total = res.total
          if (res.users && res.users.length >= 0) {
            thisVue.tableList = res.users
          }
        }).catch(_ => {
          thisVue.loading = false
        })
      },
      changeStatus (index, status) {
        thisVue.$confirm(thisVue.$t(`change_to_${status}`), thisVue.$t('change_user_status'), {type: 'warning'}).then(_ => {
          let userId = thisVue.tableList[index].id
          let params = {user_id: userId, status}
          userOperation(params).then(dat => {
            let res = dat.data
            thisVue.loading = false
            if (res.status === 'success') {
              thisVue.$message({type: 'success', message: res.message})
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
      setLimit () {
        thisVue.loading = true
        let {limit_type_id, username} = thisVue.diaForm
        let params = {limit_type_id, username}
        params.max_limit = parseInt(thisVue.diaForm.max_limit)
        if (thisVue.hasMaxseconds) {
          params.max_seconds = parseInt(thisVue.diaForm.max_seconds)
        }
        userLimit(params).then(dat => {
          let res = dat.data
          thisVue.loading = false
          if (res.status === 'success') {
            thisVue.$message({type: 'success', message: res.message})
          } else {
            thisVue.$message({type: 'error', message: res.message})
          }
        }).catch(_ => {
          thisVue.loading = false
        })
      },
      getLimitType () {
        userLimitType().then(dat => {
          let res = dat.data
          thisVue.loading = false
          if (res.types && res.types.length >= 0) {
            thisVue.limit_type = res.types
          }
        }).catch(_ => {
          thisVue.loading = false
        })
      },
      limitTypeChange (val) {
        for (let type of thisVue.limit_type) {
          if (val === type.id) {
            if (type.default_max_sec !== null) {
              thisVue.hasMaxseconds = true
            } else {
              thisVue.hasMaxseconds = false
            }
          }
        }
      },
      closeDialog () {
        thisVue.comDialog = false
        thisVue.getTable()
      },
      showDialog (id) {
        thisVue.isDialog = true
        thisVue.getLimitType()
        thisVue.diaForm.username = id
      },
      submitDialog (diaForm) {
        thisVue.$refs[diaForm].validate((valid) => {
          if (valid) {
            thisVue.isDialog = false
            thisVue.setLimit()
          }
        })
        thisVue.$refs[diaForm].resetFields()
      },
      cancle (diaForm) {
        thisVue.$refs[diaForm].resetFields()
        thisVue.isDialog = false
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
          thisVue.orderBy = 'username'
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
    },
    watch: {
      diaForm: {
        handler (curVal, oldVal) {
          return false
        },
        deep: true
      }
    }
  }
</script>

<style scoped>
  .app-list{min-height: 500px;}
  .list-box{background-color: #fff; padding: 0px 20px 20px 20px;}
  .opr-box{padding-top: 15px;}
  .page-bar{text-align:right; padding: 15px 20px;}
  .el-select{width: 100%;}
</style>
