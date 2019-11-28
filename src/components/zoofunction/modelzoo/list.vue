<template>
  <div class="zoo_box" v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading...">
    <el-row>
    <div class='frame-banner'>
      <div class='dash-item dash-item1' :class="{'active': showModel=='modelPass'}" @click="getTableType('modelPass')"><span>{{ $t('model') }}</span></div>
      <div class='dash-item dash-item3' :class="{'active': showModel=='datasetPass', }" @click="getTableType('datasetPass')"><span>{{ $t('dataset') }}</span></div>
      <div class='dash-item dash-item3' v-show="user_type === 'ADMIN'" :class="{'active': showModel=='modelWait'}" @click="getTableType('modelWait')"><span>Model audit</span></div>
      <div class='dash-item dash-item3' v-show="user_type === 'ADMIN'" :class="{'active': showModel=='datasetWait'}" @click="getTableType('datasetWait')"><span>Dataset audit</span></div>
    </div>
    <el-row v-show="showModel=='modelPass'">
        <div class='page-filter'>
          <el-select size='small' class='common-input' :placeholder="$t('filter_by_solution')" v-model="solutionTypeIndex" @change="tabshow($event)">
            <el-option value="all" label='All models'></el-option>
            <el-option v-for="(item,index) in solutionList" :key='index' :value="index" :label='item.name'></el-option>
          </el-select>
          <el-select size='small' class='common-input' :placeholder="$t('filter_by_dataset')" v-model="datasetIndex" @change="tabshowDataset($event)">
            <el-option value="all" label='All dataset'></el-option>
            <el-option v-for="(item,index) in datasetList" :key='index' :value="index" :label='item.name'></el-option>
          </el-select>
          <el-input suffix-icon='el-icon-search' size='small' v-model='filter_text' class='common-input' @keyup.13.native='getTable()' :placeholder="$t('search_by_name_or_publisher_or_network')"></el-input>
          <el-button class="common-btn search-btn" size='small' icon='icon-search4 text-size-base' @click="getTable()">{{ $t('search') }}</el-button>
          <el-button-group class="btn-filter">
            <!-- <el-button size='small' icon='icon-plus2' v-if="user_type === 'ADMIN'" @click="$router.push({name: 'zoo_model_create'})">Create</el-button> -->
            <!-- <el-button size='small' icon='icon-spinner11' @click="getTable">Refresh</el-button> -->
            <!-- <el-button size='small' icon='icon-upload4' @click="$router.push({name: 'zoo_model_uploadModel'})">Development</el-button> -->
          </el-button-group>
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
              <router-link :to="{name: 'zoo_model_detail', params: {id: scope.row.id}}">{{scope.row.name}}</router-link>
            </template>
          </el-table-column>
          <!-- <el-table-column prop='size' label='Size'></el-table-column> -->
          <el-table-column prop='description' :label="$t('description')"></el-table-column>
          <el-table-column prop='publisher' :label="$t('publisher')"></el-table-column>
          <!-- <el-table-column prop='license' label='License'></el-table-column> -->
          <!-- <el-table-column prop='attribute' :label="$t('architecture')"></el-table-column> -->
          <el-table-column prop='dataset_name' :label="$t('dataset')"></el-table-column>
          <el-table-column prop='network' :label="$t('network')"></el-table-column>
          <el-table-column prop='type_name' :label="$t('solution')"></el-table-column>
          <el-table-column prop='priceShow' label="Price" width="80"></el-table-column>
          <el-table-column sortable prop='date_created' :label="$t('dateCreated')" width='160'></el-table-column>
          <!-- <el-table-column sortable='true' prop='update_time' label='UpdateTime'></el-table-column> -->
          <el-table-column :label="$t('action')" width='120'>
            <template slot-scope='scope'>
              <el-tooltip v-if="user_type === 'ADMIN'" effect="dark" :content="$t('edit')" placement="top">
                <i class='table-btn icon-pencil5' @click="showDialog(scope.row)"></i>
              </el-tooltip>
              <el-tooltip v-if="userInfo === scope.row.owner" effect="dark" content="remove" placement="top">
                <i class='table-btn icon-trash' @click="del(scope.row)"></i>
              </el-tooltip>
              <el-tooltip effect="dark" content="Order" placement="top">
                <i v-if="userInfo !== scope.row.owner" class='table-btn icon-file-text' @click="payment(scope.row, 'model')"></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <modelBlock :list='tableData' :user_type='user_type' :showModel='showModel' v-else></modelBlock>
      </div>
      <div class="common-page">
        <el-pagination background @current-change="handleCurrentChange"  @size-change="handleSizeChange" :current-page="page.number" :page-sizes="[10, 20, 30, 40]" :page-size="page.size" popper-class='page-pop' layout="total, slot, sizes, prev, pager, next" :total="page.total">
        </el-pagination>
      </div>
    </el-row>
    <!-- Edit Dialog -->
    <el-dialog :title="$t('edit_dialog')" :visible.sync='dialogVisible' :show-close='false' :close-on-click-modal='false'>
      <div v-loading='dialogLoading' element-loading-spinner="el-icon-loading" element-loading-text="loading...">
        <el-form ref='form' size='small' :model='form' :rules='rules' label-width='130px'>
          <div class='step-box'>
            <el-form-item label='ID' prop='id'>
              <el-input type="text" v-model='form.id' disabled></el-input>
            </el-form-item>
            <el-form-item prop='name' :label="$t('name')">
              <el-input v-model='form.name' size='small' :placeholder="$t('please_input_name')"></el-input>
            </el-form-item>
            <el-form-item prop='type_name' :label="$t('solution')">
              <el-select v-model='form.type_name' :placeholder="$t('select_solution')" size='small'>
                <el-option v-for="(item,index) in solutionList" :key='index' :value="index" :label='item.name'></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop='description' :label="$t('description')">
              <el-input v-model='form.description' type='textarea' size='small' :placeholder="$t('please_input_description')"></el-input>
            </el-form-item>
            <el-form-item prop='size' :label="$t('size')">
              <el-input v-model='form.size' type='textarea' size='small' :placeholder="$t('please_input_size')"></el-input>
            </el-form-item>
            <el-form-item prop='accuracy' :label="$t('accuracy')">
              <el-input v-model='form.accuracy' type='textarea' size='small' :placeholder="$t('please_input_accuracy')"></el-input>
            </el-form-item>
            <el-form-item prop='license' :label="$t('license')">
              <el-input v-model='form.license' type='textarea' size='small' :placeholder="$t('please_input_license')"></el-input>
            </el-form-item>
            <el-form-item prop='publisher' :label="$t('publisher')">
              <el-input v-model='form.publisher' type='textarea' size='small' :placeholder="$t('please_input_publisher')"></el-input>
            </el-form-item>
            <el-form-item prop='network' :label="$t('network')">
              <el-input v-model='form.network' type='textarea' size='small' :placeholder="$t('please_input_network')"></el-input>
            </el-form-item>
            <el-form-item prop='is_public' :label="$t('is_public')">
              <el-switch  v-model="form.is_public"></el-switch>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" style='text-align: right;'>
          <el-button size='small' @click="closeDialog('form')">{{ $t('cancel') }}</el-button>
          <el-button size='small' type="primary" @click="submitForm('form')">{{ $t('submit') }}</el-button>
        </div>
      </div>
    </el-dialog>

    <el-row v-show="showModel=='datasetPass'">
        <div class="page-filter">
          <el-input suffix-icon='el-icon-search' size='small' v-model='filter_dataset' class='common-input' @keyup.13.native='getDataset()' :placeholder="$t('filter_by_name')"></el-input>
          <el-button class="common-btn search-btn" size='small' icon='icon-search4' @click="getDataset()">{{ $t('search') }}</el-button>
          <el-button class="line-filter"></el-button>
          <div class="btn-group">
            <el-button class="common-btn" size='small' icon='icon-upload4' v-if="user_type === 'ADMIN'" @click="$router.push({name: 'zoo_data_create'})">{{ $t('upload') }}</el-button>
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
        <el-table :data='datasetData' size='small' v-if="page_list">
          <el-table-column :label="$t('name')">
            <template slot-scope='scope'>
              <router-link :to="{name: 'zoo_dataset_detail', params: {id: scope.row.id}}">{{scope.row.name}}</router-link>
            </template>
          </el-table-column>
          <el-table-column prop='description' :label="$t('description')"></el-table-column>
          <el-table-column prop='size' :label="$t('size')"></el-table-column>
          <!-- <el-table-column prop='license' label='License'></el-table-column> -->
          <el-table-column prop='type_name' :label="$t('solution')"></el-table-column>
          <el-table-column prop='priceShow' label="Price" width="80"></el-table-column>
          <el-table-column prop='date_created' sortable :label="$t('dateCreated')" width='160'></el-table-column>
          <!-- <el-table-column prop='update_time' sortable :label="$t('updateTime')"></el-table-column> -->
          <el-table-column :label="$t('action')" width='120'>
            <template slot-scope='scope'>
              <el-tooltip v-show="user_type === 'ADMIN'" effect="dark" :content="$t('edit')" placement="top">
                <i class='table-btn icon-pencil5' @click="showDialogDataset(scope.row)"></i>
              </el-tooltip>
              <el-tooltip v-if="userInfo === scope.row.owner" effect="dark" :content="$t('lower_shelf')" placement="top">
                <i class='table-btn icon-trash' @click="deldataset(scope.row)"></i>
              </el-tooltip>
              <el-tooltip effect="dark" content="Order" placement="top">
                <i @click="payment(scope.row, 'dataset')" class='table-btn icon-file-text'></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <modelBlock :list='datasetData' :user_type='user_type' v-else></modelBlock>
      </div>
      <div class="common-page">
        <el-pagination background @current-change="handleCurrentChange"  @size-change="handleSizeChange" :current-page="pageDataset.number" :page-sizes="[10, 20, 30, 40]" :page-size="pageDataset.size" popper-class='page-pop' layout="total, slot, sizes, prev, pager, next" :total="pageDataset.total">
        </el-pagination>
      </div>
    </el-row>

    <el-row v-show="showModel=='modelWait'">
        <div class='page-filter'>
          <el-select size='small' class='common-input' :placeholder="$t('filter_by_solution')" v-model="solutionTypeIndex" @change="tabshow($event)">
            <el-option value="all" label='All models'></el-option>
            <el-option v-for="(item,index) in solutionList" :key='index' :value="index" :label='item.name'></el-option>
          </el-select>
          <el-input suffix-icon='el-icon-search' class='common-input' size='small' v-model='filter_model_wait' @keyup.13.native='getTable()' :placeholder="$t('search_by_name_or_publisher_or_network')"></el-input>
          <el-button class='common-btn search-btn' size='small' icon='icon-search4 text-size-base' @click="getTable()">{{ $t('search') }}</el-button>
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
        <el-table :data='modelWaitData' size='small' v-if="page_list">
          <el-table-column :label="$t('name')">
            <template slot-scope='scope'>
              <router-link :to="{name: 'zoo_model_detail', params: {id: scope.row.id}}">{{scope.row.name}}</router-link>
            </template>
          </el-table-column>
          <!-- <el-table-column prop='size' label='Size'></el-table-column> -->
          <el-table-column prop='description' :label="$t('description')"></el-table-column>
          <el-table-column prop='publisher' :label="$t('publisher')"></el-table-column>
          <!-- <el-table-column prop='license' label='License'></el-table-column> -->
          <!-- <el-table-column prop='attribute' :label="$t('architecture')"></el-table-column> -->
          <el-table-column prop='dataset_name' :label="$t('dataset')"></el-table-column>
          <el-table-column prop='network' :label="$t('network')"></el-table-column>
          <el-table-column prop='type_name' :label="$t('solution')"></el-table-column>
          <el-table-column prop='priceShow' label="Price" width="80"></el-table-column>
          <el-table-column label="Apply">
            <template slot-scope='scope'>
              <span class="status-on" v-if="scope.row.market" type='success' size="mini">Upper Shelf</span>
              <span class="status-lowershelf" v-else type='warning' size="mini">Lower Shelf</span>
            </template>
          </el-table-column>
          <el-table-column sortable prop='date_created' :label="$t('dateCreated')" width="160"></el-table-column>
          <!-- <el-table-column sortable='true' prop='update_time' label='UpdateTime'></el-table-column> -->
          <el-table-column :label="$t('action')" width='120'>
            <template slot-scope='scope'>
              <el-tooltip effect="dark" content="pass" placement="top">
                <i class="table-btn icon-checkmark-circle2" @click="pass(scope.row, 'model')"></i>
              </el-tooltip>
              <el-tooltip effect="dark" content="fail" placement="top">
                <i class="table-btn icon-blocked" @click="toMarket(scope.row, 'model')"></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <modelBlock :list='modelWaitData' :user_type='user_type' :showModel='showModel' v-else></modelBlock>
      </div>
      <div class='common-page'>
        <el-pagination background @current-change="handleCurrentChange"  @size-change="handleSizeChange" :current-page="page.number" :page-sizes="[10, 20, 30, 40]" :page-size="page.size" popper-class='page-pop' layout="total, slot, sizes, prev, pager, next" :total="page.total">
        </el-pagination>
      </div>
    </el-row>

    <el-row v-show="showModel=='datasetWait'">
        <div class='page-filter'>
          <el-input suffix-icon='el-icon-search' class='common-input' size='small' v-model='filter_dataset_wait' @keyup.13.native='getDataset()' :placeholder="$t('filter_by_name')"></el-input>
          <el-button class="common-btn search-btn" size='small' icon='icon-search4' @click="getDataset()">{{ $t('search') }}</el-button>
          <el-button class="line-filter"></el-button>
          <div class="btn-group">
            <el-button class="common-btn" size='small' icon='icon-upload4' v-if="user_type === 'ADMIN'" @click="$router.push({name: 'zoo_data_create'})">{{ $t('upload') }}</el-button>
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
        <el-table :data='datasetWaitData' size='small' v-if="page_list">
          <el-table-column :label="$t('name')">
            <template slot-scope='scope'>
              <router-link :to="{name: 'zoo_dataset_detail', params: {id: scope.row.id}}">{{scope.row.name}}</router-link>
            </template>
          </el-table-column>
          <el-table-column prop='description' :label="$t('description')"></el-table-column>
          <el-table-column prop='size' :label="$t('size')"></el-table-column>
          <!-- <el-table-column prop='license' label='License'></el-table-column> -->
          <el-table-column prop='type_name' :label="$t('solution')"></el-table-column>
          <el-table-column prop='priceShow' label="Price" width="80"></el-table-column>
          <el-table-column label="Status">
            <template slot-scope='scope'>
              <span class="status-on" v-if="scope.row.market" type='success' size="mini">Upper Shelf</span>
              <span class="status-lowershelf" v-else type='warning' size="mini">Lower Shelf</span>
            </template>
          </el-table-column>
          <el-table-column prop='date_created' sortable :label="$t('dateCreated')" width="160"></el-table-column>
          <!-- <el-table-column prop='update_time' sortable :label="$t('updateTime')"></el-table-column> -->
          <el-table-column :label="$t('action')" width='120'>
            <template slot-scope='scope'>
              <el-tooltip effect="dark" content="pass" placement="top">
                <i class="table-btn icon-checkmark-circle2" @click="pass(scope.row, 'dataset')"></i>
              </el-tooltip>
              <el-tooltip effect="dark" content="fail" placement="top">
                <i class="table-btn icon-blocked" @click="toMarket(scope.row, 'dataset')"></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <modelBlock :list='datasetWaitData' :user_type='user_type' v-else></modelBlock>
      </div>
      <div class='common-page'>
        <el-pagination background @current-change="handleCurrentChange"  @size-change="handleSizeChange" :current-page="pageDataset.number" :page-sizes="[10, 20, 30, 40]" :page-size="pageDataset.size" popper-class='page-pop' layout="total, slot, sizes, prev, pager, next" :total="pageDataset.total">
        </el-pagination>
      </div>
    </el-row>
    <!-- Edit Dialog Dataset-->
    <el-dialog :title="$t('edit_dialog')" :visible.sync='dialogVisibleDataset' :show-close='false' :close-on-click-modal='false'>
      <div v-loading='dialogLoading' element-loading-spinner="el-icon-loading" element-loading-text="loading...">
        <el-form ref='formDataset' size='small' :model='formDataset' :rules='rules' label-width='130px'>
          <div class='step-box'>
            <el-form-item label='ID' prop='id'>
              <el-input type="text" v-model='formDataset.id' disabled></el-input>
            </el-form-item>
            <el-form-item prop='name' :label="$t('name')">
              <el-input v-model='formDataset.name' size='small' :placeholder="$t('please_input_name')"></el-input>
            </el-form-item>
            <el-form-item prop='description' :label="$t('description')">
              <el-input v-model='formDataset.description' type='textarea' size='small' :placeholder="$t('please_input_description')"></el-input>
            </el-form-item>
            <el-form-item prop='size' :label="$t('size')">
              <el-input v-model='formDataset.size' type='textarea' size='small' :placeholder="$t('please_input_size')"></el-input>
            </el-form-item>
            <el-form-item prop='license' :label="$t('license')">
              <el-input v-model='formDataset.license' type='textarea' size='small' :placeholder="$t('please_input_license')"></el-input>
            </el-form-item>
            <el-form-item prop='is_public' :label="$t('is_public')">
              <el-switch  v-model="formDataset.is_public"></el-switch>
            </el-form-item>
            <el-form-item prop='type_name' :label="$t('solution')">
              <el-select v-model='formDataset.type_name' :placeholder="$t('select_solution')" size='small'>
                <el-option v-for="(item,index) in solutionList" :key='index' :value="index" :label='item.name'></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" style='text-align: right;'>
          <el-button size='small' @click="closeDialogDataset('formDataset')">{{ $t('cancel') }}</el-button>
          <el-button size='small' type="primary" @click="submitFormDataset('formDataset')">{{ $t('submit') }}</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog title='Let fail' :visible.sync='dialogMaket' :show-close='false' :close-on-click-modal='false'>
      <el-form ref='formPrice' size='small' :model='formPrice' :rules='rulesP' label-width='130px'>
        <el-form-item prop='audit_comment' label='Reason'>
          <el-input v-model='formPrice.audit_comment' size='small' placeholder='please input Reasons not adopted'></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" style='text-align: right;'>
        <el-button size='small' @click="closeDialogPrice('formPrice')">Cancel</el-button>
        <el-button size='small' type="primary" @click="fail('formPrice')">Submit</el-button>
      </div>
    </el-dialog>
    </el-row>
  </div>
</template>

<script>
import Common from '../../../../static/js/common.js'
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
      filter_dataset: '',
      filter_model_wait: '',
      filter_dataset_wait: '',
      tableData: [],
      datasetData: [],
      modelWaitData: [],
      datasetWaitData: [],
      cur_id: null,
      page_list: true,
      solutionTypeIndex: '',
      datasetIndex: '',
      page: {
        size: 10,
        total: 0,
        number: 1
      },
      pageDataset: {
        size: 10,
        total: 0,
        number: 1
      },
      pageWaitModel: {
        size: 10,
        total: 0,
        number: 1
      },
      pageWaitDataset: {
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
        attribute: '',
        dataset: ''
      },
      paramsDataset: {
        offset: '',
        limit: '',
        search: '',
        type: ''
      },
      paramsWaitModel: {
        offset: '',
        limit: '',
        search: '',
        type: ''
      },
      paramsWaitDataset: {
        offset: '',
        limit: '',
        search: '',
        type: ''
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
        accuracy: null,
        publisher: null,
        network: null
      },
      formDataset: {
        id: null,
        name: null,
        description: null,
        type: null,
        type_name: null,
        is_public: false,
        size: null,
        license: null
      },
      formWaitModel: {
        id: null,
        name: null,
        description: null,
        type: null,
        type_name: null,
        is_public: false,
        size: null,
        license: null
      },
      formWaitDataset: {
        id: null,
        name: null,
        description: null,
        type: null,
        type_name: null,
        is_public: false,
        size: null,
        license: null
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
        audit_comment: [{required: true, trigger: 'blur', message: 'Reasons not adopted is required'}]
      },
      dialogLoading: false,
      dialogVisible: false,
      dialogVisibleDataset: false,
      showModel: 'modelPass',
      isFirst: false,
      dialogMaket: false,
      formPrice: {
        id: null,
        audit_comment: null,
        market: true
      },
      userInfo: ''
    }
  },
  methods: {
    getTable () {
      thisVue.loading = true
      thisVue.params.search = thisVue.filter_text
      thisVue.params.attribute = ''
      thisVue.params.id = ''
      thisVue.params.trade_status = 2
      // console.log(thisVue.params)
      eiqList('get', 'model_zoo', thisVue.params).then(json => {
        json.data.results.forEach((item) => {
          if (item.url !== null && item.url !== '' && item.url !== undefined) {
            item.url = 'https://eiq-cloud.s3.amazonaws.com/' + item.url
          }
          if (item.t_full_log_url !== null && item.t_full_log_url !== '' && item.t_full_log_url !== undefined) {
            item.t_full_log_url = 'https://eiq-cloud.s3.amazonaws.com/' + item.t_full_log_url
          }
          if (item.price !== null || item.price !== '') {
            item.priceShow = Common.formatCurrency(item.price)
          }
          item.date_created = publicJS.timetrans(item.date_created)
          item.update_time = publicJS.timetrans(item.update_time)
        })
        // console.log(json.data.results)
        thisVue.tableData = json.data.results
        thisVue.page.total = json.data.count
        // console.log(json.data.results)
        thisVue.loading = false
      }).catch(_ => {
        return false
      })
    },
    getPermission () {
      store.dispatch('getUserPermission').then(_ => {
        // thisVue.user_type = 'ADMIN' // 开发使用
        thisVue.userInfo = store.state.userInfo.uid
        if (store.state.userPermission.is_admin) {
          thisVue.user_type = 'ADMIN'
        } else {
          thisVue.user_type = store.state.userPermission.account_type.name
        }
      }).catch(_ => {
        return false
      })
    },
    del (obj) {
      if (obj.audit_comment !== null) {
        thisVue.$alert(obj.audit_comment, 'Reason for rejection: ')
      }
      thisVue.$confirm('Are you sure you want to remove it from the marketplace?', 'Lower shelf', {type: 'warning'}).then(_ => {
        let num = 0
        let API = ''
        if (thisVue.user_type !== 'ADMIN' && thisVue.userInfo === obj.owner) {
          num = 1
          API = 'model'
        } else {
          num = 0
          API = 'model_zoo'
        }
        eiqDetail('patch', API, {id: obj.id, trade_status: num, market: false}).then(json => {
          // console.log(json.data)
          thisVue.getTable()
          thisVue.$message({
            showClose: true,
            message: 'Modified success!',
            type: 'success'
          })
        }).catch(_ => {
          return false
        })
      }).catch(_ => {
        return false
      })
    },
    deldataset (obj) {
      thisVue.$confirm('Are you sure you want to take the product off the shelf?', 'Lower shelf', {type: 'warning'}).then(_ => {
        let num = 0
        if (thisVue.user_type === 'ADMIN' && thisVue.userInfo === obj.owner) {
          num = 1
        } else {
          num = 0
        }
        eiqDetail('patch', 'dataset_zoo', {id: obj.id, trade_status: num, market: false}).then(json => {
          // console.log(json.data)
          thisVue.getDataset()
          thisVue.$message({
            showClose: true,
            message: 'Modified success!',
            type: 'success'
          })
        }).catch(_ => {
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
    getTableType (param) {
      thisVue.isFirst = true
      thisVue.showModel = param
      if (param === 'modelPass') {
        thisVue.getTable()
      } else if (param === 'datasetPass') {
        thisVue.getDataset()
      } else if (param === 'modelWait') {
        thisVue.getModelWait()
      } else {
        thisVue.getDatasetWait()
      }
    },
    tabshow (e) {
      if (e === 'all') {
        thisVue.params.type = ''
      } else {
        thisVue.solutionTypeIndex = e
        thisVue.params.type = thisVue.solutionList[thisVue.solutionTypeIndex].id
      }
      thisVue.getTable()
    },
    tabshowDataset (e) {
      if (e === 'all') {
        thisVue.params.type = ''
      } else {
        thisVue.datasetIndex = e
        thisVue.params.dataset = thisVue.datasetList[thisVue.datasetIndex].id
      }
      thisVue.getTable()
    },
    getSolution (type) {
      thisVue.params.offset = thisVue.page.size * (thisVue.page.number - 1)
      thisVue.params.limit = thisVue.page.size
      eiqList('get', 'solution', thisVue.params).then(json => {
        // console.log(json.data.results)
        thisVue.solutionList = json.data.results
        thisVue.getTable()
      }).catch(_ => {
        return false
      })
      thisVue.getDataset()
      thisVue.getModelWait()
      thisVue.getDatasetWait()
    },
    getModelWait () {
      if (thisVue.isFirst) {
        thisVue.loading = true
      }
      thisVue.paramsWaitModel.search = thisVue.filter_model_wait
      thisVue.paramsWaitModel.trade_status = 1
      // console.log(thisVue.paramsWaitModel)
      eiqList('get', 'model_zoo', thisVue.paramsWaitModel).then(json => {
        // console.log(json.data)
        json.data.results.forEach((item) => {
          if (item.price !== null || item.price !== '') {
            item.priceShow = Common.formatCurrency(item.price)
          }
          item.date_created = publicJS.timetrans(item.date_created)
          item.update_time = publicJS.timetrans(item.update_time)
        })
        thisVue.modelWaitData = json.data.results
        if (thisVue.isFirst) {
          thisVue.loading = false
        }
      }).catch(_ => {
        return false
      })
    },
    getDatasetWait () {
      if (thisVue.isFirst) {
        thisVue.loading = true
      }
      thisVue.paramsWaitDataset.search = thisVue.filter_dataset_wait
      thisVue.paramsWaitDataset.trade_status = 1
      eiqList('get', 'dataset_zoo', thisVue.paramsWaitDataset).then(json => {
        json.data.results.forEach((item) => {
          if (item.price !== null || item.price !== '') {
            item.priceShow = Common.formatCurrency(item.price)
          }
          item.date_created = publicJS.timetrans(item.date_created)
          item.update_time = publicJS.timetrans(item.update_time)
        })
        thisVue.datasetWaitData = json.data.results
        if (thisVue.isFirst) {
          thisVue.loading = false
        }
      }).catch(_ => {
        return false
      })
    },
    getDataset () {
      if (thisVue.isFirst) {
        thisVue.loading = true
      }
      thisVue.paramsDataset.search = thisVue.filter_dataset
      thisVue.paramsDataset.trade_status = 2
      eiqList('get', 'dataset_zoo', thisVue.paramsDataset).then(json => {
        json.data.results.forEach((item) => {
          if (item.price !== null || item.price !== '') {
            item.priceShow = Common.formatCurrency(item.price)
          }
          item.date_created = publicJS.timetrans(item.date_created)
          item.update_time = publicJS.timetrans(item.update_time)
        })
        thisVue.datasetList = json.data.results
        thisVue.datasetData = json.data.results
        if (thisVue.isFirst) {
          thisVue.loading = false
        }
      }).catch(_ => {
        return false
      })
    },
    showDialog (val) {
      thisVue.dialogVisible = true
      // console.log(val)
      let {id, name, description, is_public, type, type_name, size, license, accuracy, publisher, network} = val
      thisVue.form = {id, name, description, is_public, type, type_name, size, license, accuracy, publisher, network}
    },
    showDialogDataset (val) {
      thisVue.dialogVisibleDataset = true
      // console.log(val)
      let {id, name, description, is_public, type, type_name, size, license} = val
      thisVue.form = {id, name, description, is_public, type, type_name, size, license}
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
    },
    closeDialogDataset (formDataset) {
      thisVue.dialogVisibleDataset = false
      thisVue.formDataset = {
        id: null,
        name: null,
        description: null,
        type: null,
        type_name: null,
        is_public: false,
        size: null,
        license: null
      }
      thisVue.$refs[formDataset].resetFields()
    },
    payment (obj, type) {
      thisVue.$confirm('Are you sure you want to buy this product?', 'Buy it', {type: 'warning'}).then(_ => {
        // console.log(obj)
        let API = ''
        let param = {}
        if (type === 'model') {
          API = 'order_model'
          param = {
            model: obj.id
          }
        } else {
          API = 'order_dataset'
          param = {
            dataset: obj.id
          }
        }
        eiqDetail('post', API, param).then(json => {
          console.log(json)
          if (type === 'model') {
            thisVue.$router.push({name: 'zoo_list', params: {show: 'public'}})
          } else {
            thisVue.$router.push({name: 'zoo_data_list', params: {show: 'public'}})
          }
          thisVue.$message({
            showClose: true,
            message: 'Modified success!',
            type: 'success'
          })
        }).catch(_ => {
          if (_.response.status === 512) {
            let msg = JSON.parse(_.response.request.responseText)
            thisVue.$alert(msg.detail, 'Error Message: ')
          }
          return false
        })
      }).catch(_ => {
        return false
      })
    },
    pass (obj, type) {
      thisVue.$confirm('Are you sure you want to pass the apply?', 'Let pass', {type: 'warning'}).then(_ => {
        let API = ''
        if (type === 'model') {
          API = 'model_zoo'
        } else {
          API = 'dataset_zoo'
        }
        let num = ''
        if (obj.market) {
          num = 2
        } else {
          num = 0
        }
        eiqDetail('patch', API, {id: obj.id, trade_status: num, audit_comment: null}).then(json => {
          // console.log(json.data)
          if (type === 'model') {
            thisVue.getModelWait()
          } else {
            thisVue.getDatasetWait()
          }
          thisVue.$message({
            showClose: true,
            message: 'Modified success!',
            type: 'success'
          })
        }).catch(_ => {
          return false
        })
      }).catch(_ => {
        return false
      })
    },
    fail (formPrice) {
      // console.log(formPrice)
      thisVue.$refs[formPrice].validate(valid => {
        if (valid) {
          let API = ''
          if (thisVue.formPrice.type === 'model') {
            API = 'model_zoo'
          } else {
            API = 'dataset_zoo'
          }
          let num = ''
          if (thisVue.formPrice.market) {
            num = 3
          } else {
            num = 2
          }
          eiqDetail('patch', API, {id: thisVue.formPrice.id, audit_comment: thisVue.formPrice.audit_comment, trade_status: num}).then(json => {
            // console.log(json.data)
            if (thisVue.formPrice.type === 'model') {
              thisVue.getModelWait()
            } else {
              thisVue.getDatasetWait()
            }
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
    toMarket (obj, type) {
      // console.log(obj)
      thisVue.dialogMaket = true
      let {id, audit_comment, market} = obj
      thisVue.formPrice = {id, audit_comment, market}
      thisVue.formPrice.type = type
    },
    closeDialogPrice (formPrice) {
      thisVue.dialogMaket = false
      thisVue.formPrice = {
        id: null,
        audit_comment: null,
        market: true
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
            is_public: thisVue.form.is_public,
            publisher: thisVue.form.publisher,
            network: thisVue.form.network
          }
          // console.log(params)
          eiqDetail('patch', 'model_zoo', params).then(json => {
            // console.log(json.data)
            thisVue.getTable()
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
    submitFormDataset (formDataset) {
      thisVue.dialogVisible = true
      thisVue.$refs[formDataset].validate(valid => {
        if (valid) {
          // console.log(thisVue.formDataset)
          eiqDetail('patch', 'dataset_zoo', thisVue.formDataset).then(json => {
            // console.log(json.data)
            thisVue.getDataset()
            thisVue.$message({
              showClose: true,
              message: 'Modified success!',
              type: 'success'
            })
            thisVue.dialogVisible = false
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
        'firstTitle': thisVue.$t('marketplace'),
        'firstRouterName': 'zoo_model_list',
        'secondTitle': thisVue.$t('list')
      }
      // Common.setPageHeaderData(thisVue, pageHeaderData)
      thisVue.$store.dispatch('setPageHeaderData', pageHeaderData)
      thisVue.getSolution()
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

  .table-btn{padding: 0px;margin: 0px;}
  .filter-box .el-input{vertical-align: middle;}
  /*.filter-box div.search-input,.filter-box button,.filter-box btn-filter{ float:left;height:32px;margin-bottom:15px;}*/
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
</style>
<style>
  .page-type .el-button i{ padding-right:0;font-size:16px !important;}
  /*.icon-btn-container .el-button i{ font-size:16px;}*/
  /*.icon-btn-container i, .icon-btn-container.icon-downloadLog{ color:#223c53;font-size:16px;}*/
  /*.icon-btn-container i:hover, .icon-btn-container.icon-downloadLog:hover{ color:#5ca3e2;}*/
  /*.icon-btn-container.icon-downloadLog{ position:relative;top:1px;}*/
</style>
