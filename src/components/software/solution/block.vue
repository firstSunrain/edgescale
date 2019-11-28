<template>
  <div class='block-card'>
    <el-row :gutter='20'>
      <el-col :span='12' class='box-card-container col-bottom' v-for="(value, key) in list" :key='key'>
        <el-card class="box-card" :class="setClass(key%6)">
          <div slot="header" class="clearfix">
            <div class='card-tit'>
              <div class="block-w n-link"><router-link :to="{name:'software_solution_detail',params: { solutionId: value.id }}" v-text="value.solution"></router-link></div>
            </div>
          </div>
          <ul class='card-ul'>
            <ul class="card-ul-inner dashed">
              <li class='li-bottom'>
                <div class="block-type">{{ $t('upper_model') }}</div>
                <div class="block-w con-wrap">{{value.model.model}}-{{value.model.platform}}-{{value.model.type}}-{{value.model.vendor}}</div>
              </li>
              <li>
                <div class="block-type">{{ $t('upper_version') }}</div>
                <div class="block-w">{{value.version}}</div>
              </li>
            </ul>
            <ul class="card-ul-inner dashed">
              <li class="li-100">
                <div class="block-type">{{ $t('image') }}</div>
                <div class="block-w con-wrap">{{value.image}}</div>
              </li>
            </ul>
            <ul class="card-ul-inner">
              <li class='li-bottom li-100 tags-wrap'>
                <div class="block-type">{{ $t('upper_tags') }}</div>
                <div class="block-w" style="height:33px;">
                  <el-button size='small' icon='el-icon-plus' @click='addNewTag(key)' v-if='!value.isAdd'>{{ $t('new_tag') }}</el-button>
                  <el-input size='small' v-model='tag' @keyup.13.native='bindTag(value.id, key)' v-if='value.isAdd'></el-input>
                  <template v-for='(item, index) in value.tags'>
                    <el-tag :type='type[index]' v-if='index<=2' closable @close='delTag(value.id, item.name)' :key="`${key}-${index}`">{{item.name}}</el-tag>
                    <router-link v-if='index==3' :to="{name:'software_solution_detail',params: { solutionId: value.id }}">{{ $t('more') }} >></router-link>
                  </template>
                </div>
              </li>
            </ul>
          </ul>
          <div class="card-opr-container">
            <el-dropdown class='card-opr' trigger='click' placement='right'>
              <span class="el-dropdown-link" style="display: none;"><i class="iconfont icon-gengduo"></i></span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item><div @click="deploySolution(value)"><i class='iconfont icon-deployment'></i> {{ $t('deploy') }}</div></el-dropdown-item>
                <el-dropdown-item><a :href='value.link'><i class='icon-download4'></i> {{ $t('download') }}</a></el-dropdown-item>
                <template v-if='isMySolution'>
                  <el-dropdown-item><div @click="editSolution(value)"><i class='table-btn icon-pencil5'></i> {{ $t('edit') }}</div></el-dropdown-item>
                  <el-dropdown-item><div @click="shareSolution('audit', value)"><i class='icon-hammer-wrench'></i> {{ $t('share') }}</div></el-dropdown-item>
                  <el-dropdown-item v-if='!value.is_signed && value.in_s3'><div @click="shareSolution('sign', value)"><i class='icon-pencil6'></i> {{ $t('sign') }}</div></el-dropdown-item>
                  <el-dropdown-item v-if="!value.is_default"><div @click="delSolution(key)" class='board-del'><i class='icon-bin'></i> {{ $t('delete') }}</div></el-dropdown-item>
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
  props: ['list', 'isMySolution'],
  data () {
    return {
      tag: '',
      type: ['success', 'danger', 'warning']
    }
  },
  methods: {
    deploySolution (val) {
      thisVue.$emit('deploySolution', val)
    },
    delTag (solutionId, tagName) {
      thisVue.$emit('delTag', solutionId, tagName)
    },
    bindTag (solutionId, key) {
      thisVue.$emit('bindTag', solutionId, thisVue.tag)
    },
    delSolution (val) {
      thisVue.$emit('delSolution', val)
    },
    editSolution (val) {
      thisVue.$emit('editSolution', 'edit', val)
    },
    shareSolution (type, val) {
      thisVue.$emit('shareSolution', type, val.id)
    },
    addNewTag (key) {
      thisVue.$set(thisVue.list[key], 'isAdd', true)
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
  .li-100{width: 100%;}
  .con-wrap{overflow: hidden;white-space: nowrap;text-overflow: ellipsis;width: 100%;}
  .el-tag{margin: 0px 5px;}
  .el-input{width: 80px;}
  .block-w{height: 32px; overflow: hidden;}
  .board-del{color: #b74545;}
  .board-del i{color: #b74545;}
  .card-opr li a{ color: inherit;}
  .tags-wrap .el-tag,.tags-wrap .el-button{height: 28px;padding: 0 9px;}
</style>
