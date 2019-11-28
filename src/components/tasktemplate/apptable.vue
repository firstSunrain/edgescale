<template>
  <div class="detail-box" v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading...">
    <el-row>
      <el-col :span='24'>
        <div class="page-filter">
        <el-input class="common-input" size='small' :placeholder="$t('filter_by_name')" v-model='filter_text'></el-input>
        <el-button class="common-btn" icon='icon-search4' @click='getTable' size='small'>{{ $t('search') }}</el-button>
        </div>
      </el-col>
      <el-col class='com-table' :span='24'>
        <el-table :data='tableData' @selection-change="handleSelectionChange" size='small'>
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column :label="$t('name')">
            <template slot-scope='scope'>
              <div class='table-id'>{{scope.row.name}}</div>
              <img :src="scope.row.image" width='30' height="30" alt="" class='table-img'>
            </template>
          </el-table-column>
          <el-table-column prop='description' :label="$t('description')"></el-table-column>
          <el-table-column sortable='true' :label="$t('permission')">
            <template slot-scope='scope'>
              <span class="status-on" type='success' size="mini" v-if="scope.row.is_public">{{ $t('upper_public') }}</span>
              <span class="status-private" type='danger' size="mini" v-else="!scope.row.is_public">{{ $t('upper_private') }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span='24' class='common-page'>
        <el-pagination background @current-change="handleCurrentChange"  @size-change="handleSizeChange" :current-page="page.number" :page-sizes="[10, 20, 30, 40]" :page-size="page.size" popper-class='page-pop' layout="total, slot, sizes, prev, pager, next" :total="page.total">
        </el-pagination>
      </el-col>
      <el-col :span='24' class="dialog-footer">
        <el-button @click="closeDialog" size='small'>{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="submitChange" size='small'>{{ $t('submit') }}</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { applicationList } from '@/api'
let thisVue = null

export default {
  props: ['groupId'],
  data () {
    return {
      loading: false,
      filter_text: '',
      tableData: [],
      selDev: [],
      page: {
        size: 10,
        total: 0,
        number: 1
      },
      createAppForm: {
        dynamic_commands: '',
        dynamic_args: '',
        dynamic_host_network: false,
        dynamic_ports: [{ containerPort: '', hostPort: '' }],
        dynamic_volumes: [{ mountPathReadOnly: false, hostPath: '', mountPath: '' }],
        dynamic_env: [{ name: '', value: '' }],
        dynamic_cap_add: false
      }
    }
  },
  methods: {
    getTable () {
      let {size, number} = thisVue.page
      let offset = size * (number - 1)
      let limit = size
      thisVue.loading = true
      applicationList({limit, offset}).then(dat => {
        let res = dat.data
        thisVue.loading = false
        thisVue.tableData = res.applications
        thisVue.page.total = res.total
      }).catch(_ => {
        thisVue.loading = false
      })
    },
    submitChange () {
      thisVue.$emit('getSelectApp', {selApp: thisVue.selDev})
    },
    handleSelectionChange (val) {
      thisVue.selDev = val.map(item => {
        let params = item
        params.payload = {application_id: item.id, parameters: thisVue.createAppForm, version: 'latest'}
        return params
      })
    },
    handleCurrentChange (val) {
      thisVue.cur_page = val
      thisVue.getTable()
    },
    handleSizeChange (val) {
      thisVue.page_size = val
      thisVue.getTable()
    },
    closeDialog () {
      thisVue.$emit('closeDialog')
    }
  },
  mounted () {
    thisVue = this
    thisVue.getTable()
  }
}
</script>
<style scoped>
  .opr-box .el-input{width: 240px;}
  .table-id{display: inline-block;}
  .table-img{border-radius: 50%;float: right;}
  .dialog-footer{ margin-top: 18px;padding-top: 18px;text-align: right;border-top: 1px solid #e9edf1;}
</style>
<style>

</style>
