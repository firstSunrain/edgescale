<template>
  <div name="list" class='app-list'>
    <el-row class='list-box' v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading....">
      <el-col :span='24' class='opr-box'>
        <div class='page-filter'>
          <el-input suffix-icon='el-icon-search' size='small' v-model='filter_text' class='common-input common-input-filter' @keyup.13.native='getTable' :placeholder="$t('filter_by_name')"></el-input>
          <!-- filter status -->
          <el-select class="common-input" size='small' @change='getTable' v-model="filter_type" clearable :placeholder="$t(`filter_by_type`)">
            <el-option :label="$t('upper_public')" value="public"></el-option>
            <el-option :label="$t('upper_private')" value="private"></el-option>
          </el-select>
          <el-button class="common-btn" size='small' :disabled='!isDel' @click="deletePrj">
            <i class="icon-trash"></i>
            <span>{{ $t('delete') }}</span>
          </el-button>
          <el-button class="common-btn" size='small' @click="showDialog('create')">
            <i class="icon-googleplus5 text-size-base"></i>
            <span>{{ $t('create') }}</span>
          </el-button>
        </div>
      </el-col>
      <el-col :span='24' class='com-table'>
        <el-table :data='tableList' align='center' @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label='Name'>
            <template slot-scope='scope'>
              {{scope.row.name}}
            </template>
          </el-table-column>
          <el-table-column :label="$t('permission')" width='120'>
            <template slot-scope='scope'>
              <span class="status-on" size="mini" v-if="scope.row.public">{{ $t('upper_public') }}</span>
              <span class="status-private" size="mini" v-else="!scope.row.public">{{ $t('upper_private') }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('desc')" prop='desc'></el-table-column>
          <el-table-column label='Action' width='150'>
            <template slot-scope='scope'>
              <!-- <el-tooltip effect="dark" content="edit" placement="top-start">
                <i class="icon-pencil7 table-btn" @click="showDialog('edit', scope.row.id)"></i>
              </el-tooltip> -->
              <el-tooltip effect="dark" content="delete" placement="top-start">
                <i class="icon-trash table-btn" @click='deletePrj(scope.$index)'></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span='24' class='common-page'>
        <el-pagination background @current-change="handleCurrentChange"  @size-change="handleSizeChange" :current-page="cur_page" :page-sizes="[10, 20, 30, 40]" :page-size="page_size" popper-class='page-pop' layout="total, sizes, prev, pager, next" :total="total">
        </el-pagination>
      </el-col>
    </el-row>
    <!-- create dialog -->
    <el-dialog :visible.sync='comDialog' :title="$t(dialogType)" :show-close='true' :close-on-click-modal='false'>
      <createMirror @closeDialog='closeDialog' v-if="dialogType == 'create'"></createMirror>
      <editMirror @closeDialog='closeDialog' v-if="dialogType == 'edit'" :mirrorId='cur_id'></editMirror>
    </el-dialog>
  </div>
</template>

<script>
  import { mirrorList, mirrorDelete } from '@/api'
  import createMirror from './create'
  import editMirror from './edit'

  let thisVue = null

  export default {
    components: { createMirror, editMirror },
    data () {
      return {
        tableList: [],
        comDialog: false,
        dialogType: 'create',
        filter_text: '',
        filter_type: '',
        loading: true,
        cur_id: '',
        isDel: 0,
        selItem: [],
        cur_page: 1,
        page_size: 10,
        total: 0
      }
    },
    methods: {
      getTable () {
        thisVue.loading = true
        let offset = (thisVue.cur_page - 1) * thisVue.page_size
        let limit = thisVue.page_size
        let params = {filter_text: thisVue.filter_text, limit, offset, filter_type: thisVue.filter_type}
        mirrorList(params).then(dat => {
          let res = dat.data
          thisVue.loading = false
          thisVue.total = res.total
          if (res.registries && res.registries.length >= 0) {
            thisVue.tableList = res.registries
          }
        }).catch(_ => {
          thisVue.loading = false
        })
      },
      handleSelectionChange (val) {
        thisVue.isDel = val.length
        thisVue.selItem = val.map(item => {
          return item.id
        })
      },
      closeDialog () {
        thisVue.comDialog = false
        thisVue.getTable()
      },
      showDialog (type, val) {
        thisVue.comDialog = true
        thisVue.dialogType = type
        thisVue.cur_id = val
      },
      deletePrj (index) {
        thisVue.$confirm(thisVue.$t('want_to_continue'), thisVue.$t('delete'), {type: 'error'}).then(() => {
          let params = {}
          if (typeof index === 'number') {
            params.ids = [thisVue.tableList[index].id]
          } else {
            params.ids = thisVue.selItem
          }
          thisVue.loading = true
          mirrorDelete(params).then(dat => {
            let res = dat.data
            thisVue.loading = false
            if (res.status === 'success') {
              thisVue.$message({ message: res.message, type: 'success' })
              thisVue.getTable()
            } else {
              thisVue.$message({ type: 'error', message: res.message })
            }
          }).catch(_ => {
            thisVue.loading = false
          })
        }).catch(() => {
          return false
        })
      },
      handleCurrentChange (val) {
        thisVue.cur_page = val
        thisVue.getTable()
      },
      handleSizeChange (val) {
        thisVue.page_size = val
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
  .app-list{min-height: 500px;}
  .list-box{background-color: #fff;padding: 0px 20px 20px 20px;}
  .opr-box{padding: 15px 0px;}
  .list-tit{padding: 15px 20px; font-size: 2rem; border-bottom: 1px solid #ddd;}
  .page-bar{text-align:right; padding: 15px 20px;}
  .cell .el-button--mini{width: 100px;}
  .page-slot{font-weight: lighter;color: #606266;}
</style>
