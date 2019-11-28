<template>
  <div class="mft" v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading...">
    <el-row>
      <el-col :span='24'>
        <el-col :span='22' class='filter-box'>
          <el-input suffix-icon='el-icon-search' size='small' v-model='filter_text' clearable @keyup.13.native='getTable' class='common-input' :placeholder="$t('filter_by_name')"></el-input>
          <el-button size='small' class='common-btn' icon='icon-googleplus5 text-size-base' @click="dialogVisible = true"> {{ $t('create') }}</el-button>
        </el-col>
        <el-col :span='2' class='page-type'>
          <el-button-group>
            <el-button :class="{'active':page_list==true}" icon="icon-list2" size='mini' @click="page_list=true"></el-button>
            <el-button :class="{'active':page_list==false}" icon="icon-grid6" size='mini' @click="page_list=false"></el-button>
          </el-button-group>
        </el-col>
      </el-col>
      <el-col class='com-table' :span='24'>
        <el-table :data='tableData' size='small' v-if="page_list" @header-click='sortTable'>
          <el-table-column :label="$t('name')">
            <template slot-scope='scope'>
              <router-link :to="{name: 'mft_detail', params: {id: scope.row.id}}">{{scope.row.name}}</router-link>
            </template>
          </el-table-column>
          <el-table-column prop='number' :label="$t('number')"></el-table-column>
          <el-table-column prop='customer' :label="$t('customer')"></el-table-column>
          <el-table-column prop='model' :label="$t('model')"></el-table-column>
          <el-table-column sortable='true' prop='create_time' :label="$t('create_time')">
            <template slot-scope='scope'>
              <span>{{scope.row.create_time | dateFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('action')" width='100'>
            <template slot-scope='scope'>
              <el-tooltip class="item" effect="dark" :content="$t('download')" placement="top">
                <i class="table-btn icon-download4" @click='downloadFile(scope.row.id, scope.row.fuse_config)'></i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="$t('edit')" placement="top">
                <i class="table-btn icon-pencil7" @click="showDialog(scope.$index)"></i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="$t('delete')" placement="top">
                <i class="table-btn icon-trash" @click='delConfig(scope.row.id)'></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <modelBlock :list='tableData' @downloadConfig='downloadFile' @deleteConfig='delConfig' v-else></modelBlock>
      </el-col>
      <el-col :span='24' class='common-page'>
        <el-pagination background @current-change="handleCurrentChange"  @size-change="handleSizeChange" :current-page="page.number" :page-sizes="[10, 20, 30, 40]" :page-size="page.size" popper-class='page-pop' layout="total, slot, sizes, prev, pager, next" :total="page.total">
        </el-pagination>
      </el-col>
    </el-row>
    <!-- create Dialog -->
    <el-dialog :title="$t('create_mft_config')" :visible.sync='dialogVisible' :show-close='true' :close-on-click-modal='false'>
      <div v-loading='diaLoading' element-loading-spinner="el-icon-loading" element-loading-text="loading...">
        <el-form :model='mftForm' ref='mftForm' size='mini' :rules='rules' label-width='140px'>
          <el-form-item size='small' :label="$t('project_name')" prop='name'>
            <el-input v-model='mftForm.name'></el-input>
          </el-form-item>
          <el-form-item size='small' :label="$t('model')" prop='model_id'>
            <el-select v-model='mftForm.model_id'>
              <el-option v-for='(item, key) in models' :key='key' :value="item.id" :ref="`model${item.id}`" :label="`${item.model}-${item.type}-${item.vendor}-${item.platform}`"></el-option>
              <a class='get-more' @click='getModels'>{{ $t('more') }}...</a>
            </el-select>
          </el-form-item>
          <el-form-item size='small' :label="$t('number')" prop='number'>
            <el-input v-model='mftForm.number' type='number'></el-input>
          </el-form-item>
          <el-form-item size='small' :label="$t('customer_name')" prop='customer_id'>
            <el-select v-model='mftForm.customer_id' clearable>
              <el-option v-for='(value, key) in customers' :key='key' :value="value.id" :ref="`cos${value.id}`" :label='value.name'></el-option>
              <a class='get-more' @click='getCustomers'>{{ $t('more') }}...</a>
            </el-select>
          </el-form-item>
          <el-form-item size='small' :label="$t('is_fuse')" prop='is_fuse'>
            <el-switch v-model='mftForm.is_fuse' :active-text="$t('yes')" :inactive-text="$t('no')">
            </el-switch>
          </el-form-item>
          <template v-if='mftForm.is_fuse'>
            <el-form-item :label="$t('fuse_config')" prop='fuse_config_id'>
              <el-select size='small' v-model='mftForm.fuse_config_id'>
                <el-option v-for='(item, key) in fuses' :key='key' :value="item.id" :label="item.name"></el-option>
                <a class='get-more' @click='getFuses'>{{ $t('more') }}...</a>
              </el-select>
            </el-form-item>
          </template>
          <el-form-item :label="$t('tag')" prop='tags'>
            <el-select size='small' v-model='mftForm.tags' clearable multiple filterable allow-create>
              <el-option v-for='(value, key) in allTag' :key='key' :value="value.name" :label='value.name'></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" style='text-align: right;'>
          <el-button size='small' @click="closeDialog('mftForm')">{{ $t('cancel') }}</el-button>
          <el-button type='primary' size='small' @click="submitForm('mftForm')">{{ $t('submit') }}</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- add key dialog -->
    <el-dialog :title="$t('key_add_msg')" :visible.sync='keyDialog' :show-close='true' :close-on-click-modal='false'>
      <addKeyView :mftId='cur_id' @closeKeyDialog='closeKeyDialog'></addKeyView>
    </el-dialog>
  </div>
</template>

<script>
import { getMftList, getCustomerList, getModelList, getFuseList, mftCreate, mftDelete, getMftContent, getDevTagList } from '@/api'
import modelBlock from './block'
import addKeyView from './addkey'
let thisVue = null

export default {
  data () {
    return {
      loading: false,
      diaLoading: false,
      dialogVisible: false,
      keyDialog: false,
      filter_text: '',
      cur_id: '',
      orderBy: '',
      orderType: '',
      tableData: [],
      page_list: true,
      customers: [],
      models: [],
      fuses: [],
      allTag: [],
      mftForm: {
        tags: [],
        is_fuse: null,
        fuse_config_id: '',
        platform: '',
        name: '',
        model_id: '',
        customer_id: '',
        number: null
      },
      rules: {
        name: [{ required: true, message: this.$t('rule_name_require'), trigger: 'blur' }],
        model_id: [{ required: true, message: this.$t('rule_model_require'), trigger: 'change' }],
        number: [
          { required: true, message: this.$t('rule_number_require'), trigger: 'blur' },
          { pattern: /^[1-9][0-9]*/, message: this.$t('rule_number_limit'), trigger: 'blur' }
        ]
      },
      page: {
        size: 10,
        total: 0,
        number: 1
      }
    }
  },
  filters: {
    dateFormat (val) {
      if (val) {
        let _date = new Date(val)
        let y = _date.getFullYear()
        let m = _date.getMonth() + 1
        let d = _date.getDate()
        let h = _date.getHours() >= 10 ? _date.getHours() : `0${_date.getHours()}`
        let mm = _date.getMinutes() >= 10 ? _date.getMinutes() : `0${_date.getMinutes()}`
        let s = _date.getSeconds() >= 10 ? _date.getSeconds() : `0${_date.getSeconds()}`
        return `${y}-${m}-${d} ${h}:${mm}:${s}`
      } else {
        return ''
      }
    }
  },
  methods: {
    getTable () {
      thisVue.loading = true
      let {size, number} = thisVue.page
      let offset = size * (number - 1)
      let limit = size
      let params = {limit, offset, filter_text: thisVue.filter_text, orderBy: thisVue.orderBy, orderType: thisVue.orderType}
      getMftList(params).then(dat => {
        let res = dat.data
        thisVue.loading = false
        thisVue.tableData = res.list
        thisVue.page.total = res.total
      }).catch(_ => {
        thisVue.loading = false
      })
    },
    showDialog (index) {
      thisVue.cur_id = thisVue.tableData[index].id
      thisVue.keyDialog = true
    },
    getCustomers () {
      let offset = thisVue.customers.length
      getCustomerList({limit: 10, offset}).then(dat => {
        let res = dat.data
        res.customers.map(item => {
          thisVue.customers.push(item)
        })
      }).catch(_ => {
        thisVue.loading = false
      })
    },
    getTags () {
      getDevTagList().then(dat => {
        let res = dat.data
        thisVue.allTag = res
      }).catch(_ => {
        thisVue.loading = false
      })
    },
    getModels () {
      let offset = thisVue.models.length
      getModelList({limit: 10, offset}).then(dat => {
        let res = dat.data
        res.models.map(item => {
          thisVue.models.push(item)
        })
      }).catch(_ => {
        thisVue.loading = false
      })
    },
    getFuses () {
      let offset = thisVue.fuses.length
      getFuseList({limit: 10, offset}).then(dat => {
        let res = dat.data
        res.list.map(item => {
          thisVue.fuses.push(item)
        })
      }).catch(_ => {
        thisVue.loading = false
      })
    },
    submitForm (form) {
      thisVue.$refs[form].validate(valid => {
        let {name, number, tags} = thisVue.mftForm
        number = parseInt(number)
        let modelId = thisVue.mftForm.model_id
        let model = thisVue.$refs[`model${modelId}`][0].label
        let cosId = ''
        let customer = ''
        if (thisVue.mftForm.customer_id) {
          cosId = thisVue.mftForm.customer_id
          customer = thisVue.$refs[`cos${cosId}`][0].label
        }
        let params = {name, number, model, model_id: modelId, customer, customer_id: cosId, tags, is_fuse: thisVue.mftForm.is_fuse, fuse_config_id: thisVue.mftForm.fuse_config_id}
        if (valid) {
          thisVue.diaLoading = true
          mftCreate(params).then(dat => {
            let res = dat.data
            thisVue.diaLoading = false
            if (res.status === 'success') {
              thisVue.$message({message: res.message, type: 'success'})
              thisVue.closeDialog(form)
              thisVue.getTable()
            } else {
              thisVue.$message({message: res.message, type: 'error'})
            }
          }).catch(_ => {
            thisVue.diaLoading = false
          })
        }
      })
    },
    closeDialog (form) {
      thisVue.dialogVisible = false
      thisVue.$refs[form].resetFields()
      thisVue.dialogTit = thisVue.$t('create')
    },
    closeKeyDialog () {
      thisVue.keyDialog = false
    },
    delConfig (id) {
      thisVue.$confirm(thisVue.$t('confirm_tip'), thisVue.$t('delete'), {type: 'error'}).then(_ => {
        thisVue.loading = true
        mftDelete(id).then(dat => {
          let res = dat.data
          thisVue.loading = false
          thisVue.$message({type: res.status, message: res.message})
          thisVue.getTable()
        }).catch(_ => {
          thisVue.loading = false
        })
      }).catch(_ => {
        return false
      })
    },
    downloadFile (id, fuseConfig) {
      thisVue.$confirm(thisVue.$t('download_file_tip'), thisVue.$t('download'), {type: 'info'}).then(_ => {
        thisVue.loading = true
        let contentType = 'application/x-yaml'
        let fileName = `${id}.yml`
        if (fuseConfig) {
          contentType = 'application/x-compressed-tar'
          fileName = `fuse-${id}.tar.gz`
        }
        getMftContent(id, contentType).then(dat => {
          thisVue.loading = false
          let res = dat.data
          thisVue.downloadCSV(res, fileName, contentType)
        }).catch(_ => {
          thisVue.loading = false
        })
      }).catch(_ => {
        return false
      })
    },
    downloadCSV (data, fileName, type) {
      var blob = new Blob([data], {type})
      let body = document.getElementsByTagName('body')[0]
      let anchor = document.createElement('a')
      anchor.class = 'downloadDeviceCer'
      body.appendChild(anchor)
      if (window.navigator.msSaveBlob) { // IE
        window.navigator.msSaveOrOpenBlob(blob, fileName)
      } else if (navigator.userAgent.search('Firefox') !== -1) { // Firefox
        body.style.display = 'none'
        anchor.href = 'data:attachment/csv;charset=utf-8,' + encodeURIComponent(data)
        anchor.download = fileName
        anchor.click()
        anchor.remove()
      } else { // Chrome
        anchor.href = URL.createObjectURL(blob)
        anchor.download = fileName
        anchor.click()
        anchor.remove()
      }
      thisVue.loading = false
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
    },
    sortTable (column, event) {
      if (column.sortable) {
        thisVue.orderBy = column.property
        if (column.order) {
          thisVue.orderType = column.order.substring(0, column.order.length - 6)
        }
        thisVue.getTable()
      }
    }
  },
  mounted () {
    thisVue = this
    thisVue.getCustomers()
    thisVue.getModels()
    thisVue.getFuses()
    thisVue.getTable()
    thisVue.getTags()
  },
  components: { modelBlock, addKeyView }
}
</script>
<style scoped>
  .mft{ padding:20px;}
  .opr-box{padding-bottom: 15px;}
  .search-input{width: 300px;margin-right: 10px;}
  .form-box{margin-bottom: 20px;border-bottom: 1px solid #f1efef;}
  .el-select{width: 100%;}
  .filter-box .el-input{vertical-align: middle;}
  .get-more{display: block;text-align: center; line-height: 36px;font-size: 14px;}
</style>
