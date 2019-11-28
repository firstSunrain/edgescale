<template>
  <div class='block-card block-card-app'>
    <el-row :gutter='20'>
      <el-col :span='12' class='box-card-container col-bottom' v-for="(value, key) in list" :key='key'>
        <el-card class="box-card" :class="setClass(key%6)">
          <div slot="header" class="clearfix">
            <div class='card-tit'>
              <div class="block-w n-link n-link-app">
                <router-link class="app-img-link" :to="{}" title=""><img :src="value.image" width='30' height="30" class='table-img' alt=""></router-link>
                <router-link class="name-link" :to="{name: 'app_detail', params: {id: value.id}}" :title="value.name">{{value.name}}</router-link>
              </div>
            </div>
          </div>
          <ul class='card-ul'>
            <ul class="card-ul-inner">
              <li>
                <div class="block-type">{{ $t('upper_permission') }}</div>
                <div class="block-w">
                  <el-button type='success' size="mini" v-if="value.is_public">{{ $t('upper_public') }}</el-button>
                  <el-button type='danger' size="mini" v-else="!value.is_public">{{ $t('upper_private') }}</el-button>
                </div>
              </li>
              <li>
                <div class="block-type">{{ $t('upper_description') }}</div>
                <div class="block-w con-wrap">{{value.description}}</div>
              </li>
            </ul>
          </ul>
          <div class="card-opr-container">
            <el-dropdown class='card-opr' trigger='click' placement='bottom'>
              <span class="el-dropdown-link" style="display: none;"><i class="iconfont icon-gengduo"></i></span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <div @click="editModel(value.id)"><i class='iconfont icon-deployment'></i> {{ $t('deploy') }}</div>
                </el-dropdown-item>
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
  methods: {
    editModel (val) {
      thisVue.$emit('editModel', val)
    },
    delModel (id) {
      thisVue.$emit('delModel')
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
  .table-img{float: left; margin-right: 10px;}
</style>
<style>
  .block-card-app.block-card .box-card .el-card__header{ height:54px;padding: 7px 12px 6px;}
  .block-card-app .box-card-container .n-link .app-img-link img{float: left;
    margin-right: 10px;
    width: 44px;
    height: 44px;
    border: 3px solid rgba(255,255,255,0.3);}
  .block-card-app .box-card-container .n-link .app-img-link{ margin-top:-17px;}
  .block-card-app .box-card-container .n-link .name-link{ padding-left:49px;}
</style>
