<template>
  <div class="page-filter">
    <!-- name -->
    <el-input size='small' class='common-input' @keyup.native.13='getTable' v-model='filterAttr.filter_name' :placeholder="$t('filter_by_name')"></el-input>
    <!-- location -->
    <el-select class="common-input" size='small' @change='getTable' v-model="filterAttr.filter_location" filterable clearable :placeholder="$t(`filter_by_location`)">
      <el-option v-for="item in locations" :key="item" :label="item" :value="item"></el-option>
    </el-select>
    <!-- model -->
    <el-select class="common-input" size='small' @change='getTable' v-model='filterAttr.filter_model' filterable clearable :placeholder="$t('filter_by_model')">
        <el-option v-for='(item, key) in models' :key='key' :value="item.id" :ref="`model${item.id}`" :label="`${item.model}-${item.type}-${item.platform}-${item.vendor}`"></el-option>
        <a class='get-more' @click='getAllModels'>{{ $t('more') }}...</a>
    </el-select>
    <!-- tags -->
    <el-select class="common-input" size='small' @change='getTable' v-model="filterAttr.filter_tag" filterable clearable :placeholder="$t('filter_by_tags')">
      <el-option v-for="item in tags" :key="item.id" :label="item.name" :value="item.name"></el-option>
    </el-select>
  </div>
</template>
<script>
import { getDevTagList, getDevAttrsList, getDevAttrName, getModelList } from '@/api'
let thisVue = null

export default {
  data () {
    return {
      loading: true,
      filterAttr: {
        filter_location: '',
        filter_tag: '',
        filter_model: '',
        filter_name: ''
      },
      locations: [],
      models: [],
      tags: []
    }
  },
  methods: {
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
    getTable () {
      thisVue.$emit('getFilter', thisVue.filterAttr)
    }
  },
  mounted () {
    thisVue = this
    thisVue.getAllDeviceAttributes()
    thisVue.getAllModels()
    thisVue.getAllTags()
  }
}
</script>
<style>
</style>
