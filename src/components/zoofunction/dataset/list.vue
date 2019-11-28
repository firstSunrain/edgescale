<template>
  <div class="dataset-box" v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading...">
    <!-- <div class='com-tit'>Dataset List</div> -->
    <div class='frame-banner'>
      <div class='dash-item dash-item1' :class="{'active': showDataset=='my'}" @click="getPublicDataset('my')"><span>{{ $t('dataset') }}</span></div>
      <div class='dash-item dash-item3' :class="{'active': showDataset=='public'}" @click="getPublicDataset('public')"><span>Dataset orders</span></div>
    </div>
    <el-row v-show="showDataset=='my'">
        <div class='page-filter'>
          <el-input suffix-icon='el-icon-search' class='common-input' size='small' v-model='filter_text' @keyup.13.native='getTable(showDataset)' :placeholder="$t('filter_by_name')"></el-input>
          <el-button size='small' class="common-btn search-btn" icon="icon-search4" @click="getTable(showDataset)">{{ $t('search') }}</el-button>
          <el-button class="line-filter" v-if="showDataset === 'my' || user_type === 'ADMIN'"></el-button>
          <el-button class="common-btn" size='small' icon='icon-upload4' v-if="showDataset === 'my' || user_type === 'ADMIN'" @click="$router.push({name: 'zoo_data_create'})">{{ $t('upload') }}</el-button>
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
        <el-table :data='tableData' size='small' v-if="page_list">
          <el-table-column :label="$t('name')">
            <template slot-scope='scope'>
              <router-link :to="{name: 'zoo_data_detail', params: {id: scope.row.id, type: showDataset}}">{{scope.row.name}}</router-link>
            </template>
          </el-table-column>
          <el-table-column prop='description' label='Description'></el-table-column>
          <el-table-column prop='size' :label="$t('size')"></el-table-column>
          <!-- <el-table-column prop='license' label='License'></el-table-column> -->
          <el-table-column prop='type_name' :label="$t('solution')"></el-table-column>
          <el-table-column label='Apply Status'>
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
              <div v-else>
                <span class="status-off">Audit Failed</span>
                <i class="icon-notification2 icon-bg-gray" @click="toMarket(scope.row)"></i>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop='date_created' sortable :label="$t('dateCreated')"></el-table-column>
          <!-- <el-table-column prop='update_time' sortable :label="$t('updateTime')"></el-table-column> -->
          <el-table-column :label="$t('action')" width='120'>
            <template slot-scope='scope'>
              <el-tooltip effect="dark" :content="$t('download')" placement="top">
                <a :href='scope.row.url' class='table-btn icon-download4'></a>
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('edit')" placement="top">
                <i class='table-btn icon-pencil5' v-show="user_type === 'ADMIN'" @click="showDialog(scope.row)"></i>
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('delete')" placement="top">
                <i class='table-btn icon-trash' v-show="user_type === 'ADMIN' || showDataset === 'my'" @click="del(scope.row.id, showDataset)"></i>
              </el-tooltip>
              <el-tooltip effect="dark" content="Publish" placement="top">
                <i v-if="scope.row.trade_status === 0" class='table-btn icon-esc' @click="toMarket(scope.row)"></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <modelBlock :list='tableData' :user_type='user_type' :showDataset='showDataset' @delCustomer='del' v-else></modelBlock>
      </div>
      <div class="common-page">
        <el-pagination background @current-change="handleCurrentChange"  @size-change="handleSizeChange" :current-page="page.number" :page-sizes="[10, 20, 30, 40]" :page-size="page.size" popper-class='page-pop' layout="total, slot, sizes, prev, pager, next" :total="page.total">
        </el-pagination>
      </div>
    </el-row>

    <el-row v-if="showDataset=='public'">
        <div class='page-filter'>
          <el-input suffix-icon='el-icon-search' size='small' v-model='filter_text_order' class='common-input' @keyup.13.native='getTable(showDataset)' :placeholder="$t('filter_by_name')"></el-input>
          <el-button class="common-btn search-btn" size='small' icon='icon-search4' @click="getTable(showDataset)">{{ $t('search') }}</el-button>
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
        <el-table :data='tableData' size='small' v-if="page_list">
          <el-table-column :label="$t('name')">
            <template slot-scope='scope'>
              <router-link :to="{name: 'zoo_data_detail', params: {id: scope.row.id, type: showDataset}}">{{scope.row.ds_name}}</router-link>
            </template>
          </el-table-column>
          <el-table-column prop='ds_description' label='Description'></el-table-column>
          <el-table-column prop='ds_type_name' :label="$t('solution')"></el-table-column>
          <el-table-column prop='date_created' sortable :label="$t('dateCreated')"></el-table-column>
          <!-- <el-table-column prop='update_time' sortable :label="$t('updateTime')"></el-table-column> -->
          <el-table-column :label="$t('action')" width='120'>
            <template slot-scope='scope'>
              <!-- <el-tooltip effect="dark" :content="$t('download')" placement="top" class="icon-btn-container">
                <el-button  class='table-btn' type='text' v-show="scope.row.url !== null && scope.row.url !== ''" @click='download(scope.row.url)' icon='icon-download4'></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('edit')" placement="top" class="icon-btn-container">
                <el-button class='table-btn' v-show="user_type === 'ADMIN'" type='text' icon='icon-pencil5' @click="showDialog(scope.row)"></el-button>
              </el-tooltip> -->
              <el-tooltip effect="dark" :content="$t('delete')" placement="top">
                <i class='table-btn icon-trash' @click="del(scope.row.id, showDataset)"></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <modelBlock :list='tableData' :user_type='user_type' :showDataset='showDataset' @delCustomer='del' v-else></modelBlock>
      </div>
      <div class="common-page">
        <el-pagination background @current-change="handleCurrentChange"  @size-change="handleSizeChange" :current-page="page.number" :page-sizes="[10, 20, 30, 40]" :page-size="page.size" popper-class='page-pop' layout="total, slot, sizes, prev, pager, next" :total="page.total">
        </el-pagination>
      </div>
    </el-row>
    <!-- Edit Dialog -->
    <el-dialog :title="$t('edit_dialog')" :visible.sync='dialogVisible' :show-close='true' :close-on-click-modal='false'>
      <div v-loading='dialogLoading' element-loading-spinner="el-icon-loading" element-loading-text="loading...">
        <el-form ref='form' size='small' :model='form' :rules='rules' label-width='130px'>
          <div class='step-box'>
            <el-form-item label='ID' prop='id'>
              <el-input type="text" v-model='form.id' disabled></el-input>
            </el-form-item>
            <el-form-item prop='name' :label="$t('name')">
              <el-input v-model='form.name' size='small' :placeholder="$t('please_input_name')"></el-input>
            </el-form-item>
            <el-form-item prop='description' :label="$t('description')">
              <el-input v-model='form.description' type='textarea' size='small' :placeholder="$t('please_input_description')"></el-input>
            </el-form-item>
            <el-form-item prop='size' :label="$t('size')">
              <el-input v-model='form.size' type='textarea' size='small' :placeholder="$t('please_input_size')"></el-input>
            </el-form-item>
            <el-form-item prop='license' :label="$t('license')">
              <el-input v-model='form.license' type='textarea' size='small' :placeholder="$t('please_input_license')"></el-input>
            </el-form-item>
            <el-form-item prop='is_public' :label="$t('is_public')">
              <el-switch  v-model="form.is_public"></el-switch>
            </el-form-item>
            <el-form-item prop='type_name' :label="$t('solution')">
              <el-select v-model='form.type_name' :placeholder="$t('select_solution')" size='small' @change="getAttribute($event)">
                <el-option v-for="(item,index) in solutionList" :key='index' :value="index" :label='item.name'></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" style='text-align: right;'>
          <el-button size='small' @click="closeDialog('form')">{{ $t('cancel') }}</el-button>
          <el-button size='small' type="primary" @click="submitForm('form')">{{ $t('submit') }}</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog title='Publish' :visible.sync='dialogMaket' :show-close='true' :close-on-click-modal='false' width="50%">
      <el-form ref='formPrice' size='small' :model='formPrice' :rules='rulesP' label-width='60px'>
        <el-form-item prop='price' label='Price'>
          <el-input-number disabled=disabled v-model="formPrice.price" :min="0"></el-input-number>
          <p style="color:#8c9297">currently could not set.</p>
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
let thisVue = null

export default {
  data () {
    return {
      loading: true,
      icon: Favicon,
      filter_text: '',
      filter_text_order: '',
      tableData: [],
      username: '',
      cur_id: null,
      page_list: true,
      page: {
        size: 10,
        total: 0,
        number: 1
      },
      solutionList: '',
      form: {
        id: null,
        name: null,
        description: null,
        type: null,
        type_name: null,
        is_public: false,
        size: null,
        license: null
      },
      rules: {
        name: [{required: true, trigger: 'blur', message: 'customer name is required'}, { min: 2, max: 60, message: 'Names should not exceed 60 words', trigger: 'blur' }]
      },
      rulesP: {
        price: [{required: true, trigger: 'blur', message: 'commodity price is required'}]
      },
      params: {
        offset: 10,
        limit: 0,
        search: '',
        type: '',
        ordering: '-date_created'
      },
      dialogLoading: false,
      dialogVisible: false,
      user_type: '',
      showDataset: 'my',
      dialogMaket: false,
      formPrice: {
        id: null,
        price: 0
      }
    }
  },
  methods: {
    getTable (isMy) {
      isMy = isMy || 'my'
      thisVue.loading = true
      thisVue.params.offset = thisVue.page.size * (thisVue.page.number - 1)
      thisVue.params.limit = thisVue.page.size
      let API = 'dataset'
      if (isMy === 'my') {
        API = 'dataset'
        thisVue.params.search = thisVue.filter_text
      } else {
        API = 'order_dataset'
        thisVue.params.search = thisVue.filter_text_order
      }
      eiqList('get', API, thisVue.params).then(json => {
        json.data.results.forEach((item) => {
          if (item.url !== null && item.url !== '' && item.url !== undefined) {
            item.url = 'https://eiq-cloud.s3.amazonaws.com/' + item.url
          }
          item.date_created = publicJS.timetrans(item.date_created)
          item.date_updated = publicJS.timetrans(item.date_updated)
        })
        thisVue.tableData = json.data.results
        // console.log(json.data.results)
        thisVue.page.total = json.data.count
        thisVue.loading = false
      }).catch(_ => {
        return false
      })
    },
    getPublicDataset (param) {
      if (param === 'my') {
        thisVue.showDataset = 'my'
      } else {
        thisVue.showDataset = 'public'
      }
      thisVue.getTable(thisVue.showDataset)
    },
    getSolution () {
      thisVue.params.offset = ''
      thisVue.params.limit = ''
      eiqList('get', 'solution', thisVue.params).then(json => {
        // console.log(json.data.results)
        thisVue.solutionList = json.data.results
      }).catch(_ => {
        return false
      })
    },
    getAttribute (e) {
      thisVue.form.type = thisVue.solutionList[e].id
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
      thisVue.getTable(thisVue.showDataset)
    },
    download (url) {
      thisVue.$confirm('Do you want to download this dataset', 'Download Item', {type: 'info'}).then(_ => {
        window.open(url, '_self')
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
    del (id, type) {
      thisVue.$confirm('Are you sure to delete this dataset?', 'Delete Dataset', {type: 'warning'}).then(_ => {
        let API = 'dataset'
        if (type === 'my') {
          API = 'dataset'
        } else {
          API = 'order_dataset'
        }
        eiqDetail('delete', API, { id: id }).then(json => {
          thisVue.$message({
            showClose: true,
            message: 'Delete successful',
            type: 'success'
          })
          thisVue.getTable(thisVue.showDataset)
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
      thisVue.getTable(thisVue.showDataset)
    },
    showDialog (val) {
      thisVue.dialogVisible = true
      // console.log(val)
      let {id, name, description, is_public, type, type_name, size, license} = val
      thisVue.form = {id, name, description, is_public, type, type_name, size, license}
      thisVue.getSolution()
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
        thisVue.$alert(msg, 'Reasons for failure')
      }
    },
    submitPrice (formPrice) {
      console.log(formPrice)
      thisVue.$refs[formPrice].validate(valid => {
        if (valid) {
          eiqDetail('patch', 'dataset', {id: thisVue.formPrice.id, price: thisVue.formPrice.price, trade_status: 1, market: true}).then(json => {
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
        type_name: null,
        is_public: false,
        size: null,
        license: null
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
          // console.log(thisVue.form)
          eiqDetail('patch', 'dataset', thisVue.form).then(json => {
            // console.log(json.data)
            thisVue.getTable(thisVue.showDataset)
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
    },
    handleSizeChange (val) {
      // console.log(val)
      thisVue.page.size = val
      thisVue.getTable(thisVue.showDataset)
    }
  },
  mounted () {
    thisVue = this
    this.$nextTick(function () {
      let pageHeaderData = {
        'homeRouterName': 'home',
        'firstTitle': thisVue.$t('dataset'),
        'firstRouterName': 'zoo_data_list',
        'secondTitle': thisVue.$t('list')
      }
      // Common.setPageHeaderData(thisVue, pageHeaderData)
      thisVue.$store.dispatch('setPageHeaderData', pageHeaderData)
      if (thisVue.$route.params.show) {
        thisVue.showDataset = thisVue.$route.params.show
      }
      thisVue.getTable(thisVue.showDataset)
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
  .opr-box{padding-bottom: 0px;}
  .search-input{width: 300px;margin-right: 10px;}
  .table-btn{padding: 0px;margin: 0px;}
  .el-select{width: 240px;}
  .filter-box .el-input{vertical-align: middle;}
  .btn-filter .el-input{ float:left;width: 200px;margin-bottom:15px;}
  .btn-filter button{ float:left; height:32px;margin-bottom:15px;}
  .page-type{ margin-top:3px;text-align: right;}
  .page-type .el-button{margin:4px;padding: 0px; color: #aaa;border-color: #fff;background-color: #fff;}
  .page-type .el-button:focus,.page-type .el-button.active {color: #333;border-color: #fff;background-color: #fff; }
  .itm-btn-container{ border-bottom:1px solid #ccc;overflow: hidden;}
  .itm-btn-container button{ border-radius:0;border-bottom: 4px solid #fff;}
  .itm-btn-container button:hover,.itm-btn-container button:focus,.itm-btn-container button:active{ background:#fff !important;box-shadow: none;}
  .itm-btn-container button.active{ border-bottom: 4px solid #26c6da;background: #fff;box-shadow:0 0 0 0 rgba(0,0,0,0);}
  .itm-btn-container button.active i,.itm-btn-container button.active span{ color:#26c6da;font-weight: bold;}
  .itm1-btn{ background:none;border: 0; color: #333; }
  .itm2-btn{ background:none;border: 0; color: #333;}
  .itm-btn-container button span,.itm-btn-container button i{ display: inline-block;}
  .itm-btn-container button span{ font-size: 15px;}
  .itm-btn-container button i{font-size: 20px;vertical-align: middle; margin-top: -4px;margin-right: 3px;}
  .itm1-btn{ background:none;border: 0;color: #333; }
  .itm2-btn{ background:none;border: 0; color: #333;}
  .itm-btn-container button span,.itm-btn-container button i{ display: inline-block;}
  .itm-btn-container button span{ font-size: 15px;}
  .itm-btn-container button i{font-size: 20px; vertical-align: middle; margin-top: -4px; margin-right: 3px;}
  .tab-btn{width: 50%; display: block; float: left; box-sizing: border-box;}
  .frame-banner{ padding-left: 10px;margin: -20px -20px 20px;background: #fff;box-shadow:0 1px 0 0 #cbd7e2;}
  .frame-banner .dash-item{ display:inline-block; margin: 0 15px -1px; padding: 17px 2px; cursor: pointer; border-bottom: 2px solid rgba(0,0,0,0);font-size:14px;color: #223c53;}
  .frame-banner .dash-item.active{ border-bottom: 2px solid #223c53;font-weight: bold;}
  .frame-banner .dash-item:hover{ border-bottom: 2px solid #223c53;}
  .icon-bg-gray{ color:#caced2;cursor: pointer;}
</style>
<style>
  .page-type .el-button i{ padding-right:0;font-size:16px !important;}
</style>
