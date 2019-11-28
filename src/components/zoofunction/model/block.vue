<template>
  <div class='block-card'>
    <el-row :gutter='20'>
      <!--<el-col :span='12' class='box-card-container col-bottom' v-for="(value, key) in list" :key='key' :class="setClass(key%5)">-->
      <el-col :span='12' class='box-card-container col-bottom' v-for="(value, key) in list" :key='key'>
        <el-card class="box-card" :class="setClass(key%6)">
          <div slot="header" class="clearfix">
            <div class='card-tit'>
              <div class="block-w n-link"><router-link :to="{name: 'zoo_detail', params: {id: value.id}}">{{value.name}}</router-link></div>
            </div>
          </div>
          <ul class='card-ul'>
            <ul class="card-ul-inner">
              <li class='li-bottom' v-if="showModel === 'my'">
                <div class="block-type">{{ $t('dateUpdated') }}</div>
                <div class="block-w">{{value.date_updated}}</div>
              </li>
              <li class='li-bottom'>
                <div class="block-type">{{ $t('dateCreated') }}</div>
                <div class="block-w">{{value.date_created}}</div>
              </li>
            </ul>
            <ul class="card-ul-inner">
              <li class='li-bottom'>
                <div class="block-type li-100">{{ $t('DESCRIPTION') }}</div>
                <div class="block-w con-wrap">{{showModel === 'my' ? value.description : value.model_description}}</div>
              </li>
            </ul>
          </ul>
          <div class="card-opr-container">
            <el-dropdown class='card-opr' trigger='click' placement='right'>
              <span class="el-dropdown-link" style="display: none;"><i class="iconfont icon-gengduo"></i></span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="value.url !== null && value.url !== '' && value.url !== undefined" @click='download(value.url)'><a :href='value.url' style="color:#333;"><i class="icon-download4"></i> Download model</a></el-dropdown-item>
                <el-dropdown-item v-if="user_type === 'ADMIN' || showModel === 'my'"><div @click="delCustomer(value.id)"><i class='icon-trash'></i> Delete</div></el-dropdown-item>
                <el-dropdown-item v-if="(value.status == 2 || value.status == 3) && value.t_full_log_url !== null && value.t_full_log_url !== '' && value.t_full_log_url !== undefined && (user_type === 'ADMIN' || showModel === 'my')"><a :href='value.t_full_log_url' style="color:#333;"><i class="table-btn iconfont icon-downloadLog"></i> Download log</a></el-dropdown-item>
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
  props: ['list', 'user_type', 'showModel'],
  data () {
    return {
    }
  },
  methods: {
    delCustomer (id) {
      thisVue.$emit('delCustomer', id)
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
  .card-opr a:hover, .card-opr li:hover{ color:#5ca3e2 !important;}
</style>
