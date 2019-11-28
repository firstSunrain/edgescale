<template>
  <div class='block-card'>
    <el-row :gutter='20'>
      <el-col :span='12' class='box-card-container col-bottom' v-for="(value, key) in list" :key='key'>
        <el-card class="box-card" :class="setClass(key%6)">
          <div slot="header" class="clearfix">
            <div class='card-tit'>
              <div class="block-w n-link"><router-link :to="{name: 'customer_detail', params: {id: value.id}}">{{value.name}}</router-link></div>
            </div>
          </div>
          <ul class='card-ul'>
            <ul class="card-ul-inner dashed">
              <li class='li-bottom'>
                <div class="block-type">{{ $t('upper_update_time') }}</div>
                <div class="block-w">{{value.updated_at}}</div>
              </li>
              <li class='li-bottom'>
                <div class="block-type">{{ $t('upper_create_time') }}</div>
                <div class="block-w">{{value.created_at}}</div>
              </li>
            </ul>
            <ul class="card-ul-inner">
              <li class='li-bottom li-100'>
                <div class="block-type">{{ $t('upper_description') }}</div>
                <div class="block-w">{{value.description}}</div>
              </li>
            </ul>
          </ul>
          <div class="card-opr-container">
            <el-dropdown class='card-opr' trigger='click' placement='right'>
              <span class="el-dropdown-link" style="display: none;"><i class="iconfont icon-gengduo"></i></span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item><div @click="editCustomer(value)"><i class='icon-pencil5'></i> {{ $t('edit') }}</div></el-dropdown-item>
                <el-dropdown-item><div @click="delCustomer(value.id)"><i class='icon-bin'></i> {{ $t('delete') }}</div></el-dropdown-item>
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
    editCustomer (val) {
      thisVue.$emit('editCustomer', 'edit', val)
    },
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
</style>
