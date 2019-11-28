<template>
<el-row v-loading='loading' element-loading-spinner='el-icon-loading' element-loading-text='loading...'>
  <el-col :span='24'>
    <el-col :span='16'>
      <!-- name -->
      <el-input size='small' class='common-input' @keyup.native.13='getAllDevices' v-model='filterAttr.filter_name' :placeholder="$t('filter_by_name')"></el-input>
      <!-- location -->
      <el-select class="common-input" size='small' @change='getAllDevices' v-model="filterAttr.filter_location" filterable clearable :placeholder="$t(`filter_by_location`)">
        <el-option v-for="item in locations" :key="item" :label="item" :value="item"></el-option>
      </el-select>
      <!-- model -->
      <el-select class="common-input" size='small' v-if="type != 'solution'" @change='getAllDevices' v-model='filterAttr.filter_model' filterable clearable :placeholder="$t('filter_by_model')">
          <el-option v-for='(item, key) in models' :key='key' :value="item.id" :ref="`model${item.id}`" :label="`${item.model}-${item.type}-${item.platform}-${item.vendor}`"></el-option>
          <a class='get-more' @click='getAllModels'>{{ $t('more') }}...</a>
      </el-select>
      <!-- tags -->
      <el-select class="common-input" size='small' @change='getAllDevices' v-model="filterAttr.filter_tag" filterable clearable :placeholder="$t('filter_by_tags')">
        <el-option v-for="item in tags" :key="item.id" :label="item.name" :value="item.name"></el-option>
      </el-select>
      <!-- btn opr -->
      <slot name='btnOpr'></slot>
    </el-col>
    <el-col :span='8'>
      <slot name='other'></slot>
    </el-col>
  </el-col>
  <el-col :span='24'>
    <div class="com-table">
      <el-table :data='list' size='small' @selection-change="handleSelectionChange" @header-click='sortTable'>
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column width='300' :label="$t('name')">
          <template slot-scope='scope'>
            <span class='con-wrap' v-if='scope.row.display_name'>{{scope.row.display_name}}</span>
            <span class='con-wrap' v-else>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('model')">
          <template slot-scope='scope'>
            {{scope.row.mode.model}}-{{scope.row.mode.type}}-{{scope.row.mode.platform}}-{{scope.row.mode.vendor}}
          </template>
        </el-table-column>
        <el-table-column sortable='true' :label="$t('create_time')" prop='created_at' width='200'></el-table-column>
        <el-table-column :label="$t('status')">
          <template slot-scope='scope'>
            <el-button class="status-on" size="mini" v-if="scope.row.status === 'online'">{{ $t('upper_online') }}</el-button>
            <el-button class="status-off" size="mini" v-else="!scope.row.status === 'offline'">{{ $t('upper_offline') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class='common-page'>
      <el-pagination background @current-change="handleCurrentChange"  @size-change="handleSizeChange" :current-page="page.number" :page-sizes="[10, 20, 30, 40]" :page-size="page.size" popper-class='page-pop' layout="total, slot, sizes, prev, pager, next" :total="page.total">
      </el-pagination>
    </div>
  </el-col>
</el-row>
</template>
<script>
import { getDevList, getDevTagList, getDevAttrsList, getDevAttrName, getModelList } from '@/api'
let thisVue = null

export default {
  props: ['modelId', 'type'],
  data () {
    return {
      loading: true,
      list: [],
      filterAttr: {
        filter_location: '',
        filter_tag: '',
        filter_model: '',
        filter_name: ''
      },
      locations: [],
      models: [],
      tags: [],
      page: {
        size: 10,
        total: 0,
        number: 1
      }
    }
  },
  methods: {
    getAllDevices () {
      thisVue.loading = true
      let limit = thisVue.page.size
      let offset = limit * (thisVue.page.number - 1)
      let {filter_location, filter_tag, filter_name, filter_model, orderBy, orderType} = thisVue.filterAttr
      let params = {filter_location, filter_tag, filter_name, filter_model, limit, offset, orderBy, orderType}
      getDevList(params).then(dat => {
        let res = dat.data
        thisVue.loading = false
        if (res && res.results) {
          thisVue.list = res.results
          thisVue.page.total = res.total
        }
      }).catch(_ => {
        thisVue.loading = false
        return false
      })
    },
    getAllDeviceAttributes () {
      getDevAttrsList().then(dat => {
        let res = dat.data
        if (res && res.attributes) {
          res.attributes.map(item => {
            if (item.name === 'location') {
              thisVue.getAllDeviceAttributeValuesById(item.id)
            }
          })
        }
      }).catch(_ => {
        return false
      })
    },
    getAllDeviceAttributeValuesById (id) {
      getDevAttrName({attr_id: id}).then(dat => {
        let res = dat.data
        if (res) {
          thisVue.locations = res.values
        }
      }).catch(_ => {
        return false
      })
    },
    getAllModels () {
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
    getAllTags () {
      getDevTagList().then(dat => {
        let res = dat.data
        if (res) {
          thisVue.tags = res
        }
      }).catch(_ => {
        return false
      })
    },
    handleSelectionChange (val) {
      thisVue.$emit('getSelDev', val)
    },
    handleCurrentChange (val) {
      thisVue.page.currentPage = val
      thisVue.getAllDevices()
    },
    handleSizeChange (val) {
      thisVue.page.pageSize = val
      thisVue.getAllDevices()
    },
    sortTable (column, event) {
      if (column.sortable) {
        thisVue.filterAttr.orderBy = column.property
        if (column.order) {
          thisVue.filterAttr.orderType = column.order.substring(0, column.order.length - 6)
        }
        thisVue.getAllDevices()
      }
    }
  },
  mounted () {
    thisVue = this
    thisVue.getAllDeviceAttributes()
    thisVue.getAllTags()
    if (thisVue.type !== 'solution') {
      thisVue.getAllModels()
      thisVue.getAllDevices()
    }
  },
  watch: {
    modelId: function (cur, old) {
      thisVue.filterAttr.filter_model = cur
      thisVue.getAllDevices()
    }
  }
}
</script>
<style>
</style>
