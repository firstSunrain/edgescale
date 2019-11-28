<template>
  <div class='block-card'>
    <el-row :gutter='20'>
      <el-col :span='12' class='box-card-container col-bottom' v-for="(value, key, index) in list" :key='key'>
        <el-card class="box-card" :class="setClass(key%6)">
          <div slot="header" class="clearfix">
            <div class='card-tit'>
              <div class="block-w n-link"><router-link :to="{name: 'task_detail', params: {taskId: value.id}}" title="">{{value.id}}</router-link></div>
          </div>
          </div>
          <ul class='card-ul'>
            <ul class="card-ul-inner dashed">
              <li class='li-bottom'>
                <div class="block-type">{{ $t('upper_status') }}</div>
                <div class="block-w con-wrap">
                  <el-button type='info' size="mini" v-if="value.status == 'Done'">{{ value.status }}</el-button>
                  <el-button type='success' size="mini" v-else-if="value.status == 'Running'">{{ value.status }}</el-button>
                  <el-button type='warning' size="mini" v-else-if="value.status == 'Ready'">{{ value.status }}</el-button>
                  <el-button type='danger' size="mini" v-else>{{ value.status }}</el-button>
                </div>
              </li>
              <li class='li-bottom'>
                <div class="block-type">{{ $t('upper_type') }}</div>
                <div class="block-w">{{value.type}}</div>
              </li>
            </ul>
            <ul class="card-ul-inner">
              <li>
                <div class="block-type">{{ $t('upper_create_time') }}</div>
                <div class="block-w">{{value.create_time}}</div>
              </li>
            </ul>
          </ul>
          <div class="card-opr-container">
            <el-dropdown class='card-opr' trigger='click' placement='right'>
              <span class="el-dropdown-link" style="display: none;"><i class="iconfont icon-gengduo"></i></span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item><div @click="saveTemplate(value.id)"><i class='icon-floppy-disk'></i> {{ $t('save_as_template') }}</div></el-dropdown-item>
                <el-dropdown-item class='drop-del'><div @click="delTemplate(value.id)"><i class='icon-bin'></i> {{ $t('delete') }}</div></el-dropdown-item>
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
    delTemplate (id) {
      thisVue.$emit('delTemplate', id)
    },
    saveTemplate (id) {
      thisVue.$emit('saveTemplate', id)
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
