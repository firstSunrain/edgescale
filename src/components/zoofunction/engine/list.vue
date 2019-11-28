<template>
  <div class="customer-box" v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading...">
    <div class='com-tit'>Engine List</div>
    <el-row>
      <el-col :span='24' class='opr-box'>
        <el-col :span='22' class='filter-box'>
          <el-input suffix-icon='el-icon-search' size='small' v-model='filter_text' class='search-input' @keyup.13.native='getTable' placeholder='filter by name...'></el-input>
          <el-button size='small' icon='icon-search4 text-size-base' @click="getTable">Search</el-button>
          <el-button class="line-filter mr10"></el-button>
          <el-button-group class="btn-filter">
            <el-button size='small' icon='icon-plus2' @click="showDialog('add')">Create</el-button>
          </el-button-group>
        </el-col>
        <el-col :span='2' class='page-type'>
          <el-button-group>
            <el-button :class="{'active':page_list==true}" icon="icon-list2" size='mini' @click="page_list=true"></el-button>
            <el-button :class="{'active':page_list==false}" icon="icon-grid6" size='mini' @click="page_list=false"></el-button>
          </el-button-group>
        </el-col>
      </el-col>
      <el-col :span='24'>
        <el-table :data='tableData' border size='small' v-if="page_list">
          <el-table-column label='Name' width="160px">
            <template slot-scope='scope'>
              <router-link :to="{name: 'zoo_engine_detail', params: {id: scope.row.id}}">{{scope.row.name}}</router-link>
            </template>
          </el-table-column>
          <el-table-column prop='description' label='Description'></el-table-column>
          <el-table-column sortable prop='date_created' label='Date created'></el-table-column>
          <el-table-column sortable prop='date_updated' label='Date updated'></el-table-column>
          <el-table-column label='Action' width='100'>
            <template slot-scope='scope'>
              <el-button class='table-btn' type='text' icon='icon-pencil5' @click="showDialog('edit', scope.row)"></el-button>
              <el-button class='table-btn btn-red' type='text' icon='icon-trash' @click="delEngine(scope.row.id)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <modelBlock :list='tableData' @showDialog='showDialog' @delEngine='delEngine' v-else></modelBlock>
      </el-col>
      <el-col :span='24' class='page-bar'>
        <el-pagination background @current-change="handleCurrentChange"  @size-change="handleSizeChange" :current-page="page.number" :page-sizes="[10, 20, 30, 40]" :page-size="page.size" popper-class='page-pop' layout="total, slot, sizes, prev, pager, next" :total="page.total">
        </el-pagination>
      </el-col>
    </el-row>
    <!-- create Dialog -->
    <el-dialog :title='dialogTit' :visible.sync='dialogVisible' :show-close='false' :close-on-click-modal='false'>
      <div v-loading='dialogLoading' element-loading-spinner="el-icon-loading" element-loading-text="loading...">
        <el-form ref='form' size='small' :model='form' :rules='rules' label-width='130px'>
          <el-form-item label='ID' prop='id' v-if="dialogType == 'edit'">
            <el-input type="text" v-model='form.id' disabled></el-input>
          </el-form-item>
          <el-form-item label='Engine Name' prop='name'>
            <el-input type="text" v-model='form.name' placeholder='please input group name'></el-input>
          </el-form-item>
          <el-form-item label='Description' prop='description'>
            <el-input type="textarea" v-model='form.description' placeholder='please input group description'></el-input>
          </el-form-item>
          <el-form-item label='Is dl framework'>
            <el-switch v-model="form.is_dl_framework"></el-switch>
          </el-form-item>
          <el-form-item label='Is inference engine' prop='is_inference_engine'>
            <el-switch v-model="form.is_inference_engine"></el-switch>
          </el-form-item>
        </el-form>
        <div slot="footer" style='text-align: right;'>
          <el-button size='small' @click="closeDialog('form')">Cancel</el-button>
          <el-button size='small' type="primary" @click="submitForm('form')">Submit</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import Common from '../../../../static/js/common.js'
import Favicon from '../../../../static/img/favicon.png'
import { eiqList, eiqDetail } from '@/api/api'
import modelBlock from './block'
import publicJS from '../../../../static/js/public.js'
let thisVue = null

export default {
  data () {
    return {
      block: false,
      loading: true,
      icon: Favicon,
      filter_text: '',
      tableData: [],
      cur_id: null,
      page_list: true,
      page: {
        size: 10,
        total: 0,
        number: 1
      },
      form: {
        name: '',
        description: '',
        id: '',
        is_dl_framework: false,
        is_inference_engine: false
      },
      rules: {
        name: [{required: true, trigger: 'blur', message: 'customer name is required'}]
      },
      dialogTit: 'Create Engine',
      dialogVisible: false,
      dialogType: 'add',
      dialogLoading: false,
      params: {
        offset: 0,
        limit: 10,
        search: '',
        ordering: '-date_created'
      }
    }
  },
  methods: {
    getTable () {
      thisVue.loading = true
      thisVue.params.offset = thisVue.page.size * (thisVue.page.number - 1)
      thisVue.params.limit = thisVue.page.size
      thisVue.params.search = thisVue.filter_text
      eiqList('get', 'engine', thisVue.params).then(json => {
        // console.log(json.data.results)
        json.data.results.forEach((item) => {
          item.date_created = publicJS.timetrans(item.date_created)
          item.date_updated = publicJS.timetrans(item.date_updated)
          if (item.dataset == null) {
            item.dataset = 'Not yet, to create'
          }
        })
        // console.log(json.data.results)
        thisVue.tableData = json.data.results
        thisVue.page.total = json.data.count
        thisVue.loading = false
      }).catch(_ => {
        return false
      })
    },
    sortTable (column, prop, order) {
      if (column.prop === 'date_created' && column.order === 'descending') {
        thisVue.params.ordering = 'date_created'
      } else if (column.prop === 'date_created' && column.order !== 'descending') {
        thisVue.params.ordering = '-date_created'
      } else if (column.prop === 'date_updated' && column.order === 'descending') {
        thisVue.params.ordering = 'date_updated'
      } else {
        thisVue.params.ordering = '-date_updated'
      }
      thisVue.getTable()
    },
    delEngine (id) {
      thisVue.$confirm('Are you sure to delete this customer?', 'Delete Engine', {type: 'warning'}).then(_ => {
        thisVue.params.id = id
        eiqDetail('delete', 'engine', thisVue.params).then(json => {
          thisVue.$message({
            showClose: true,
            message: 'Delete successful',
            type: 'success'
          })
          thisVue.params.id = ''
          thisVue.getTable()
        }).catch(_ => {
          thisVue.$message({
            showClose: true,
            message: 'Delete failed',
            type: 'error'
          })
          return false
        })
      }).catch(_ => {
        return false
      })
    },
    submitForm (form) {
      let method = 'post'
      if (thisVue.dialogType === 'edit') {
        let {id} = thisVue.form
        thisVue.params.id = id
        method = 'put'
      }
      thisVue.params.name = thisVue.form.name
      thisVue.params.description = thisVue.form.description
      thisVue.params.is_dl_framework = thisVue.form.is_dl_framework
      thisVue.params.is_inference_engine = thisVue.form.is_inference_engine
      thisVue.$refs[form].validate(valid => {
        if (valid) {
          eiqDetail(method, 'engine', thisVue.params).then(json => {
            thisVue.engineType = json.data.results
            thisVue.params.name = ''
            thisVue.params.description = ''
            thisVue.params.id = ''
            thisVue.params.is_dl_framework = ''
            thisVue.params.is_inference_engine = ''
            thisVue.getTable()
            thisVue.dialogVisible = false
            if (method === 'put') {
              thisVue.$message({
                showClose: true,
                message: 'Modified success!',
                type: 'success'
              })
            } else {
              thisVue.$message({
                showClose: true,
                message: 'Create success!',
                type: 'success'
              })
            }
          }).catch(_ => {
            return false
          })
        }
      })
    },
    showDialog (type, val) {
      // console.log(thisVue.form)
      thisVue.dialogType = type
      thisVue.dialogVisible = true
      if (type === 'edit') {
        thisVue.dialogTit = 'Edit Engine'
        let {name, description, id, is_dl_framework, is_inference_engine} = val
        thisVue.form = {name, description, id, is_dl_framework, is_inference_engine}
      }
      // console.log(thisVue.form)
    },
    closeDialog (form) {
      thisVue.dialogVisible = false
      thisVue.form = {
        name: '',
        description: '',
        id: '',
        is_dl_framework: false,
        is_inference_engine: false
      }
      thisVue.$refs[form].resetFields()
      thisVue.dialogTit = 'Create Engine'
    },
    handleSelectionChange (val) {
      thisVue.deployDevIds.push(val.id)
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
    this.$nextTick(function () {
      let pageHeaderData = {
        'homeRouterName': 'home',
        'firstTitle': 'Engine',
        'firstRouterName': 'zoo_engine_list',
        'secondTitle': 'List'
      }
      // Common.setPageHeaderData(thisVue, pageHeaderData)
      thisVue.$store.dispatch('setPageHeaderData', pageHeaderData)
      thisVue.getTable()
    })
  },
  components: { modelBlock }
}
</script>
<style scoped>
  .opr-box{padding-bottom: 15px;}
  .search-input{width: 300px;margin-right: 10px;}
  .table-btn{padding: 0px;margin: 0px;}
  .el-select{width: 100%;}
  .filter-box .el-input{vertical-align: middle;}
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
  .page-type .el-button i{ padding-right:0;font-size:16px !important;}
  .solution-group .el-table__body-wrapper{overflow: hidden;}
  .solution-group .el-table thead th{padding: 5px 0px;background-color: #ebeef5;}
  .solution-group .el-button i{font-size: 14px;padding-right: 5px;}
  .upload-icon input{display: none;}
  .line-filter{ height: 30px;
    width: 1px;
    background: #dcdfe6;
    cursor: auto;
    display: inline-block;
    padding-right: 0;
    padding-left: 0;
    border: 0;}
  .line-filter:hover, .line-filter:active, .line-filter:visited { color: #fff;
    border-color: #fff;
    background-color: #dcdfe6;}
  .line-filter.mr10{ margin-right:10px;}
  .btn-filter{ }
  .btn-filter button{ height:32px;}
  .table-img{ float: right;}
</style>
