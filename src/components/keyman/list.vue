<template>
  <div class="key-box" v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading...">
    <el-row>
      <el-col :span='24' class=''>
        <el-col :span='22' class='filter-box'>
          <el-input suffix-icon='el-icon-search' size='small' v-model='filter_text' class='common-input common-input-filter' @keyup.13.native='getTable' :placeholder="$t('filter_by_name')"></el-input>
          <el-button class="common-btn" size='small' @click="showDialog('add')">
            <i class="icon-googleplus5"></i>
            <span>{{ $t('create') }}</span>
          </el-button>
        </el-col>
        <el-col :span='2' class='page-type'>
          <el-button-group>
            <el-button :class="{'active':page_list==true}" icon="icon-list2" size='mini' @click="page_list=true"></el-button>
            <el-button :class="{'active':page_list==false}" icon="icon-grid6" size='mini' @click="page_list=false"></el-button>
          </el-button-group>
        </el-col>
      </el-col>
      <el-col :span='24' class='com-table'>
        <el-table :data='tableData' size='small' v-if="page_list" @header-click='sortTable'>
          <el-table-column :label="$t('name')" width='200'>
            <template slot-scope='scope'>
              <router-link :to="{name: 'keyman_detail', params: {id: scope.row.id}}">{{scope.row.name}}</router-link>
            </template>
          </el-table-column>
          <el-table-column prop='create_time' sortable='true' :label="$t('create_time')" width='160'>
            <template slot-scope='scope'>
              <span>{{scope.row.create_time | dateFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column prop='update_time' sortable='true' :label="$t('update_time')" width='160'>
            <template slot-scope='scope'>
              <span>{{scope.row.update_time | dateFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column prop='fingerprint' :label="$t('value')"></el-table-column>
          <el-table-column :label="$t('action')" width='100'>
            <template slot-scope='scope'>
              <el-tooltip class="item" effect="dark" :content="$t('download')" placement="top">
                <i class="table-btn icon-download4" @click="downloadFile(scope.$index)"></i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="$t('edit')" placement="top">
                <i class="table-btn icon-pencil5" @click="showDialog('edit', scope.$index)"></i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="$t('delete')" placement="top">
                <i class="table-btn icon-trash" @click="del(scope.$index)"></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <modelBlock :list='tableData' @editCustomer='showDialog' @delCustomer='del' v-else></modelBlock>
      </el-col>
      <el-col :span='24' class='page-bar common-page'>
        <el-pagination background @current-change="handleCurrentChange"  @size-change="handleSizeChange" :current-page="page.number" :page-sizes="[10, 20, 30, 40]" :page-size="page.size" popper-class='page-pop' layout="total, slot, sizes, prev, pager, next" :total="page.total">
        </el-pagination>
      </el-col>
    </el-row>
    <!-- create Dialog -->
    <el-dialog :title='dialogTit' :visible.sync='dialogVisible' :show-close='true' :close-on-click-modal='false'>
      <div v-loading='dialogLoading' element-loading-spinner="el-icon-loading" element-loading-text="loading...">
        <el-form ref='form' size='small' :model='form' :rules='rules' label-width='130px'>
          <el-form-item :label="$t('name')" prop='name'>
            <el-input type="text" v-model='form.name'></el-input>
          </el-form-item>
          <div v-if="dialogType == 'add'">
            <el-form-item :label="$t('type')" prop='is_auto'>
              <el-select v-model='is_auto'>
                <el-option :value="true" :label="$t('key_auto')"></el-option>
                <el-option :value="false" :label="$t('key_upload')"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('root_key_hash')" prop='key_value' v-if='!is_auto'>
              <el-input type="textarea" v-model='form.key_value'></el-input>
            </el-form-item>
            <el-form-item :label="$t('key_strength')" prop='key_strength'>
              <el-select v-model='form.key_strength'>
                <el-option value="2048" label="2048"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('key_algorithm')" prop='key_algo'>
              <el-select v-model='form.key_algo'>
                <el-option value="RSA" label="RSA"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <el-form-item :label="$t('description')" prop='description'>
            <el-input type="textarea" v-model='form.description'></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" style='text-align: right;'>
          <el-button size='small' @click="closeDialog">{{ $t('cancel') }}</el-button>
          <el-button size='small' type="primary" @click="submitForm('form')">{{ $t('submit') }}</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getKeyList, keyDelete, keyOperation, downloadKeyFile } from '@/api'
import modelBlock from './block'
let thisVue = null

export default {
  data () {
    return {
      loading: true,
      filter_text: '',
      tableData: [],
      cur_id: null,
      page_list: true,
      is_auto: true,
      orderType: '',
      orderBy: '',
      page: {
        size: 10,
        total: 0,
        number: 1
      },
      form: {
        name: '',
        description: '',
        key_value: '',
        key_strength: '2048',
        key_algo: 'RSA',
        id: ''
      },
      rules: {
        name: [{required: true, trigger: 'blur', message: this.$t('rule_name_require')}],
        key_value: [{required: true, trigger: 'blur', message: this.$t('rule_key_require')}]
      },
      dialogTit: this.$t('create'),
      dialogVisible: false,
      dialogType: 'add',
      dialogLoading: false
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
      let params = {limit, offset, orderType: thisVue.orderType, orderBy: thisVue.orderBy, filter_text: thisVue.filter_text}
      getKeyList(params).then(dat => {
        let res = dat.data
        thisVue.loading = false
        thisVue.tableData = res.list
        thisVue.page.total = res.total
      }).catch(_ => {
        thisVue.loading = false
      })
    },
    del (index) {
      let id = thisVue.tableData[index].id
      thisVue.$confirm(thisVue.$t('want_to_continue'), thisVue.$t('delete'), {type: 'warning'}).then(_ => {
        thisVue.loading = true
        keyDelete(id).then(dat => {
          let res = dat.data
          thisVue.loading = false
          if (res.status === 'success') {
            thisVue.$message({message: thisVue.$t('del_success'), type: 'success'})
            thisVue.getTable()
          } else {
            thisVue.$message({message: thisVue.$t('del_fail'), type: 'error'})
            thisVue.loading = false
          }
        }).catch(_ => {
          thisVue.loading = false
        })
      }).catch(_ => {
        return false
      })
    },
    downloadFile (index) {
      let id = thisVue.tableData[index].id
      let filename = thisVue.tableData[index].name + '.pem'
      thisVue.$confirm(thisVue.$t('want_to_continue'), thisVue.$t('download'), {type: 'warning'}).then(_ => {
        thisVue.loading = true
        downloadKeyFile(id, 'application/x-x509-ca-cert').then(dat => {
          let res = dat.data
          thisVue.loading = false
          if (res) {
            thisVue.downloadCSV(res, filename, 'application/x-x509-ca-cert')
          } else {
            thisVue.$message({message: thisVue.$t('operation_fail'), type: 'error'})
          }
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
    submitForm (form) {
      let url = 'key'
      let method = 'post'
      let params = thisVue.form
      if (thisVue.dialogType === 'edit') {
        url = `key/${thisVue.form.id}`
        method = 'put'
      }
      thisVue.$refs[form].validate(valid => {
        if (valid) {
          thisVue.dialogLoading = true
          keyOperation(method, url, params).then(dat => {
            let res = dat.data
            thisVue.dialogLoading = false
            if (res.status === 'fail') {
              thisVue.$message({message: thisVue.$t('operation_fail'), type: 'error'})
            } else {
              thisVue.$message({message: thisVue.$t('operation_success'), type: 'success'})
              thisVue.closeDialog()
              thisVue.getTable()
            }
          }).catch(_ => {
            thisVue.$message({message: thisVue.$t('operation_fail'), type: 'error'})
            thisVue.dialogLoading = false
          })
        }
      })
    },
    showDialog (type, index) {
      thisVue.dialogType = type
      thisVue.dialogVisible = true
      if (type === 'edit') {
        thisVue.dialogTit = thisVue.$t('edit')
        let val = thisVue.tableData[index]
        let {name, description, id} = val
        thisVue.form = {name, description, id, key_value: val.key_value, key_strength: val.key_strength, key_algo: val.key_algo}
      } else {
        thisVue.dialogTit = thisVue.$t('create')
        thisVue.form = {name: '', description: ''}
      }
    },
    closeDialog () {
      thisVue.$refs['form'].resetFields()
      thisVue.dialogVisible = false
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
    thisVue.getTable()
  },
  components: { modelBlock }
}
</script>
<style scoped>
  .opr-box{padding-bottom: 15px;}
  .el-select{width: 100%;}
  .filter-box .el-input{vertical-align: middle;}
  .page-type{text-align: right;}
  .page-type .el-button{margin:4px;padding: 0px; color: #c7cbd2;
    border-color: #fff;
    background-color: #fff;}
  .page-type .el-button:focus,.page-type .el-button.active {
    color: #1a2e40;
    border-color: #fff;
    background-color: #fff;
  }
</style>
<style>
  .page-type .el-button i{ padding-right:0;font-size:16px !important;}
  .upload-icon input{display: none;}
  .btn-filter button{ height:32px;}
</style>
