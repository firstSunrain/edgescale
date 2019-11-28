<template>
  <div class="zoo_box" v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading...">
    <el-row>
      <!-- <div class='frame-banner'>
        <div class='dash-item dash-item1' :class="{'active': showModel=='my'}" @click="getPublicModel('my')"><span>Private App</span></div>
        <div class='dash-item dash-item3' :class="{'active': showModel=='public'}" @click="getPublicModel('public')"><span>Public App</span></div>
      </div> -->
        <div class='page-filter'>
          <el-select size='small' class='common-input' placeholder='filter by solution...' v-model="solutionTypeIndex" @change="tabshow($event)">
            <el-option value="all" label='All models'></el-option>
            <el-option v-for="(item,index) in solutionType" :key='index' :value="index" :label='item.name'></el-option>
          </el-select>
          <el-input suffix-icon='el-icon-search' size='small' v-model='filter_text' class='common-input' @keyup.13.native='getTable(showModel)' placeholder='Search by name...'></el-input>
          <el-button class="common-btn search-btn" size='small' icon='icon-search4 text-size-bas' @click="getTable(showModel)">Search</el-button>
          <el-button class="line-filter"></el-button>
          <div class="btn-group">
            <el-button class="common-btn together-btn" size='small' icon='icon-googleplus5' @click="$router.push({name: 'zoo_app_create'})">Create</el-button>
          </div>
        </div>
      <div class="device-switch">
        <el-col class='page-type'>
          <el-button-group class="list-block-toggle">
            <el-button :class="{'active':page_list==true}" icon="icon-list2" size='mini' @click="page_list=true"></el-button>
            <el-button :class="{'active':page_list==false}" icon="icon-grid6" size='mini' @click="page_list=false"></el-button>
          </el-button-group>
        </el-col>
      </div>

      <div class="com-table">
        <el-table :data='tableData' size='small' v-if="page_list" @sort-change='sortTable'>
          <el-table-column label='Name'>
            <template slot-scope='scope'>
              <router-link :to="{name: 'zoo_app_detail', params: {id: scope.row.id, type: showModel}}">{{scope.row.name}}</router-link>
            </template>
          </el-table-column>
          <el-table-column prop='model_name' label='Model'></el-table-column>
          <el-table-column prop='engine_name' label='Engine'></el-table-column>
          <el-table-column label='Base image'>
            <template slot-scope='scope'>
              <a v-if="scope.row.href" :href="scope.row.base_docker_url">{{ scope.row.base_docker_url }}</a>
              <div v-else>{{ scope.row.base_docker_url }}</div>
            </template>
          </el-table-column>
          <el-table-column prop='depolyed_docker_url' label='Depolyed image'></el-table-column>
          <el-table-column label='Status'>
            <template slot-scope='scope'>
              <span class="status-private" v-if="scope.row.status === 1" type='info' :loading="true">In progress</span>
              <span class="status-on" v-else-if="scope.row.status === 2" :loading="true">Successful</span>
              <span class="status-offs" v-else-if="scope.row.status === 3" :loading="true">Failed</span>
            </template>
          </el-table-column>
          <el-table-column sortable='true' prop='date_created' label='Date created'></el-table-column>
          <el-table-column label='Action' width='130'>
            <template slot-scope='scope'>
              <el-tooltip effect="dark" content="upload" placement="top" class="icon-btn-container">
                <i class='table-btn icon-upload4' @click="showDialog(scope.row)"></i>
              </el-tooltip>
              <el-tooltip effect="dark" content="edit" placement="top" class="icon-btn-container">
                <i class='table-btn icon-pencil5' @click="showDialog2(scope.row)"></i>
              </el-tooltip>
              <el-tooltip effect="dark" content="delete" placement="top" class="icon-btn-container">
                <i class='table-btn icon-trash' @click="del(scope.row.id)" v-show="user_type === 'ADMIN' || showModel === 'my'"></i>
              </el-tooltip>
              <el-tooltip effect="dark" content="rebuild" placement="top" class="icon-btn-container">
                <i class='table-btn iconfont icon-rebuild' @click="again(scope.row.id, 'again')" v-show="scope.row.status == 3"></i>
              </el-tooltip>
              <el-tooltip effect="dark" content="download" placement="top" class="icon-btn-container">
                <i v-show="scope.row.base_docker_url !== null && scope.row.base_docker_url !== '' && scope.row.base_docker_url !== undefined"
                   class='table-btn iconfont icon-downloadLog' @click='download(scope.row.base_docker_url)'>
                </i>
              </el-tooltip>
              <el-tooltip effect="dark" content="deploy" placement="top" class="icon-btn-container">
                <i v-show="(scope.row.base_docker_url !== null && scope.row.base_docker_url !== '' && scope.row.base_docker_url !== undefined) || (scope.row.depolyed_docker_url !== null && scope.row.depolyed_docker_url !== '' && scope.row.depolyed_docker_url !== undefined)"
                   class='table-btn iconfont icon-deployment' @click="deploy(scope.row)">
                </i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <modelBlock :list='tableData' :user_type='user_type' :showModel='showModel' @delCustomer='del' v-else></modelBlock>
      </div>
      <div class="common-page">
        <el-pagination background @current-change="handleCurrentChange"  @size-change="handleSizeChange" :current-page="page.number" :page-sizes="[10, 20, 30, 40]" :page-size="page.size" popper-class='page-pop' layout="total, slot, sizes, prev, pager, next" :total="page.total">
        </el-pagination>
      </div>
    </el-row>

    <!-- create Dialog -->
    <el-dialog title='Upload' :visible.sync='dialogVisible' :show-close='true' :close-on-click-modal='false'>
      <div v-loading='dialogLoading' element-loading-spinner="el-icon-loading" element-loading-text="loading...">
        <el-form ref='form' size='small' :model='form' :rules='rules' label-width='170px'>
          <p>Please input your deploy docker image name, note that by default only hub.docker.com is supported.</p>
          <el-form-item label='Name' prop='name'>
            <el-input type="text" disabled v-model='form.name'></el-input>
          </el-form-item>
          <el-form-item label='Upload Depolyed Docker' prop='depolyed_docker_url'>
            <el-input v-model='form.depolyed_docker_url'></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" style='text-align: right;'>
          <el-button size='small' @click="closeDialog('form')">Cancel</el-button>
          <el-button size='small' type="primary" @click="submitForm('form')">Submit</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- update Dialog -->
    <el-dialog class="update-layer" title='update' :visible.sync='dialogVisible2' :show-close='true' :close-on-click-modal='false' width="40%">
      <div v-loading='dialogLoading' element-loading-spinner="el-icon-loading" element-loading-text="loading...">
        <el-form ref='form' size='small' :model='form' :rules='rules' label-width='130px'>
          <!-- <el-form-item label='Id' prop='id'>
            <el-input type="text" disabled v-model='form.id'></el-input>
          </el-form-item> -->
          <el-form-item label='Name' prop='name'>
            <el-input type="text" disabled v-model='form.name'></el-input>
          </el-form-item>
          <el-form-item prop='model' label='Model'>
            <el-select v-model='form.model' placeholder='select Model'>
              <el-option v-for="item in modelList" :key='item.id' :value="item.id" :label='item.name'></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop='engine' label='ML Framework'>
            <el-select v-model='form.engine' placeholder='select Engine'>
              <el-option v-for="item in engineList" :key='item.id' :value="item.id" :label='item.name'></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop='device' label='Device'>
            <el-select v-model='form.device' placeholder='select device'>
              <el-option v-for="item in deviceList" :key='item.id' :value="item.id" :label='item.name'></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" style='text-align: right;'>
          <el-button size='small' @click="closeDialog('form')">Cancel</el-button>
          <el-button size='small' type="primary" @click="submitForm2('form')">Submit</el-button>
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
import Cookie from '../../../../static/js/cookie'
import store from '../../../store/index.js'
let thisVue = null

export default {
  data () {
    return {
      loading: true,
      icon: Favicon,
      filter_text: '',
      tableData: [],
      cur_id: null,
      page_list: true,
      solutionType: [],
      solutionTypeIndex: '',
      page: {
        size: 10,
        total: 0,
        number: 1
      },
      params: {
        id: '',
        offset: '',
        limit: '',
        search: '',
        type: '',
        ordering: '-date_created',
        attribute: '',
        is_public: false
      },
      user_type: '',
      form: {
        id: null,
        name: null,
        description: null,
        engine: null,
        model: null,
        depolyed_docker_url: null,
        device: null
      },
      solutionList: '',
      attributeList: '',
      deviceList: '',
      modelList: '',
      engineList: '',
      datasetList: '',
      active: 1,
      rules: {
        name: [{required: true, trigger: 'blur', message: 'customer name is required'}, { min: 2, max: 60, message: 'Names should not exceed 60 words', trigger: 'blur' }],
        model: [{required: true, trigger: 'change', message: 'select Model is model'}],
        engine: [{required: true, trigger: 'change', message: 'select Engine is engine'}],
        device: [{required: true, trigger: 'change', message: 'select Device is device'}]
      },
      noAttribute: true,
      noModel: true,
      noDataset: true,
      selectLevel: 0,
      dialogLoading: false,
      dialogVisible: false,
      dialogVisible2: false,
      showModel: 'my'
    }
  },
  methods: {
    getTable () {
      thisVue.loading = true
      thisVue.params.search = thisVue.filter_text
      thisVue.params.offset = thisVue.page.size * (thisVue.page.number - 1)
      thisVue.params.limit = thisVue.page.size
      eiqList('get', 'app', thisVue.params).then(json => {
        json.data.results.forEach((item) => {
          if (item.base_docker_url !== null && item.base_docker_url !== '' && item.base_docker_url !== undefined) {
            if (item.base_docker_url.split('/')[0] === 'output') {
              item.base_docker_url = 'https://eiq-cloud.s3.amazonaws.com/' + item.base_docker_url
              item.href = true
            } else {
              item.href = false
            }
          }
          item.date_created = publicJS.timetrans(item.date_created)
          item.date_updated = publicJS.timetrans(item.date_updated)
        })
        console.log(json.data.results)
        thisVue.tableData = json.data.results
        thisVue.page.total = json.data.count
        thisVue.loading = false
      }).catch(_ => {
        return false
      })
    },
    getPermission () {
      store.dispatch('getUserPermission').then(_ => {
        // thisVue.user_type = 'ADMIN' // 开发使用
        if (store.state.userPermission.is_admin) {
          thisVue.user_type = 'ADMIN'
        } else {
          thisVue.user_type = store.state.userPermission.account_type.name
        }
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
      thisVue.getTable(thisVue.showModel)
    },
    download (url) {
      thisVue.$alert('please use the docker command locally to download the corresponding docker image "docker pull ' + url + '" via hub.docker.com')
      // thisVue.$confirm('please use the docker command locally to download the corresponding docker image "' + url + '" via hub.docker.com', {type: 'info'}, 'ok111').then(_ => {
      //   window.open(url, '_self')
      // }).catch(_ => {
      //   return false
      // })
    },
    del (id) {
      thisVue.$confirm('Are you sure to delete this APP?', 'Delete APP', {type: 'warning'}).then(_ => {
        eiqDetail('delete', 'app', {id: id}).then(json => {
          thisVue.$message({
            showClose: true,
            message: 'Delete successful',
            type: 'success'
          })
          thisVue.getTable(thisVue.showModel)
        }).catch(_ => {
          thisVue.$message({
            showClose: true,
            message: 'Delete failed',
            type: 'success'
          })
          return false
        })
      }).catch(_ => {
        return false
      })
    },
    again (id, state) {
      thisVue.$router.push({name: 'zoo_app_detail', params: {id: id, type: thisVue.showModel, active: state}})
    },
    handleSelectionChange (val) {
      thisVue.deployDevIds.push(val.id)
    },
    deploy (app) {
      console.log(app)
      if (app.depolyed_docker_url === null) {
        eiqDetail('patch', 'app', {id: app.id, depolyed_docker_url: app.base_docker_url}).then(json => {
          console.log(app.base_docker_url)
        }).catch(_ => {
          thisVue.$message({
            showClose: true,
            message: 'deploy failed',
            type: 'error'
          })
          return false
        })
      }
      if (app.distro === 3) {
        thisVue.$router.push({name: 'software_solution_deploy_select_devices', params: {id: app.id}})
      } else {
        thisVue.$router.push({name: 'software_app_deploy_device_list', query: {name: app.name, applicaion_id: app.id}})
      }
    },
    handleCurrentChange (val) {
      // console.log(val)
      thisVue.page.number = val
      thisVue.getTable()
    },
    handleSizeChange (val) {
      // console.log(val)
      thisVue.page.size = val
      thisVue.getTable()
    },
    tabshow (e) {
      if (e === 'all') {
        thisVue.params.type = ''
      } else {
        thisVue.solutionTypeIndex = e
        thisVue.params.type = thisVue.solutionType[thisVue.solutionTypeIndex].id
      }
      thisVue.getTable(thisVue.showModel)
    },
    searchName (obj, val) {
      if (val === null) {
        return null
      } else {
        for (let i = 0; i < obj.length; i++) {
          if (obj[i].id === val) {
            // console.log(obj[i].name)
            return obj[i].name
          }
        }
      }
    },
    // getPublicModel (param) {
    //   if (param === 'my') {
    //     thisVue.showModel = 'my'
    //   } else {
    //     thisVue.showModel = 'public'
    //   }
    //   thisVue.getTable(thisVue.showModel)
    // },
    showDialog (val) {
      thisVue.dialogVisible = true
      // console.log(val)
      let {id, name, depolyed_docker_url} = val
      thisVue.form = {id, name, depolyed_docker_url}
    },
    showDialog2 (val) {
      thisVue.dialogVisible2 = true
      console.log(val)
      let {id, name, model, engine, device} = val
      thisVue.form = {id, name, model, engine, device}
      console.log(thisVue.form)
    },
    closeDialog (form) {
      thisVue.dialogVisible = false
      thisVue.dialogVisible2 = false
      thisVue.$refs[form].resetFields()
    },
    getImgUrl (data) {
      thisVue.form.depolyed_docker_url = data
    },
    getDevice () {
      eiqList('get', 'device', {}).then(json => {
        // console.log(json.data.results)
        thisVue.deviceList = []
        thisVue.deviceList.push(json.data.results[2])
        thisVue.loading = false
      }).catch(_ => {
        return false
      })
    },
    getModel () {
      eiqList('get', 'model', {}).then(json => {
        // console.log(json.data.results)
        thisVue.modelList = json.data.results
        eiqList('get', 'pre_trained_model', {}).then(json => {
          // console.log(json.data.results)
          json.data.results.forEach(function (value) {
            thisVue.modelList.push(value)
          })
          // console.log(thisVue.modelList)
        }).catch(_ => {
          return false
        })
      }).catch(_ => {
        return false
      })
    },
    getTraEngine () {
      thisVue.loading = true
      // thisVue.selectLevel = 3
      eiqList('get', 'engine', thisVue.params).then(json => {
        // console.log(json.data.results)
        thisVue.engineList = json.data.results
        // console.log(thisVue.engineList)
        thisVue.loading = false
      }).catch(_ => {
        thisVue.loading = false
        return false
      })
    },
    submitForm2 (form) {
      thisVue.$refs[form].validate(valid => {
        if (valid) {
          eiqDetail('patch', 'app', {id: thisVue.form.id, model: thisVue.form.model, engine: thisVue.form.engine, device: thisVue.form.device}).then(json => {
            console.log(json.data)
            thisVue.getTable()
            thisVue.dialogVisible2 = false
            thisVue.$message({
              showClose: true,
              message: 'Modified success!',
              type: 'success'
            })
            thisVue.selectLevel = 0
          }).catch(_ => {
            return false
          })
        }
      })
    },
    submitForm (form) {
      thisVue.$refs[form].validate(valid => {
        if (valid) {
          eiqDetail('patch', 'app', {id: thisVue.form.id, depolyed_docker_url: thisVue.form.depolyed_docker_url}).then(json => {
            console.log(json.data)
            thisVue.getTable()
            thisVue.dialogVisible = false
            thisVue.$message({
              showClose: true,
              message: 'Modified success!',
              type: 'success'
            })
            thisVue.selectLevel = 0
          }).catch(_ => {
            return false
          })
        }
      })
    }
  },
  mounted () {
    thisVue = this
    thisVue.$nextTick(function () {
      let pageHeaderData = {
        'homeRouterName': 'home',
        'firstTitle': 'APP',
        'firstRouterName': 'zoo_app_list',
        'secondTitle': 'List'
      }
      // Common.setPageHeaderData(thisVue, pageHeaderData)
      thisVue.$store.dispatch('setPageHeaderData', pageHeaderData)
      thisVue.getTable()
      thisVue.getModel()
      thisVue.getTraEngine()
      thisVue.getDevice()
      thisVue.username = Cookie.getCookie('username')
      if (thisVue.username) {
        thisVue.getPermission()
      }
    })
  },
  components: { modelBlock }
}
</script>
<style scoped>
  .opr-box{ }
  .search-input{width: 300px;margin-right: 10px;}
  .table-btn{padding: 0px;margin: 0px;}
  .filter-box .el-input{vertical-align: middle;}
  .filter-box div.search-input,.filter-box button,.filter-box btn-filter{ float:left;height:32px;margin-bottom:15px;}
  .page-type{ margin-top:3px; text-align: right;}
  .page-type .el-button{margin:4px;padding: 0px; color: #aaa;
    border-color: #fff;
    background-color: #fff;}
  .page-type .el-button:focus,.page-type .el-button.active {
    color: #333;
    border-color: #fff;
    background-color: #fff;
  }
  .frame-banner{ padding-left: 10px;margin: -20px -20px 20px;background: #fff;box-shadow:0 1px 0 0 #cbd7e2;}
  .frame-banner .dash-item{ display:inline-block; margin: 0 15px -1px; padding: 17px 2px; cursor: pointer; border-bottom: 2px solid rgba(0,0,0,0);font-size:14px;color: #223c53;}
  .frame-banner .dash-item.active{ border-bottom: 2px solid #223c53;font-weight: bold;}
  .frame-banner .dash-item:hover{ border-bottom: 2px solid #223c53;}
  .update-layer .el-select{ width: 100%;}
</style>
<style>
  .page-type .el-button i{ padding-right:0;font-size:16px !important;}
  .icon-btn-container .el-button i{ font-size:16px;}
  .icon-btn-container i, .icon-btn-container.icon-downloadLog{ color:#223c53;font-size:16px;}
  .icon-btn-container i:hover, .icon-btn-container.icon-downloadLog:hover{ color:#5ca3e2;}
  .icon-btn-container.icon-downloadLog{ position:relative;top:1px;}
  .black{ color:black}
</style>
