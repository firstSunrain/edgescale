  <template>
  <div class='block-card'>
    <el-row :gutter='20'>
      <el-col :span='12' class='box-card-container col-bottom' v-for="(value, key) in list" :key='key'>
        <el-card class="box-card" :class="setClass(key%6)">
          <div slot="header" class="clearfix">
            <div class='card-tit'>
              <div class="block-w n-link">
                <router-link :to="{name:'device_detail',params: { deviceId: value.id }}">
                  <span v-if='value.display_name'>{{value.display_name}}</span>
                  <span v-else>{{value.name}}</span>
                </router-link>
                <router-link v-if='value.has_sub' :to="{name: 'device_sub_list', params: {id: value.id}}" class='tree-link'>
                <i class="table-btn icon-tree6"></i>
              </router-link>
              </div>
            </div>
          </div>
          <ul class='card-ul'>
            <ul class="card-ul-inner dashed">
              <li class='li-bottom'>
                <div class="block-type">{{ $t('upper_status') }}</div>
                <div class="block-w">
                  <el-button class='status-on' size="mini" v-if="value.status=='online'">{{ $t('upper_online') }}</el-button>
                  <el-button class='status-off' size="mini" v-else="value.status=='offline'">{{ $t('upper_offline') }}</el-button>
                </div>
              </li>
              <li class='li-bottom'>
                <div class="block-type">{{ $t('upper_app_number') }}</div>
                <div class="block-w">{{value.app_num}}</div>
              </li>
            </ul>
            <ul class="card-ul-inner dashed">
              <li>
                <div class="block-type">{{ $t('upper_create_time') }}</div>
                <div class="block-w">{{value.created_at}}</div>
              </li>
              <li>
                <div class="block-type">{{ $t('upper_last_time') }}</div>
                <div class="block-w con-wrap">{{value.last_report}}</div>
              </li>
            </ul>
            <ul class="card-ul-inner dashed">
              <li>
                <div class="block-type">{{ $t('upper_cpu_usage') }}</div>
                <div class="block-w">{{value.cpu_usage}}</div>
              </li>
              <li>
                <div class="block-type">{{ $t('upper_mem_usage') }}</div>
                <div class="block-w con-wrap">{{value.mem_usage}}</div>
              </li>
            </ul>
            <ul class="card-ul-inner">
              <li class='li-bottom li-100 tags-wrap'>
                <div class="block-type">{{ $t('upper_tags') }}</div>
                <div class="block-w" style="height: 33px;">
                  <el-button size='small' icon='el-icon-plus' @click='addNewTag(key)' v-if='!value.isAdd'>{{ $t('new_tag') }}</el-button>
                  <el-input :id="`tag_${key}`" size='small' v-model='tag' @keyup.13.native='bindTag(value.id, key)' v-if='value.isAdd'></el-input>
                  <template v-for='(item, index) in value.tags'>
                    <el-tag :type='type[index]' v-if='index<=2' closable @close='delTag(value.id, item.name)' :key="`${key}-${index}`">{{item.name}}</el-tag>
                    <router-link v-if='index==3' :to="{name:'device_detail',params: { deviceId: value.id }}">{{ $t('more') }} >></router-link>
                  </template>
                </div>
              </li>
            </ul>
          </ul>
          <div class="card-opr-container">
            <el-dropdown class='card-opr' trigger='click' placement='right'>
              <span class="el-dropdown-link" style="display: none;"><i class="iconfont icon-gengduo"></i></span>
              <el-dropdown-menu slot="dropdown">
                <template v-if="value.lifecycle != 'retired'">
                  <el-dropdown-item v-if="value.lifecycle === 'active'"><div @click="enrollDevice(value.name, 'INACTIVE', 'Inactive')"><i class='icon-switch'></i> {{ $t('Inactive') }}</div></el-dropdown-item>
                  <el-dropdown-item v-else><div @click="enrollDevice(value.name, 'ACTIVE', 'Active')" style="color: rgb(218,76,96);"><i class='icon-switch'></i> {{ $t('Active') }}</div></el-dropdown-item>
                  <template v-if="value.status == 'online'">
                    <el-dropdown-item><div @click='destroy(key)'><i class="table-btn iconfont icon-xiaohuiwenjian"></i> {{ $t('destroy') }}</div>
                    </el-dropdown-item>
                    <el-dropdown-item><div @click="changeStatus('reset', key)"><i class="table-btn iconfont icon-reset"></i> {{ $t('reset') }}</div>
                    </el-dropdown-item>
                    <el-dropdown-item><div @click="changeStatus('reboot', key)"><i class="table-btn iconfont icon-reboot1"></i> {{ $t('reboot') }}</div>
                    </el-dropdown-item>
                  </template>
                </template>
                <el-dropdown-item><div @click="delDevice(key)"><i class='icon-bin'></i> {{ $t('delete') }}</div></el-dropdown-item>
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
      tag: '',
      type: ['success', 'danger', 'warning']
    }
  },
  methods: {
    enrollDevice (name, enrollStatus, operateName) {
      thisVue.$emit('enrollDevice', name, enrollStatus, operateName)
    },
    delTag (deviceId, tagName) {
      thisVue.$emit('delTag', deviceId, tagName)
    },
    delDevice (key) {
      thisVue.$emit('delDevice', key)
    },
    destroy (key) {
      thisVue.$emit('destroy', key)
    },
    changeStatus (type, key) {
      thisVue.$emit('changeStatus', type, key)
    },
    bindTag (deviceId, key) {
      thisVue.$emit('bindTag', [deviceId], thisVue.tag)
    },
    addNewTag (key) {
      thisVue.tag = ''
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
  .tags-wrap .el-tag,.tags-wrap .el-button{height: 28px;padding: 0 9px;}
</style>
