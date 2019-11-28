<template>
  <!-- Details -->
  <div name="list" class='task-template detail-box'>
  <el-row v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading....">
    <el-col :span='24' class='opr-box'>
      <el-col :span='18'>
        <div style='font-size: 16px;vertical-align: middle;'>{{model_info.model}}-{{model_info.type}}-{{model_info.platform}}-{{model_info.vendor}}</div>
      </el-col>
      <el-col :span='6' style='text-align:right;'>
        <el-button class="common-btn" size='small' @click='detailInfo'><i class="icon-rotate-cw3"></i>{{ $t('refresh') }}</el-button>
      </el-col>
    </el-col>
    <el-col :span='24'>
      <el-collapse v-model='activeName'>
        <el-collapse-item name='1'>
          <template slot='title'>
            <span class='collapse-tit'>{{ $t('basic_info') }}</span>
          </template>
          <ul>
            <li v-for="(value, key) in model_info" :key='key'>
              <label style='font-size: 14px;'>
                <i class='icon-diamond4 info-icon'></i>
                <span style='padding: 0px 6px;font-weight: bold;'>{{key | languageType}}:</span>
                <span style='color: #444;'>{{value}}</span>
              </label>
            </li>
          </ul>
        </el-collapse-item>
      </el-collapse>
    </el-col>
  </el-row>
  </div>
</template>
<script>
  import { getModelInfo } from '@/api'
  let thisVue = null

  export default {
    data () {
      return {
        is_owner: false,
        loading: false,
        model_info: {},
        activeName: ['1', '2']
      }
    },
    filters: {
      languageType (val) {
        if (val && thisVue.$t(val)) {
          return thisVue.$t(val)
        } else {
          return val
        }
      }
    },
    methods: {
      detailInfo () {
        thisVue.loading = true
        let id = thisVue.$route.query.id
        getModelInfo({id}).then(dat => {
          let res = dat.data
          thisVue.loading = false
          if (res) {
            let {id, model, platform, type, vendor, is_public: isPublic} = res
            let permission = ''
            if (isPublic) {
              permission = 'Public'
            } else {
              permission = 'Private'
            }
            thisVue.model_info = {id, model, platform, type, vendor, permission}
          }
        }).catch(_ => {
          thisVue.loading = false
        })
      }
    },
    mounted () {
      thisVue = this
      thisVue.detailInfo()
      thisVue.is_owner = thisVue.$route.query.is_owner
    }
  }
</script>
<style scoped>
  .opr-box-container{ overflow:hidden;}

  .el-collapse{ padding:0;}
  .info-icon{font-size: 10px; color: #7badff;}
  .collapse-tit{border-left: 2px solid #245682;padding-left: 10px;}
  .task-template{background-color: #fff; height: auto; overflow: hidden;padding: 20px;}
  .task-template .el-table__body-wrapper{overflow: hidden;}
  .task-template .el-table thead th{padding: 5px 0px;background-color: #ebeef5;}
  .task-template .el-button i{font-size: 14px;padding-right: 5px;}
  .task-template .el-table__body-wrapper{overflow: hidden;}
  .task-template .el-table thead th{padding: 5px 0px;background-color: #ebeef5;}
  .task-template .el-button i{font-size: 14px;padding-right: 5px;}
  .upload-icon input{display: none;}
</style>
<style>
  .hide {display: none;}
  .el-collapse{padding: 0px 20px;}
  .el-collapse li{list-style: none;}
</style>
