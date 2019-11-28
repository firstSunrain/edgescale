<template>
  <!-- Details -->
  <div name="list" class='detail-box' v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading....">
    <el-row class="panel-body">
      <el-col :span='24' class='opr-box opr-box-space opr-box-container'>
        <div class='opr-tit'>
          <span v-if='deviceData.display_name'>{{deviceData.display_name}}</span>
          <span v-else>{{deviceData.name}}</span>
        </div>
      </el-col>
      <el-col :span='24'>
        <el-tabs v-model="activeName" class='dev-tab' @tab-click="checkTab">
          <el-tab-pane label="Basic Information" name="1"><basicInfo :deviceId='deviceId' @deviceData='getData' /></el-tab-pane>
          <el-tab-pane label="App Deployment" name="2"><appDpl v-if="activeName == '2'" :deviceId='deviceId' /></el-tab-pane>
          <el-tab-pane label="Device Logs" name="4">
            <el-tabs v-model="logActive" class='log-tab' type="border-card" @tab-click="handleTab">
              <el-tab-pane :label="$t('sysLog')" name="sys"><div :style='logBox' v-html='sysLog'></div></el-tab-pane>
              <el-tab-pane :label="$t('mqttLog')" name="mqtt"><div :style='logBox' v-html='mqttLog'></div></el-tab-pane>
              <el-tab-pane :label="$t('kubeLog')" name="kubelet"><div :style='logBox' v-html='kubeLog'></div></el-tab-pane>
            </el-tabs>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
  <!-- /details -->
</template>
<script>
  import { getDevLogUrl, getDevLogTxt } from '@/api'
  import basicInfo from './item/info'
  import appDpl from './item/appdpl'
  let thisVue = null

  export default {
    components: { basicInfo, appDpl },
    data () {
      return {
        deviceId: this.$route.params.deviceId,
        deviceData: {name: 'Default', status: 'offline'},
        activeName: '1',
        logActive: 'sys',
        sysLog: '',
        mqttLog: '',
        kubeLog: '',
        puppetLog: '',
        loading: false,
        logBox: {
          'maxHeight': '420px',
          'overflow-y': 'scroll'
        }
      }
    },
    methods: {
      handleTab (tab, event) {
        thisVue.getLogUrl(tab.name)
      },
      checkTab (tab, event) {
        if (tab.name === '4') {
          thisVue.handleTab({name: 'sys'})
        }
      },
      getData (data) {
        thisVue.deviceData = data
      },
      readMore () {
        thisVue.logBox.maxHeight = parseInt(thisVue.logBox.maxHeight) + 1000 + 'px'
      },
      getLogUrl (type) {
        thisVue.loading = true
        let params = {deviceid: thisVue.deviceData.name, logtype: type}
        getDevLogUrl(params).then(dat => {
          let res = dat.data
          thisVue.getLogTxt(type, res.url)
        }).catch(_ => {
          return false
        })
      },
      getLogTxt (type, url) {
        getDevLogTxt(url).then(dat => {
          let res = dat.data
          thisVue.loading = false
          if (type === 'sys') {
            res = res.replace(/(\[\s*\d+\.\d+\])/g, '<br/>$1')
            thisVue.sysLog = res
          } else if (type === 'mqtt') {
            res = res.replace(/time=/g, '<br/>time=')
            thisVue.mqttLog = res
          } else if (type === 'kubelet') {
            res = res.replace(/(\d{2}:\d{2}:\d{2})/g, '<br/>$1')
            thisVue.kubeLog = res
          } else if (type === 'puppet') {
            thisVue.puppetLog = res
          }
        }).catch(_ => {
          thisVue.loading = false
          thisVue.$message({type: thisVue.$t('error'), message: thisVue.$t('network_slow')})
        })
      }
    },
    mounted () {
      thisVue = this
    }
  }
</script>
<style scoped>
  .panel-body{ padding:0;position: relative;}
  .opr-box-container{ overflow:hidden;}
  .opr-box-space{ margin-bottom:10px;overflow: hidden;position: absolute;top: 5px;left: 0px;font-size: 16px;}
</style>
<style>
  .el-button.edit i{ margin-left: 5px;color:#223c53;}
  .el-button.edit i:hover{ color:#5ca3e2;}
  .ve-gauge canvas{top: -70px !important;}
  .dev-tab .el-tabs__nav-wrap::after{height: 1px;}
  .dev-tab .el-tabs__nav{float: right;}
  .dev-tab .el-tabs__item{color: #245682;}
  .dev-tab .el-tabs__item.is-active{color: #245682;}
  .dev-tab .el-tabs__active-bar{background-color: #245682;}
  .log-tab .el-tabs__nav{float: left;text-align: center;}
  .log-tab .el-tabs__nav-wrap::after{display: none;}
  .log-tab .el-tabs__header{background-color: #e9eef3;border-bottom: none;}
  .log-tab .el-tabs__item.is-active{background-color: #fff;}
  .log-tab .el-tabs__content{padding: 0px 0px 0px 10px;}
</style>
