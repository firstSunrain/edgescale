<template>
  <div name="list" class='task-template detail-box'>
    <el-row class='list-box' v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading....">
      <div class="media stack-media-on-mobile text-left opr-box-container">
      <el-col :span='24' class='opr-box'>
        <el-col :span='18'>
          <div style='font-size: 2rem;vertical-align: middle;'>{{basicInfo.name}}</div>
        </el-col>
          <div class="btn-group">
            <el-button class="common-btn together-btn" size='small' type='primary' @click="$router.push({name: 'template_edit', params: {id: curId}})"><i class="iconfont icon-deployment"></i>{{ $t('deploy') }}</el-button>
            <el-button class="common-btn together-btn" size='small' @click='getInfo(curId)'><i class="icon-rotate-cw3"></i>{{ $t('refresh') }}</el-button>
          </div>
      </el-col>
      </div>

      <el-col :span='24' class='basic-box'>
        <el-collapse v-model='activeNames'>
          <!-- basic -->
          <el-collapse-item name='1'>
            <template slot='title'>
              <span class='collapse-tit'>{{ $t('basic_info') }}</span>
            </template>
            <ul>
              <li v-for="(value, key) in basicInfo" :key='key'>
                <label style='font-size: 15px;'>
                  <i class='icon-diamond4 info-icon'></i>
                  <span style='padding: 0px 6px;font-weight: bold;'>{{key | capitalize}}:</span>
                  <span style='color: #444;'>{{value}}</span>
                </label>
              </li>
            </ul>
          </el-collapse-item>
          <!-- app -->
          <el-collapse-item class='app-card' name='2' v-if="basicInfo.type == 'deploy_app'">
            <template slot='title'>
              <span class='collapse-tit'>{{ $t('upper_application') }}</span>
            </template>
            <div class='card-box' v-for='(value, key) in apps' :key='key'>
              <div class='card-con'>
                <span class="version">{{value.version}}</span>
                <img :src="value.image" width='60px' height='60px'>
                <h4>{{value.name}}</h4>
                <p>{{value.description}}</p>
              </div>
              <div class="card-tit">
              </div>
            </div>
          </el-collapse-item>

          <!-- device -->
          <el-collapse-item name='3'>
            <template slot='title'>
              <span class='collapse-tit'>{{ $t('upper_device') }}</span>
            </template>
            <deviceTable :groupId='groupId' :devices='devices'></deviceTable>
          </el-collapse-item>
        </el-collapse>
      </el-col>

    </el-row>
  </div>
</template>

<script>
  import { taskTemplateInfo } from '@/api'
  import deviceTable from './devtable'
  let thisVue = null

  export default {
    components: { deviceTable },
    data () {
      return {
        basicInfo: {},
        loading: true,
        apps: [],
        devices: [],
        groupId: '',
        status: '',
        activeNames: ['1', '2', '3'],
        curId: this.$route.params.id
      }
    },
    filters: {
      capitalize (val) {
        if (!val) return ''
        val = val.toString()
        return thisVue.$t(val)
      }
    },
    methods: {
      getInfo (id) {
        thisVue.loading = true
        taskTemplateInfo(id).then(dat => {
          let res = dat.data
          thisVue.loading = false
          let {name, desc} = res
          thisVue.basicInfo = {name, desc}
          thisVue.basicInfo.type = res.body.type
          if (res.body.group_id) {
            thisVue.groupId = res.body.group_id
          }
          if (res.tr && res.body.type === 'deploy_app') {
            thisVue.apps = res.tr.payload
          }
          if (res.tr.device_ids) {
            thisVue.devices = res.tr.device_ids
          }
        }).catch(_ => {
          thisVue.loading = false
        })
      }
    },
    mounted () {
      thisVue = this
      thisVue.getInfo(thisVue.curId)
    }
  }
</script>

<style scoped>
  .opr-box{padding-bottom: 15px;}
  .el-collapse{ padding:0;}
  .el-collapse li{list-style: none;}
  .info-icon{font-size: 10px; color: #7badff;}
  .cell .el-button--mini{width: 100px;}
  .card-box{ overflow:hidden; margin: 0px 5px;width: 240px;float: left;margin-bottom:20px;background-color: #fff;border-radius:10px;}
  .card-tit{padding:0 3px 0 10px;background-color: #90adc5;line-height: 40px;font-size: 14px;position: relative;}
  .card-tit .card-del{ color:#fff;}
  .card-tit .card-del span{ margin-right: 2px;display:inline-block;}
  .card-tit .card-del i{ margin-left: 8px;cursor: pointer;}
  .card-tit .card-del span:hover{ cursor:pointer; color:#245682;}
  .card-con{ position:relative; padding: 20px 20px 0;height: auto;overflow: hidden;text-align: center;}
  .card-con h4{ margin: 8px 0px 0px;font-size: 18px;color: #245682;}
  .card-con img{border-radius: 50%;}
  .card-con p{ overflow: hidden;margin-bottom:18px;height:20px; color:#a2a9af;font-size:14px;line-height: 18px;}
  .card-con .version { position: absolute;right: 0;top: 0;padding: 0px 5px;background: #d5d9dd;color: #fff;border-bottom-left-radius: 12px;}
  .collapse-tit{border-left: 2px solid #245682;padding-left: 10px;}
</style>
<style>
  .app-card .el-collapse-item__wrap{padding: 20px 16px 0;background-color: #f7f7f7;}
</style>
