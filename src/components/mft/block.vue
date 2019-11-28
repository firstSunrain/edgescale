<template>
  <div class='block-card'>
    <el-row :gutter='20'>
      <el-col :span='12' class='box-card-container col-bottom' v-for="(value, key) in list" :key='key'>
        <el-card class="box-card" :class="setClass(key%6)">
          <div slot="header" class="clearfix">
            <div class='card-tit'>
              <div class="block-w n-link"><router-link :to="{name: 'mft_detail', params: {id: value.id}}" title="">{{value.name}}</router-link></div>
            </div>
          </div>
          <ul class='card-ul'>
            <ul class="card-ul-inner dashed">
              <li class='li-bottom'>
                <div class="block-type">{{ $t('upper_number') }}</div>
                <div class="block-w">{{value.number}}</div>
              </li>
              <li class='li-bottom'>
                <div class="block-type">{{ $t('upper_customer') }}</div>
                <div class="block-w">{{value.customer}}</div>
              </li>
            </ul>
            <ul class="card-ul-inner">
              <li class='li-bottom'>
                <div class="block-type">{{ $t('upper_model') }}</div>
                <div class="block-w con-wrap">{{value.model}}</div>
              </li>
              <li class='li-bottom'>
                <div class="block-type">{{ $t('upper_create_time') }}</div>
                <div class="block-w">{{value.create_time | dateFormat}}</div>
              </li>
            </ul>
          </ul>
          <div class="card-opr-container">
            <el-dropdown class='card-opr' trigger='click' placement='bottom'>
              <span class="el-dropdown-link" style="display: none;"><i class="iconfont icon-gengduo"></i></span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item><div @click='downloadConfig(value.id, value.fuse_config)'><i class='icon-download4'></i> {{ $t('download') }}</div></el-dropdown-item>
                <el-dropdown-item><div @click='deleteConfig(value.id)'><i class='icon-bin'></i> {{ $t('delete') }}</div></el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
let thisVue = null
export default {
  props: ['list'],
  data () {
    return {
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
    downloadConfig (id, fuseConfig) {
      thisVue.$emit('downloadConfig', id, fuseConfig)
    },
    deleteConfig (id) {
      thisVue.$emit('deleteConfig', id)
    },
    setClass (key) {
      let obj = {}
      obj[`bgColor${key}`] = true
      return obj
    }
  },
  mounted () {
    thisVue = this
  }
}
</script>
<style scoped>
  /**/
</style>
