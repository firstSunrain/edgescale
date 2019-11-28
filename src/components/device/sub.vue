<template>
  <div class="detail-box" v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading....">
    <el-row class='list-box'>
      <el-col :span='24' class='opr-box'>
        <el-col :span='22'>
          <div style='font-size: 2rem;vertical-align: middel;'>{{basicInfo.display_name}}</div>
        </el-col>
        <el-col :span='2' class='page-type'>
          <el-button-group>
            <el-button :class="{'active':page_list==true}" icon="icon-list2" size='mini' @click="page_list=true"></el-button>
            <el-button :class="{'active':page_list==false}" icon="icon-grid6" size='mini' @click="page_list=false"></el-button>
          </el-button-group>
        </el-col>
      </el-col>
      <el-col class='com-table' :span='24'>
        <el-table :data='tableData' size='small' v-if="page_list" @expand-change='expandChange' :row-key='getRowKeys' :expand-row-keys="expands">
          <el-table-column type="expand">
            <template slot-scope="props">
              <div v-loading='itemLoading' element-loading-spinner="el-icon-loading" element-loading-text="loading....">
                <div class='expand-left'><i class="iconfont icon-OTApeizhi"></i></div>
                <div class='expand-middle'>
                  <el-form :model='form' ref='form' size='mini' label-width='100px'>
                    <el-col :span='12' class='dash-line'>
                      <h4 class='type-tit'>{{ $t('upper_attr') }}</h4>
                      <template v-for='(value, key) in attributes'>
                        <el-form-item class='com-form' :label="value.name" :prop='value.name' v-if='value.value_list'>
                          <el-select v-if='isEdit[key]' v-model="form[value.name]">
                            <el-option v-for="(item, index) in value.value_list" :value="item" :label="`${item}`" :key="`${value.name}${index}`"></el-option>
                          </el-select>
                          <span v-else>{{value.value}}</span>
                          <span class='attr-btn'>
                            <i class="icon-pencil7" v-if='!isEdit[key]' @click="canEdit('attr', key)"></i>
                            <i class="icon-exit" v-else @click="updateAttr(props.row.id, key)"></i>
                          </span>
                        </el-form-item>
                        <el-form-item class='com-form' :label="value.name" v-else>
                          <span>{{ value.value }}</span>
                        </el-form-item>
                      </template>
                    </el-col>
                    <el-col :span='12'>
                      <h4 class='type-tit'>{{ $t('upper_firmware') }}</h4>
                      <el-form-item class='com-form' :label="$t('name')">
                        <el-select v-model='otaForm.firmware' v-if='isEditOta && firmwares.length'>
                          <el-option v-for='(item, key) in firmwares' :key='key' :value="item.id" :label="item.solution"></el-option>
                          <a class='get-more' @click='getFirmwares(props.row.model_id)'>{{ $t('more') }}...</a>
                        </el-select>
                        <span v-else>{{ota.name}}</span>
                        <span class='attr-btn'>
                          <i class="icon-pencil7" v-if='!isEditOta' @click="canEdit('ota')"></i>
                          <i class="icon-exit" v-else @click="changeOta(props.row.id)"></i>
                        </span>
                      </el-form-item>
                      <el-form-item class='com-form' :label="$t('version')">
                        <span>{{ota.version}}</span>
                      </el-form-item>
                      <el-form-item class='com-form' :label="$t('create_time')">
                        <span>{{ota.create_time | dateFormat}}</span>
                      </el-form-item>
                      <el-form-item class='com-form' :label="$t('update_time')">
                        <span>{{ota.update_time | dateFormat}}</span>
                      </el-form-item>
                      
                    </el-col>
                  </el-form>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop='name' :label="$t('name')"></el-table-column>
          <el-table-column prop='model' :label="$t('model')"></el-table-column>
          <el-table-column prop='update_time' :label="$t('update_time')">
            <template slot-scope='scope'>
              <span>{{scope.row.update_time | dateFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column prop='create_time' :label="$t('create_time')">
            <template slot-scope='scope'>
              <span>{{scope.row.create_time | dateFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('action')" width='100'>
            <template slot-scope='scope'>
              <el-tooltip class="item" effect="dark" :content="$t('edit')" placement="top">
                <i class="table-btn icon-pencil7" @click="showDialog(scope.$index)"></i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="$t('delete')" placement="top">
                <i class="table-btn icon-trash" @click='delSubDev(scope.$index)'></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <comBlock :list='tableData' :attributes='attributes' :isEdit='isEdit' @changeOta='changeOta' :isEditOta='isEditOta' @canEdit='canEdit' :ota='ota' :firmwares='firmwares' :form='form' :otaForm='otaForm' @updateAttr='updateAttr' @getAttr='expandChange' @eidtSubDev='showDialog' @delSubDev='delSubDev' v-else></comBlock>
      </el-col>
    </el-row>
    <!-- edit dialog -->
    <el-dialog :visible.sync='comDialog' :title="$t('edit')" :show-close='true' :close-on-click-modal='false'>
      <editSub @closeDialog='closeDialog' :curItem='curItem'></editSub>
    </el-dialog>
  </div>
</template>
<script>
  import { getSubdev, getDevInfo, getSubdevAttr, getSubdevOta, changeSubdevAttr, solutionList, deleteSubdev, changeSubdevOta } from '@/api'
  import comBlock from './sub_block'
  import editSub from './sub_edit'

  let thisVue = null
  export default {
    components: { comBlock, editSub },
    data () {
      return {
        page_list: true,
        comDialog: false,
        loading: false,
        itemLoading: false,
        getRowKeys (row) {
          return row.id
        },
        expands: [],
        devId: '',
        isEdit: [],
        isEditOta: false,
        tableData: [],
        form: {},
        otaForm: {firmware: ''},
        basicInfo: {},
        curItem: {},
        firmwares: [],
        ota: {},
        attributes: []
      }
    },
    methods: {
      getTable () {
        thisVue.loading = true
        getSubdev({device_id: thisVue.devId}).then(dat => {
          let res = dat.data
          thisVue.tableData = res
          thisVue.loading = false
        }).catch(_ => {
          thisVue.loading = false
        })
      },
      getDetail () {
        thisVue.loading = true
        getDevInfo(thisVue.devId).then(dat => {
          let res = dat.data
          thisVue.basicInfo = res.device_info
          thisVue.loading = false
        }).catch(_ => {
          thisVue.loading = false
        })
      },
      getAttributes (id) {
        thisVue.itemLoading = true
        getSubdevAttr({id}).then(dat => {
          let res = dat.data
          thisVue.attributes = res
          thisVue.isEdit = []
          for (let i = 0; i < res.length; i++) {
            thisVue.isEdit.push(false)
          }
          thisVue.itemLoading = false
        }).catch(_ => {
          thisVue.itemLoading = false
        })
      },
      getOta (id) {
        getSubdevOta({id}).then(dat => {
          let res = dat.data
          thisVue.ota = res
        }).catch(_ => {
          thisVue.itemLoading = false
        })
      },
      getFirmwares (id) {
        let offset = thisVue.firmwares.length
        solutionList({model_id: id, offset, limit: 10, my_solution: true}).then(dat => {
          let res = dat.data
          res.results.map(item => {
            thisVue.firmwares.push(item)
          })
        }).catch(_ => {
          return false
        })
      },
      canEdit (type, key) {
        if (type === 'attr') {
          thisVue.$set(thisVue.isEdit, key, true)
        } else {
          thisVue.isEditOta = true
        }
      },
      delSubDev (index) {
        thisVue.$confirm(thisVue.$t('want_to_continue'), thisVue.$t('delete'), {type: 'warning'}).then(_ => {
          thisVue.loading = true
          let id = thisVue.tableData[index].id
          deleteSubdev(id).then(dat => {
            thisVue.loading = false
            let res = dat.data
            if (res.code === 0) {
              thisVue.$message({type: 'success', message: res.message})
              thisVue.getTable()
            } else {
              thisVue.$message({type: 'error', message: res.message})
            }
          }).catch(_ => {
            thisVue.loading = false
          })
        }).catch(_ => {
          thisVue.loading = false
        })
      },
      updateAttr (id, key) {
        thisVue.itemLoading = true
        let params = {id}
        let arr = []
        for (let item in thisVue.form) {
          let _params = {name: item, value: thisVue.form[item]}
          arr.push(_params)
        }
        params.attribute = arr
        changeSubdevAttr(params).then(dat => {
          let res = dat.data
          thisVue.itemLoading = false
          if (res.code === 0) {
            thisVue.$message({type: 'success', message: res.message})
            thisVue.isEdit[key] = false
            thisVue.form = {}
            thisVue.getAttributes(id)
          } else {
            thisVue.$message({type: 'error', message: res.message})
          }
        }).catch(_ => {
          thisVue.itemLoading = false
        })
      },
      changeOta (id) {
        changeSubdevOta({id, ota_id: thisVue.otaForm.firmware}).then(dat => {
          let res = dat.data
          if (res.code === 0) {
            thisVue.$message({type: 'success', message: res.message})
            thisVue.isEditOta = false
            thisVue.getOta(id)
          } else {
            thisVue.$message({type: 'error', message: res.message})
          }
        }).catch(_ => {
          return false
        })
      },
      expandChange (row, expanded) {
        if (expanded && expanded.length) {
          thisVue.expands = []
          if (row) {
            thisVue.expands.push(row.id)
          }
        } else {
          thisVue.expands = []
        }
        thisVue.getAttributes(row.id)
        thisVue.getOta(row.id)
        thisVue.getFirmwares(row.model_id)
      },
      showDialog (index) {
        thisVue.comDialog = true
        thisVue.curItem = thisVue.tableData[index]
      },
      closeDialog () {
        thisVue.comDialog = false
        thisVue.getTable()
      }
    },
    filters: {
      capitalize (val) {
        if (!val) return ''
        val = val.toString()
        return thisVue.$t(val)
      },
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
    mounted () {
      thisVue = this
      thisVue.devId = thisVue.$route.params.id
      thisVue.getTable()
      thisVue.getDetail()
    }
  }
</script>
<style scoped>
  .el-form-item{margin-bottom: 0px;}
  .expand-left{vertical-align: middle;display: inline-block;width: 8%;text-align: center;}
  .expand-left i{font-size: 6rem; color: #ffffff; border-radius: 50%; background: #245682; padding: 20px;}
  .expand-middle{display: inline-block;vertical-align: middle;width: 90%;padding-left: 50px;}
  .dash-line{box-sizing: border-box;}
  .action-box{text-align: right;}
  .expand-middle .el-col{padding-left: 10px;}
  .type-tit{font-size: 1.4rem; font-weight: bold; border-left: 2px solid #245682; line-height: 12px; padding: 0 0px 0 5px;}
  .attr-btn{padding-left: 5px;cursor: pointer;}
</style>
<style>
  .el-form-item__label{color: #245682;}
  .el-table__expanded-cell{border-left: 5px solid #245682;}
</style>
