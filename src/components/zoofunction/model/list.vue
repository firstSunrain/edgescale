<template>
  <div class="zoo_box" v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading...">
     <!-- <div class='com-tit'>Model List</div> -->
     <div class='frame-banner'>
      <div class='dash-item dash-item1' :class="{'active': showModel=='my'}" @click="getPublicModel('my')"><span>{{ $t('model') }}</span></div>
      <div class='dash-item dash-item3' :class="{'active': showModel=='public'}" @click="getPublicModel('public')"><span>Model orders</span></div>
    </div>
    <el-row v-show="showModel=='my'">
        <div class='page-filter'>
          <el-select size='small' class='common-input' placeholder='filter by solution...' v-model="solutionTypeIndex" @change="tabshow($event)">
            <el-option value="all" label='All models'></el-option>
            <el-option v-for="(item,index) in solutionType" :key='index' :value="index" :label='item.name'></el-option>
          </el-select>
          <el-input suffix-icon='el-icon-search' size='small' v-model='filter_text' class='common-input' @keyup.13.native='getTable(showModel)' placeholder='Search by name...'></el-input>
          <el-button class="common-btn search-btn" size='small' icon='icon-search4 text-size-base' @click="getTable(showModel)">Search</el-button>
          <el-button class="line-filter"></el-button>
          <div class="btn-group">
            <el-button class="common-btn together-btn" size='small' icon='icon-googleplus5' v-if="showModel === 'my' || user_type === 'ADMIN'" @click="$router.push({name: 'zoo_create'})">Create</el-button>
            <!-- <el-button size='small' icon='icon-spinner11' @click="getTable">Refresh</el-button> -->
            <el-button class="common-btn together-btn" size='small' icon='icon-upload4' @click="$router.push({name: 'zoo_uploadModel'})">Upload</el-button>
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
              <router-link :to="{name: 'zoo_detail', params: {id: scope.row.id, type: showModel}}">{{scope.row.name}}</router-link>
            </template>
          </el-table-column>
          <el-table-column label='Description'>
            <template slot-scope='scope'>
              <a :href="'https://eiq-cloud.s3.amazonaws.com/' + scope.row.description" target='_blank'>{{scope.row.description}}</a>
            </template>
          </el-table-column>
          <el-table-column prop='attribute' label='Architecture'></el-table-column>
          <el-table-column prop='base_model_name' label='Model Base' v-if="showModel === 'my'"></el-table-column>
          <el-table-column prop='type_name' label='Solution'></el-table-column>
          <el-table-column prop='training_engine_name' label='ML Framework' v-if="showModel === 'my'"></el-table-column>
          <el-table-column label='Training Status' v-if="showModel === 'my'">
            <template slot-scope='scope'>
              <span class="status-scheduled" v-if="scope.row.status === 0" :to="{name: 'zoo_detail', params: {id: scope.row.id}}">Pending</span>
              <span class="status-new" v-else-if="scope.row.status === 1" :to="{name: 'zoo_detail', params: {id: scope.row.id}}">In progress</span>
              <span class="status-on" v-else-if="scope.row.status === 2" :to="{name: 'zoo_detail', params: {id: scope.row.id}}">Successful</span>
              <span class="status-off" v-else-if="scope.row.status === 3" :to="{name: 'zoo_detail', params: {id: scope.row.id}}">Failed</span>
              <span class="status-lowershelf" v-else :to="{name: 'zoo_detail', params: {id: scope.row.id}}">Untrained</span>
            </template>
          </el-table-column>
          <el-table-column label='Apply Status' v-if="showModel === 'my'">
            <template slot-scope='scope'>
              <div v-if="scope.row.trade_status === 0" style="display: none;">
                <span class="status-private">Publish</span>
                <i class="icon-notification2 icon-bg-gray" @click="toMarket(scope.row)"></i>
              </div>
              <div v-else-if="scope.row.trade_status === 1">
                <span class="status-scheduled" :loading="true">Auditing</span>
                <i class="icon-notification2 icon-bg-gray" @click="toMarket(scope.row)"></i>
              </div>
              <div v-else-if="scope.row.trade_status === 2">
                <span class="status-on">Audit Pass</span>
                <i class="icon-notification2 icon-bg-gray" @click="toMarket(scope.row)"></i>
              </div>
              <div v-else type='danger'>
                <span class="status-off">Audit Failed</span>
                <i class="icon-notification2 icon-bg-gray" @click="toMarket(scope.row)"></i>
              </div>
            </template>
          </el-table-column>
          <el-table-column sortable='true' prop='date_created' label='Date created' width="130"></el-table-column>
          <el-table-column label='Action' width='140'>
            <template slot-scope='scope'>
              <el-tooltip effect="dark" v-if="scope.row.status !== 3" content="download model" placement="top" class="icon-btn-container">
                <a v-show="scope.row.url !== null && scope.row.url !== '' && scope.row.url !== undefined"
                   :href='scope.row.url' class='table-btn icon-download4'>
                </a>
                <!--<el-button  class='table-btn' type='text'-->
                            <!--v-show="scope.row.url !== null && scope.row.url !== '' && scope.row.url !== undefined"-->
                            <!--@click='download(scope.row.url)' icon='icon-download4'>-->
                <!--</el-button>-->
              </el-tooltip>
              <el-tooltip effect="dark" content="edit" placement="top" class="icon-btn-container">
                <i class='table-btn icon-pencil5' v-show="user_type === 'ADMIN'" @click="showDialog(scope.row)"></i>
              </el-tooltip>
              <el-tooltip effect="dark" content="delete" placement="top" class="icon-btn-container">
                <i class='table-btn icon-trash' @click="del(scope.row.id, showModel)" v-show="user_type === 'ADMIN' || showModel === 'my'"></i>
              </el-tooltip>
              
              <el-tooltip effect="dark" v-show="scope.row.status !== 3" content="download log" placement="top" class="icon-btn-container">
                <i v-show="(scope.row.status == 2 || scope.row.status == 3) && scope.row.t_full_log_url !== null && scope.row.t_full_log_url !== '' && scope.row.t_full_log_url !== undefined && (user_type === 'ADMIN' || showModel === 'my')"
                   class='table-btn iconfont icon-downloadLog'
                   @click='download(scope.row.t_full_log_url)'>
                </i>
              </el-tooltip>

              <el-tooltip effect="dark" v-show="scope.row.status !== 3" content="Publish" placement="top">
                <i class='table-btn icon-esc' v-if="scope.row.trade_status === 0" @click="toMarket(scope.row)"></i>
              </el-tooltip>
              <el-tooltip effect="dark" v-show="scope.row.status === 3"  class="icon-btn-container" content="rebuild" placement="top">
                <i class='table-btn iconfont icon-rebuild' v-if="scope.row.trade_status === 0" @click="$router.push({name: 'zoo_detail', params: {id: scope.row.id, type: showModel}})"></i>
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

    <el-row v-show="showModel=='public'">
        <div class="page-filter">
          <el-select size='small' class='common-input' placeholder='filter by solution...' v-model="solutionTypeIndex" @change="tabshow($event)">
            <el-option value="all" label='All models'></el-option>
            <el-option v-for="(item,index) in solutionType" :key='index' :value="index" :label='item.name'></el-option>
          </el-select>
          <el-input class='common-input' suffix-icon='el-icon-search' size='small' v-model='filter_text_order' @keyup.13.native='getTable(showModel)' placeholder='Search by name...'></el-input>
          <el-button class="common-btn search-btn" size='small' icon='icon-search4 text-size-base' @click="getTable(showModel)">Search</el-button>
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
              <router-link :to="{name: 'zoo_detail', params: {id: scope.row.id, type: showModel}}">{{scope.row.m_name}}</router-link>
            </template>
          </el-table-column>
          <el-table-column label='Description'>
            <template slot-scope='scope'>
              <router-link tag="a" target='_blank' :to="'https://eiq-cloud.s3.amazonaws.com/' + scope.row.m_description">{{scope.row.m_description}}</router-link>
              <!-- <a :href="'https://eiq-cloud.s3.amazonaws.com/' + scope.row.m_description" target='_blank'>{{scope.row.m_description}}</a> -->
            </template>
          </el-table-column>
          <el-table-column prop='m_type_name' label='Solution'></el-table-column>
          <el-table-column prop='m_publisher' label='Publisher'></el-table-column>
          <el-table-column prop='m_network' label='Network'></el-table-column>
          <el-table-column sortable='true' prop='date_created' label='Date created'></el-table-column>
          <el-table-column label='Action' width='120'>
            <template slot-scope='scope'>
              <!-- <el-tooltip effect="dark" content="download model" placement="top" class="icon-btn-container">
                <el-button  class='table-btn' type='text' v-show="scope.row.url !== null && scope.row.url !== '' && scope.row.url !== undefined" @click='download(scope.row.url)' icon='icon-download4'></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="edit" placement="top" class="icon-btn-container">
                <el-button class='table-btn' v-show="user_type === 'ADMIN'" type='text' icon='icon-pencil5' @click="showDialog(scope.row)"></el-button>
              </el-tooltip> -->
              <el-tooltip effect="dark" content="delete" placement="top" class="icon-btn-container">
                <el-button class='table-btn btn-red' type='text' icon='icon-trash' @click="del(scope.row.id, showModel)"></el-button>
              </el-tooltip>
              <!-- <el-tooltip effect="dark" content="download log" placement="top" class="icon-btn-container">
                <el-button v-show="(scope.row.status == 2 || scope.row.status == 3) && scope.row.t_full_log_url !== null && scope.row.t_full_log_url !== '' && scope.row.t_full_log_url !== undefined && (user_type === 'ADMIN' || showModel === 'my')" class='table-btn iconfont icon-downloadLog' type='text' @click='download(scope.row.t_full_log_url)'></el-button>
              </el-tooltip> -->
            </template>
          </el-table-column>
        </el-table>
        <modelBlock :list='tableData' :user_type='user_type' :showModel='showModel' @delCustomer='del' v-else></modelBlock>
      </div>
      <div class='common-page'>
        <el-pagination background @current-change="handleCurrentChange"  @size-change="handleSizeChange" :current-page="page.number" :page-sizes="[10, 20, 30, 40]" :page-size="page.size" popper-class='page-pop' layout="total, slot, sizes, prev, pager, next" :total="page.total">
        </el-pagination>
      </div>
    </el-row>
    <!-- Edit Dialog -->
    <el-dialog title='Edit Dialog' :visible.sync='dialogVisible' :show-close='true' :close-on-click-modal='false'>
      <div v-loading='dialogLoading' element-loading-spinner="el-icon-loading" element-loading-text="loading...">
        <el-form ref='form' size='small' :model='form' :rules='rules' label-width='130px'>
          <div class='step-box'>
            <el-form-item label='ID' prop='id'>
              <el-input type="text" v-model='form.id' disabled></el-input>
            </el-form-item>
            <el-form-item prop='name' label='Name'>
              <el-input v-model='form.name' size='small' placeholder='please input model name'></el-input>
            </el-form-item>
            <el-form-item prop='type_name' label='Solution'>
              <el-select v-model='form.type_name' placeholder='select solution' size='small' @change="getAttribute($event)">
                <el-option v-for="(item,index) in solutionList" :key='index' :value="index" :label='item.name'></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop='attribute' label='attributeSelect' v-if='selectLevel == 1 && noAttribute == false'>
              <el-select v-model='form.attribute' placeholder='select attribute' size='small' @change="getPreModel($event)">
                <el-option v-for="(item,index) in attributeList" :key='index' :value="index" :label='item'></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop='attribute' label='attribute' v-if='selectLevel == 1 && noAttribute == false'>
              <el-input size="small" v-model="form.attributeTXT" placeholder='please input Model attribute'></el-input>
            </el-form-item>
            <el-form-item prop='attribute' label='attribute' v-if='selectLevel == 1 && noAttribute'>
              <el-input size="small" v-model="form.attributeTXT" placeholder='please input Model attribute'></el-input>
            </el-form-item>
            <el-form-item prop='model' label='Pre-trained Model' v-if='selectLevel == 1 && noModel == false'>
              <el-select v-model='form.model' placeholder='select Pre-trained Model' size='small'>
                <el-option v-for="(item,index) in modelList" :key='index' :value="index" :label='item.name'></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop='model' label='Pre-trained Model' v-if='selectLevel == 1 && noModel'>
              <div>The 'Solution' is not 'Pre-trained Model'. Please re-select it.</div>
            </el-form-item>
            <!-- <el-form-item prop='trainingID' label='ML Framework' v-if='selectLevel >= 3 && noTraining == false'>
              <el-input v-model='form.training.name' size='small' :disabled="true"></el-input>
            </el-form-item> -->
            <el-form-item prop='dataset' label='Dataset' v-if='selectLevel == 1 && noDataset == false'>
              <el-select v-model='form.dataset' placeholder='select dataset' size='small'>
                <el-option v-for="(item,index) in datasetList" :key='index' :value="index" :label='item.name'></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop='dataset' label='Dataset' v-if='noDataset'>
              <div>The 'Solution' is not 'dataset'. Please re-select it.</div>
            </el-form-item>
            <el-form-item prop='training' label='ML Framework' v-if='selectLevel == 1 && noTraining == false'>
              <el-select v-model='form.training' placeholder='select ML Framework' size='small'>
                <el-option v-for="(item,index) in trainingList" :key='index' :value="index" :label='item.name'></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop='training' label='ML Framework' v-if='selectLevel == 1 && noTraining'>
              <div>The 'Pre-trained Model' is not 'ML Framework'. Please re-select it.</div>
            </el-form-item>
            <!-- <el-form-item prop='description' label='Description'>
              <el-input v-model='form.description' type='textarea' size='small' placeholder='please input description'></el-input>
            </el-form-item> -->
            <el-form-item label='Description'>
              <el-radio v-model="codeUrl" label="1">Input</el-radio>
              <el-radio v-model="codeUrl" label="2">Upload</el-radio>
              <el-input  v-if="codeUrl == 1" size='small' v-model='form.description' placeholder='please input gitHub address'></el-input>
              <uploadImg v-else :uploadParams="{type: 'eiq', username}" @imgUrl='getFileUrlCode'></uploadImg>
            </el-form-item>
            <el-form-item prop='size' label='Size'>
              <el-input v-model='form.size' type='textarea' size='small' placeholder='please input size'></el-input>
            </el-form-item>
            <el-form-item prop='accuracy' label='Accuracy'>
              <el-input v-model='form.accuracy' type='textarea' size='small' placeholder='please input accuracy'></el-input>
            </el-form-item>
            <el-form-item prop='license' label='License'>
              <el-input v-model='form.license' type='textarea' size='small' placeholder='please input license'></el-input>
            </el-form-item>
            <el-form-item prop='is_public' label='Is public'>
              <el-switch  v-model="form.is_public"></el-switch>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" style='text-align: right;'>
          <el-button size='small' @click="closeDialog('form')">Cancel</el-button>
          <el-button size='small' type="primary" @click="submitForm('form')">Submit</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog title='Publish' :visible.sync='dialogMaket' :show-close='true' :close-on-click-modal='false'>
      <el-form ref='formPrice' size='small' :model='formPrice' :rules='rulesP' label-width='60px'>
        <el-form-item prop='price' label='Price'>
          <el-input-number disabled=disabled v-model="formPrice.price" :min="0"></el-input-number>
          <p style="color:red">currently could not set.</p>
        </el-form-item>
      </el-form>
      <div slot="footer" style='text-align: right;'>
        <el-button size='small' @click="closeDialogPrice('formPrice')">Cancel</el-button>
        <el-button size='small' type="primary" @click="submitPrice('formPrice')">Submit</el-button>
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
import uploadImg from './commonUpload'
let thisVue = null

export default {
  data () {
    return {
      loading: true,
      icon: Favicon,
      filter_text: '',
      filter_text_order: '',
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
        type: null,
        type_name: null,
        attribute: null,
        model: null,
        trainingObj: {
          description: null,
          id: null,
          name: null
        },
        training: null,
        dataset: null,
        is_public: false,
        size: null,
        license: null,
        accuracy: null
      },
      solutionList: '',
      attributeList: '',
      modelList: '',
      trainingList: '',
      datasetList: '',
      active: 1,
      rules: {
        name: [{required: true, trigger: 'blur', message: 'customer name is required'}, { min: 2, max: 60, message: 'Names should not exceed 60 words', trigger: 'blur' }]
      },
      rulesP: {
        price: [{required: true, trigger: 'blur', message: 'commodity price is required'}]
      },
      getFileUrlCode (data) {
        thisVue.form.description = data
      },
      noAttribute: true,
      noTraining: true,
      noModel: true,
      noDataset: true,
      selectLevel: 0,
      dialogLoading: false,
      dialogVisible: false,
      showModel: 'my',
      dialogMaket: false,
      formPrice: {
        id: null,
        price: 0
      },
      codeUrl: '1'
    }
  },
  methods: {
    getTable (isMy) {
      // console.log(isMy)
      isMy = isMy || 'my'
      thisVue.loading = true
      thisVue.params.is_public = ''
      thisVue.params.attribute = ''
      thisVue.params.id = ''
      let API = 'model'
      if (isMy === 'my') {
        API = 'model'
        thisVue.params.search = thisVue.filter_text
      } else {
        API = 'order_model'
        thisVue.params.search = thisVue.filter_text_order
      }
      // console.log(thisVue.params)
      eiqList('get', API, thisVue.params).then(json => {
        json.data.results.forEach((item) => {
          if (item.url !== null && item.url !== '' && item.url !== undefined) {
            item.url = 'https://eiq-cloud.s3.amazonaws.com/' + item.url
          }
          if (item.t_full_log_url !== null && item.t_full_log_url !== '' && item.t_full_log_url !== undefined) {
            item.t_full_log_url = 'https://eiq-cloud.s3.amazonaws.com/' + item.t_full_log_url
          }
          item.date_created = publicJS.timetrans(item.date_created)
          item.date_updated = publicJS.timetrans(item.date_updated)
        })
        thisVue.tableData = json.data.results
        thisVue.page.total = json.data.count
        console.log(json.data.results)
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
      thisVue.$confirm('Do you want to download', 'Download Item', {type: 'info'}).then(_ => {
        window.open(url, '_self')
      }).catch(_ => {
        return false
      })
    },
    del (id, type) {
      thisVue.$confirm('Are you sure to delete this model?', 'Delete Model', {type: 'warning'}).then(_ => {
        thisVue.params.id = id
        let API = 'model'
        if (type === 'my') {
          API = 'model'
        } else {
          API = 'order_model'
        }
        eiqDetail('delete', API, thisVue.params).then(json => {
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
    handleSelectionChange (val) {
      thisVue.deployDevIds.push(val.id)
    },
    handleCurrentChange (val) {
      // console.log(val)
      thisVue.page.number = val
      thisVue.getSolution()
    },
    handleSizeChange (val) {
      // console.log(val)
      thisVue.page.size = val
      thisVue.getSolution()
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
    getSolution () {
      thisVue.params.offset = thisVue.page.size * (thisVue.page.number - 1)
      thisVue.params.limit = thisVue.page.size
      eiqList('get', 'solution', thisVue.params).then(json => {
        // console.log(json.data.results)
        thisVue.solutionType = json.data.results
        thisVue.solutionList = json.data.results
        thisVue.getTable(thisVue.showModel)
      }).catch(_ => {
        return false
      })
      thisVue.getDataset()
    },
    getAttribute (e) {
      thisVue.loading = true
      thisVue.selectLevel = 1
      thisVue.form.attribute = null
      thisVue.form.trainingID = null
      thisVue.form.type = thisVue.solutionList[e].id
      thisVue.params.type = thisVue.solutionList[e].id
      let API = 'model'
      if (thisVue.showModel === 'my') {
        API = 'model'
        thisVue.params.is_public = false
      } else {
        API = 'pre_trained_model'
        thisVue.params.is_public = true
      }
      // console.log(API)
      eiqList('get', API, thisVue.params).then(json => {
        // console.log(json.data.results)
        let attributeList = []
        json.data.results.forEach((item) => {
          if (item.attribute === '' || item.attribute === null) {
            return false
          } else {
            attributeList.push(item.attribute)
          }
        })
        attributeList = Array.from(new Set(attributeList))
        thisVue.attributeList = attributeList
        thisVue.loading = false
        // console.log(thisVue.attributeList)
        if (thisVue.attributeList.length === 0) {
          thisVue.noAttribute = true
        } else {
          thisVue.noAttribute = false
        }
      }).catch(_ => {
        thisVue.loading = false
        return false
      })
      thisVue.getTraEngine()
    },
    getPreModel (e) {
      thisVue.loading = true
      // thisVue.selectLevel = 2
      thisVue.form.model = null
      thisVue.form.trainingID = null
      thisVue.params.attribute = thisVue.attributeList[e]
      thisVue.form.attributeTXT = thisVue.attributeList[e]
      // console.log(thisVue.attributeList[e])
      let API = 'model'
      if (thisVue.showModel === 'my') {
        API = 'model'
        thisVue.params.is_public = false
      } else {
        API = 'pre_trained_model'
        thisVue.params.is_public = true
      }
      // console.log(API)
      eiqList('get', API, thisVue.params).then(json => {
        // console.log(json.data.results)
        thisVue.modelList = json.data.results
        if (thisVue.modelList.length === 0) {
          thisVue.noModel = true
        } else {
          thisVue.noModel = false
        }
        thisVue.loading = false
      }).catch(_ => {
        thisVue.loading = false
        return false
      })
    },
    getTraEngine (e) {
      thisVue.loading = true
      // thisVue.selectLevel = 3
      eiqList('get', 'engine', thisVue.params).then(json => {
        // console.log(json.data.results)
        if (json.data.results.length === 0) {
          thisVue.noTraining = true
          thisVue.form.trainingID = null
        } else {
          thisVue.noTraining = false
          thisVue.trainingList = json.data.results
          thisVue.form.trainingID = json.data.results[e].id
        }
        thisVue.loading = false
      }).catch(_ => {
        thisVue.loading = false
        return false
      })
    },
    getDataset () {
      eiqList('get', 'dataset', thisVue.params).then(json => {
        // console.log(json.data)
        thisVue.datasetList = json.data.results
        if (thisVue.datasetList.length === 0) {
          thisVue.noDataset = true
        } else {
          thisVue.noDataset = false
        }
      }).catch(_ => {
        return false
      })
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
    getPublicModel (param) {
      if (param === 'my') {
        thisVue.showModel = 'my'
      } else {
        thisVue.showModel = 'public'
      }
      thisVue.getTable(thisVue.showModel)
    },
    showDialog (val) {
      thisVue.dialogVisible = true
      // console.log(val)
      let {id, name, description, is_public, type, type_name, size, license, accuracy} = val
      thisVue.form = {id, name, description, is_public, type, type_name, size, license, accuracy}
    },
    toMarket (obj) {
      console.log(obj)
      if (obj.trade_status === 0) {
        thisVue.dialogMaket = true
        let {id, price} = obj
        thisVue.formPrice = {id, price}
      } else if (obj.trade_status === 1) {
        thisVue.$message({
          showClose: true,
          message: "Please wait a moment. It's under review!",
          type: 'info'
        })
      } else if (obj.trade_status === 2) {
        thisVue.$message({
          showClose: true,
          message: 'The product has been put on the shelf!',
          type: 'success'
        })
      } else {
        let msg = "Maybe it's because it's not standardized!"
        if (obj.audit_comment != null) {
          msg = obj.audit_comment
        }
        thisVue.$alert(msg, 'Reasons for failure: ')
      }
    },
    submitPrice (formPrice) {
      console.log(formPrice)
      thisVue.$refs[formPrice].validate(valid => {
        if (valid) {
          eiqDetail('patch', 'model', {id: thisVue.formPrice.id, price: thisVue.formPrice.price, trade_status: 1, market: true}).then(json => {
            console.log(json.data)
            thisVue.getTable()
            thisVue.dialogMaket = false
            thisVue.$message({
              showClose: true,
              message: 'Modified success!',
              type: 'success'
            })
          }).catch(_ => {
            return false
          })
        }
      })
    },
    closeDialog (form) {
      thisVue.dialogVisible = false
      thisVue.form = {
        id: null,
        name: null,
        description: null,
        type: null,
        attribute: null,
        attributeTXT: null,
        model: null,
        trainingObj: {
          description: null,
          id: null,
          name: null
        },
        training: null,
        dataset: null,
        is_public: false
      }
      thisVue.$refs[form].resetFields()
      thisVue.selectLevel = 0
    },
    closeDialogPrice (formPrice) {
      thisVue.dialogMaket = false
      thisVue.formPrice = {
        id: null,
        price: null
      }
      thisVue.$refs[formPrice].resetFields()
    },
    submitForm (form) {
      thisVue.$refs[form].validate(valid => {
        if (valid) {
          let params = {
            id: thisVue.form.id,
            name: thisVue.form.name,
            description: thisVue.form.description,
            type: thisVue.form.type,
            size: thisVue.form.size,
            accuracy: thisVue.form.accuracy,
            license: thisVue.form.license,
            is_public: thisVue.form.is_public
          }
          console.log(params)
          eiqDetail('patch', 'model', params).then(json => {
            console.log(json.data)
            thisVue.getTable(thisVue.showModel)
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
        'firstTitle': 'Model',
        'firstRouterName': 'zoo_list',
        'secondTitle': 'List'
      }
      // Common.setPageHeaderData(thisVue, pageHeaderData)
      thisVue.$store.dispatch('setPageHeaderData', pageHeaderData)
      if (thisVue.$route.params.show) {
        thisVue.showModel = thisVue.$route.params.show
      }
      thisVue.getSolution()
      thisVue.username = Cookie.getCookie('username')
      if (thisVue.username) {
        thisVue.getPermission()
      }
    })
  },
  components: { modelBlock, uploadImg }
}
</script>
<style scoped>
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
  .icon-bg-gray{ color:#caced2;cursor: pointer;}
</style>
<style>
  .page-type .el-button i{ padding-right:0;font-size:16px !important;}
  .icon-btn-container .el-button i{ font-size:16px;}
  .icon-btn-container i, .icon-btn-container.icon-downloadLog{ color:#223c53;font-size:16px;}
  .icon-btn-container i:hover, .icon-btn-container.icon-downloadLog:hover{ color:#5ca3e2;}
  .icon-btn-container.icon-downloadLog{ position:relative;top:1px;}
</style>
