<template>
  <div class='block-card'>
    <el-row :gutter='20'>
      <el-col :span='12' class='box-card-container col-bottom' v-for="(value, key) in list" :key='key'>
        <el-card class="box-card" :class="setClass(key%6)">
          <div slot="header" class="clearfix">
            <div class='card-tit'>
              <div class="block-w n-link"><router-link :to="{name: 'template_detail', params: {id: value.id}}" title="">{{value.name}}</router-link></div>
          </div>
          </div>
          <ul class='card-ul'>
            <ul class="card-ul-inner dashed">
              <li class='li-bottom'>
                <div class="block-type">{{ $t('upper_description') }}</div>
                <div class="block-w con-wrap">{{value.desc}}</div>
              </li>
            </ul>
            <ul class="card-ul-inner">
              <li>
                <div class="block-type">{{ $t('upper_create_time') }}</div>
                <div class="block-w">{{value.created_at}}</div>
              </li>
              <li>
                <div class="block-type">{{ $t('upper_update_time') }}</div>
                <div class="block-w">{{value.updated_at}}</div>
              </li>
            </ul>
          </ul>
          <div class="card-opr-container">
            <el-dropdown class='card-opr' trigger='click' placement='right'>
              <span class="el-dropdown-link" style="display: none;"><i class="iconfont icon-gengduo"></i></span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item><div @click="$router.push({name: 'template_edit', params: {id: value.id}})"><i class='iconfont icon-deployment'></i> {{ $t('deploy') }}</div></el-dropdown-item>
                <el-dropdown-item class='drop-del'><div @click="delTemplate(key, true)"><i class='icon-bin'></i> {{ $t('delete') }}</div></el-dropdown-item>
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
    delTemplate (index, type) {
      thisVue.$emit('delTemplate', index, type)
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
  /*.block-card.bg-gray{ background:#f4f4f7;}*/
</style>
