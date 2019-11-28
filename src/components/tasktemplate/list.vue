<template>
  <div class="task-template" v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading...">
    <el-row>
      <el-col :span='24'>
        <div class="page-filter">
        <el-col :span='22'>
          <el-input class='common-input' suffix-icon='el-icon-search' size='small' v-model='filter_name' @keyup.13.native='getTable' clearable :placeholder="$t('filter_by_name')"></el-input>
          <el-button class="common-btn" size='small' @click="removeTemplate(selTempt)" type='danger' :disabled='selTempt.length == 0'><i class="icon-trash"></i>{{ $t('delete') }}</el-button>
        </el-col>
        </div>
        <div class="device-switch">
          <el-col class='page-type'>
            <el-button-group class="list-block-toggle">
              <el-button :class="{'active':page_list==true}" icon="icon-list2" size='mini' @click="page_list=true"></el-button>
              <el-button :class="{'active':page_list==false}" icon="icon-grid6" size='mini' @click="page_list=false"></el-button>
            </el-button-group>
          </el-col>
        </div>
      </el-col>
      <el-col class='com-table' :span='24'>
        <el-table :data='tableData' size='small' v-if="page_list" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="45"></el-table-column>
          <el-table-column sortable='true' :label="$t('name')">
            <template slot-scope='scope'>
              <router-link :to="{name: 'template_detail', params: {id: scope.row.id}}">{{scope.row.name}}</router-link>
            </template>
          </el-table-column>
          <el-table-column sortable='true' prop='created_at' :label="$t('create_time')"></el-table-column>
          <el-table-column sortable='true' prop='updated_at' :label="$t('update_time')"></el-table-column>
          <el-table-column :label="$t('action')" width='140'>
            <template slot-scope='scope'>
              <el-tooltip class="item" effect="dark" :content="$t('deploy')" placement="top">
                <i class="table-btn iconfont icon-deployment" @click="$router.push({name: 'template_edit', params: {id: scope.row.id}})"></i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="$t('delete')" placement="top">
                <i class="table-btn icon-trash" @click='removeTemplate(scope.$index, true)'></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <modelBlock :list='tableData' @delTemplate='removeTemplate' v-else></modelBlock>
      </el-col>
      <el-col :span='24' class="common-page">
        <el-pagination background @current-change="handleCurrentChange"  @size-change="handleSizeChange" :current-page="page.number" :page-sizes="[10, 20, 30, 40]" :page-size="page.size" popper-class='page-pop' layout="total, slot, sizes, prev, pager, next" :total="page.total">
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { taskTemplateList, taskTemplateDelete } from '@/api'
import modelBlock from './block'
let thisVue = null

export default {
  data () {
    return {
      loading: true,
      filter_name: '',
      tableData: [],
      page_list: true,
      selTempt: [],
      page: {
        size: 10,
        total: 0,
        number: 1
      }
    }
  },
  methods: {
    getTable () {
      thisVue.loading = true
      let {size, number} = thisVue.page
      let offset = size * (number - 1)
      let limit = size
      let params = {limit, offset, filter_name: thisVue.filter_name}
      taskTemplateList(params).then(dat => {
        let res = dat.data
        thisVue.loading = false
        thisVue.tableData = res.items
        thisVue.page.total = res.total
      }).catch(_ => {
        thisVue.loading = false
      })
    },
    removeTemplate (ids, type) {
      thisVue.$confirm(thisVue.$t('del_tem_msg'), thisVue.$t('delete'), {type: 'error', closeOnClickModal: false}).then(_ => {
        thisVue.loading = true
        if (type) {
          ids = [thisVue.tableData[ids].id]
        }
        taskTemplateDelete({ids: ids}).then(dat => {
          let res = dat.data
          thisVue.loading = false
          if (res.status === 'success') {
            thisVue.$message({type: res.status, message: res.message})
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
    handleCurrentChange (val) {
      thisVue.page.number = val
      thisVue.getTable()
    },
    handleSizeChange (val) {
      thisVue.page.size = val
      thisVue.getTable()
    },
    handleSelectionChange (val) {
      thisVue.selTempt = val.map(item => {
        return item.id
      })
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
  .search-input{width: 300px;margin-right: 10px;}
  .table-btn{padding: 0px;margin: 0px;}
  .el-select{width: 100%;}
</style>
