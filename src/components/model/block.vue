<template>
  <div class='block-card'>
    <el-row :gutter='20'>
      <el-col :span='12' class='box-card-container col-bottom' v-for="(value, key) in list" :key='key'>
        <el-card class="box-card" :class="setClass(key%6)">
          <div slot="header" class="clearfix">
            <div class='card-tit'>
              <div class="block-w n-link"><router-link :to="{name: 'model_detail', query: {id: value.id, is_owner: value.is_owner}}" :title="value.model">{{value.model}}</router-link></div>
            </div>
          </div>
          <ul class='card-ul'>
            <ul class="card-ul-inner dashed">
              <li class='li-bottom'>
                <div class="block-type">{{ $t('upper_platform') }}</div>
                <div class="block-w">{{value.platform}}</div>
              </li>
              <li class='li-bottom'>
                <div class="block-type">{{ $t('upper_type') }}</div>
                <div class="block-w">{{value.type}}</div>
              </li>
            </ul>
            <ul class="card-ul-inner">
              <li>
                <div class="block-type">{{ $t('upper_vendor') }}</div>
                <div class="block-w">{{value.vendor}}</div>
              </li>
              <li>
                <div class="block-type">{{ $t('upper_permission') }}</div>
                <div class="block-w">
                  <span class="status-on" size="mini" v-if="value.is_public">{{ $t('upper_public') }}</span>
                  <span class="status-private" size="mini" v-else="!value.is_public">{{ $t('upper_private') }}</span>
                </div>
              </li>
            </ul>
          </ul>
          <div class="card-opr-container">
            <el-dropdown class='card-opr' trigger='click' placement='right'>
              <span class="el-dropdown-link" style="display: none;"><i class="iconfont icon-gengduo"></i></span>
              <el-dropdown-menu slot="dropdown">
                <template v-if='value.is_owner'>
                  <!-- <el-dropdown-item><div @click='edit(value.id)'><i class='icon-pencil5'></i> {{ $t('edit') }}</div></el-dropdown-item> -->
                  <el-dropdown-item><div @click="del(key)"><i class='icon-trash'></i> {{ $t('delete') }}</div></el-dropdown-item>
                </template>
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
    del (id) {
      thisVue.$emit('del', id)
    },
    edit (id) {
      thisVue.$emit('edit', 'edit', id)
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
  .box-card{position: relative;}
  .col-bottom{margin-bottom: 20px;}
  .card-ul{padding: 0px;margin: 0px;height: auto;overflow: hidden;}
  .card-ul > li{float: left; width: 50%;list-style: none;height: 70px;}
  .li-100{width: 100%;}
  .drop-del{color: #8e1c1c;}
  .box-card .el-card__header{background-color: #f2f2f2;padding: 10px 20px;}
</style>
