<template>
  <div class='block-card'>
    <el-row :gutter='20'>
      <el-col :span='12' class='box-card-container col-bottom' v-for="(value, key) in list" :key='key'>
        <el-card class="box-card" :class="setClass(key%6)">
          <div slot="header" class="clearfix">
            <div class='card-tit'>
              <div class="block-w n-link"><router-link :to="{name: 'solution_detail', params: {id: value.id}}" v-bind:title="value.solution">{{value.solution}}</router-link></div>
            </div>
          </div>
          <ul class='card-ul'>
            <ul class="card-ul-inner dashed">
              <li class='li-bottom'>
                <div class="block-type">{{ $t('upper_permission') }}</div>
                <div class="block-w">
                  <span class="status-on" type='success' size="small" v-if="value.is_public">{{ $t('upper_public') }}</span>
                  <span class="status-private" type='danger' size="small" v-else="!value.is_public">{{ $t('upper_private') }}</span>
                </div>
              </li>
              <li class='li-bottom'>
                <div class="block-type">{{ $t('upper_version') }}</div>
                <div class="block-w">{{value.version}}</div>
              </li>
            </ul>
            <ul class="card-ul-inner dashed">
              <li class='li-bottom'>
                <div class="block-type">{{ $t('upper_model') }}</div>
                <div class="block-w">{{value.model.model}}</div>
              </li>
              <li class='li-bottom'>
                <div class="block-type">{{ $t('upper_platform') }}</div>
                <div class="block-w">{{value.model.platform}}</div>
              </li>
            </ul>
            <ul class="card-ul-inner">
              <li>
                <div class="block-type">{{ $t('upper_type') }}</div>
                <div class="block-w">{{value.model.type}}</div>
              </li>
              <li>
                <div class="block-type">{{ $t('upper_vendor') }}</div>
                <div class="block-w">{{value.model.vendor}}</div>
              </li>
            </ul>
          </ul>
          <div class="card-opr-container">
            <el-dropdown class='card-opr' trigger='click' placement='bottom'>
              <span class="el-dropdown-link" style="display: none;"><i class="iconfont icon-gengduo"></i></span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <div @click="deploySolution(value)"><i class='iconfont icon-deployment'></i> {{ $t('deploy') }}</div>
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
    deploySolution (val) {
      thisVue.$emit('deploySolution', val)
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
  /**/
</style>
