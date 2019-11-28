<template>
  <div name="list" class='zoo_box detail-box'>
    <el-row class='list-box' v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading....">
      <div class="media stack-media-on-mobile text-left opr-box-container">
        <el-col :span='24' class='opr-box'>
          <el-col :span='18'>
            <div style='font-size: 2rem;vertical-align: middel;'>{{basicInfo.name}}</div>
          </el-col>
          <div class="btn-group">
            <el-button class="common-btn together-btn" size='small' @click='getInfo(curId)'><i class="icon-rotate-cw3"></i>Refresh</el-button>
          </div>
        </el-col>
      </div>

      <el-col :span='24'>
        <el-collapse class="active-name-1" v-model='activeNames'>
          <!-- model -->
          <el-collapse-item name='1'>
            <template slot='title'>
              <span class='collapse-tit'>Model Detail</span>
            </template>
            <ul>
              <li v-for="(value, key) in basicInfo" :key='key'>
                <label style='font-size: 15px;'>
                  <i class='icon-diamond4 info-icon'></i>
                  <span style='padding: 0px 6px;font-weight: bold;'>{{key}}:</span>
                  <span style='color: #444;'>{{value}}</span>
                </label>
              </li>
            </ul>
            <el-button class="btnstyle" v-if="basicInfo.status === 2 && trainStart === false" size='small' type="primary" @click="websocketsend(basicInfo.id)">Go to training</el-button>
          </el-collapse-item>
        </el-collapse>
        <!-- Training state -->
        <el-col class="training-container" :span='24' v-if='trainStart'>
          <el-collapse class="active-name-2" v-model='activeNames'>
            <el-collapse-item name='2'>
              <template slot='title'>
                <span class='collapse-tit'>Training INFORMATION</span>
              </template>
              <div class="box">
                <el-button class="train-sta" :disabled="trainOK ? false : true" size="small" @click="dialogTableVisible = true">Training Statistics</el-button>
                <el-button class="train-down" size="small" :disabled="trainOK ? false : true" @click="download('https://eiq-cloud.s3.amazonaws.com/'+trainingRes.t_full_log_url)" type="primary">Download Full Log</el-button>
                <div class="status-container" v-if="trainStart && trainOK == false">
                  <div v-if="state === 'queue'">
                    <span class="fl" style="line-height: 32px; margin-right: 10px">In the queue, There are <span style="color: red">{{ trainingRes.q_progress }}</span> models currently being trained, Please wait...</span>
                  </div>
                  <div v-else-if="state === 'ready'">
                    <el-button class="fl" style="width:400px; margin-right: 10px" type='info' :loading="true" size="small">Ready for training, please wait a moment...</el-button>
                  </div>
                  <div v-else-if="state === 'pack'">
                    <el-button class="fl" style="width:400px; margin-right: 10px" type='info' :loading="true" size="small">Packing in progress, please wait a moment...</el-button>
                  </div>
                  <div v-else>
                    <span class="fl" style="line-height: 32px; margin-right: 10px">Training progress: </span><el-progress class="progress-container" :text-inside="true" :stroke-width="18" :percentage="trainingRes.t_progress"></el-progress>
                  </div>
                  <el-button class="train-down" size="small" type="danger" @click="stopTrain">Stop training</el-button>
                  <div class="fr" style="color:red; font-size: 15px;">In training, please do not refresh the page!</div>
                </div>
                <div v-if="trainStart && trainOK">
                  <el-button type="success" size="small" @click="download('https://eiq-cloud.s3.amazonaws.com/'+trainingRes.model_url)">Training completed! To download</el-button>
                </div>
              </div>
              <el-tabs class="tab-container" type="border-card">
                <el-tab-pane label="Training log" v-html="trainingRes.t_cur_log_url"></el-tab-pane>
              </el-tabs>
            </el-collapse-item>
          </el-collapse>
        </el-col>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  // import Common from '../../../../static/js/common.js'
  import { eiqDetail } from '@/api/api'
  import publicJS from '../../../../static/js/public.js'
  let thisVue = null

  export default {
    data () {
      return {
        basicInfo: {},
        loading: true,
        status: '',
        activeNames: ['1', '2'],
        curId: this.$route.params.id,
        trainStart: false,
        trainOK: false,
        trainingRes: {
          t_cur_log_url: '',
          t_full_log_url: '',
          q_progress: 0,
          t_progress: 0,
          t_stats_url: null,
          model_url: ''
        },
        dialogTableVisible: false,
        state: 'ready',
        inter: null,
        type: this.$route.params.type
      }
    },
    created () {
      // 页面刚进入时开启长连接
      this.initWebSocket()
    },
    destroyed: function () {
      // 页面销毁时关闭长连接
      console.log('关闭')
      this.$websocket.close()
      this.websocketclose()
      clearInterval(thisVue.inter)
    },
    methods: {
      getInfo (id) {
        if (!thisVue.loading) {
          thisVue.loading = true
        }
        let API = 'model'
        if (thisVue.type === 'my') {
          API = 'model'
        } else {
          API = 'order_model'
        }
        eiqDetail('get', API, {id: id}).then(json => {
          // console.log(json.data)
          thisVue.loading = false
          if (thisVue.type !== 'my') {
            json.data.name = json.data.m_name
          } else {
            json.data.date_updated = publicJS.timetrans(json.data.date_updated)
          }
          json.data.date_created = publicJS.timetrans(json.data.date_created)
          thisVue.basicInfo = json.data
          if (json.data.is_training && json.data.status === 1) {
            thisVue.loading = true
            let webJson = {
              'cmd': 'RECONNECT',
              'model_id': id
            }
            let time = setTimeout(() => {
              if (thisVue.$websocket.readyState === 1) {
                console.log(webJson)
                thisVue.trainStart = true
                thisVue.$websocket.send(JSON.stringify(webJson))
              }
              thisVue.loading = false
              window.clearInterval(time)
            }, 1000)
          }
        }).catch(_ => {
          thisVue.loading = false
          return false
        })
      },
      initWebSocket () {
        // const wsuri = 'ws://10.193.20.190:443'
        const wsuri = 'wss://eiqcloud.edgescale.org:443'
        this.$websocket = new WebSocket(wsuri)
        this.$websocket.onopen = this.websocketonopen
        this.$websocket.onerror = this.websocketonerror
        this.$websocket.onmessage = this.websocketonmessage
        this.$websocket.onclose = this.websocketclose
      },
      websocketonopen () {
        console.log('WebSocket连接成功')
      },
      websocketonerror (e) {
        console.log('WebSocket连接发生错误')
      },
      websocketonmessage (e) {
        console.log('服务器端发送消息：')
        console.log(e.data)
        try {
          let data = JSON.parse(e.data)
          if (data.cmd === 'TRAIN_STATUS') {   // 开始
            thisVue.state = 'start'
            let datalog = data.log.replace(new RegExp('\\n', 'gm'), '<br/>')
            thisVue.trainingRes.t_cur_log_url += datalog
            thisVue.trainingRes.t_progress = data.progress
            if (data.progress === 100) {
              thisVue.state = 'pack'
            }
          } else if (data.cmd === 'TRAIN_SUCCESS') {   // 成功
            thisVue.$notify.success({
              title: 'success',
              message: 'Completion of model training!'
            })
            thisVue.trainingRes.t_full_log_url = data.log_url
            thisVue.trainingRes.t_stats_url = data.tensorboard_url
            thisVue.trainingRes.model_url = data.model_url
            thisVue.trainOK = true
          } else if (data.cmd === 'TRAIN_FAILED') {  // 失败
            thisVue.$notify.error({
              title: 'error',
              message: 'Error occurred. Please try again!'
            })
          } else if (data.cmd === 'TRAIN_INQUEUE') {   // 排队
            thisVue.state = 'queue'
            thisVue.trainingRes.q_progress = data.queue
            let webJson = {
              'cmd': 'GET_QUEUE_INDEX',
              'model_id': thisVue.params.id
            }
            thisVue.inter = setInterval(function () {
              if (thisVue.$websocket.readyState === 1) {
                console.log(webJson)
                thisVue.$websocket.send(JSON.stringify(webJson))
              }
            }, 600000)
          } else if (data.cmd === 'START_SERVICE_FAILED') {  // 失败
            thisVue.$notify.error({
              title: 'error',
              message: 'Error occurred. Please try again!'
            })
            thisVue.trainStart = false
            clearInterval(thisVue.inter)
          } else if (data.cmd === 'INVALID_PARAMETER') {   // 失败
            thisVue.$notify.error({
              title: 'error',
              message: 'Error occurred. Please try again!'
            })
            thisVue.trainStart = false
            clearInterval(thisVue.inter)
          } else if (data.cmd === 'TRAIN_INIT') {   // 开始
            thisVue.state = 'ready'
            thisVue.trainingRes.t_cur_log_url += data.cmd + '<br/>'
            clearInterval(thisVue.inter)
          }
        } catch (e) {
          console.log(e)
        }
        return e.data
      },
      websocketsend (id) {
        // 数据发送
        let webJson = {
          'cmd': 'TRAIN_START',
          'model_id': id
        }
        if (thisVue.$websocket.readyState === 1) {
          console.log(webJson)
          thisVue.trainStart = true
          thisVue.$websocket.send(JSON.stringify(webJson))
        }
      },
      websocketclose (e) {
        if (e) {
          if (e.code !== 25214) {
            thisVue.$notify.error({
              title: 'error',
              message: 'connection closed (' + e.code + ')'
            })
            thisVue.trainStart = false
          }
          console.log('connection closed (' + e.code + ')')
        } else {
          console.log('connection closed (Reconnect)')
        }
      },
      stopTrain () {
        let webJson = {
          'cmd': 'TRAIN_STOP',
          'model_id': thisVue.params.id
        }
        if (thisVue.$websocket.readyState === 1) {
          console.log(webJson)
          thisVue.$websocket.send(JSON.stringify(webJson))
          thisVue.$websocket.close()
          thisVue.websocketclose()
          clearInterval(thisVue.inter)
          thisVue.trainStart = false
          thisVue.$notify.success({
            title: 'success',
            message: 'Model training has stopped!'
          })
        }
      }
    },
    mounted () {
      thisVue = this
      this.$nextTick(function () {
        let pageHeaderData = {
          'homeRouterName': 'home',
          'firstTitle': 'Model',
          'firstRouterName': 'zoo_list',
          'secondTitle': 'Detail'
        }
        // Common.setPageHeaderData(thisVue, pageHeaderData)
        thisVue.$store.dispatch('setPageHeaderData', pageHeaderData)
        thisVue.getInfo(thisVue.curId)
      })
    }
  }
</script>

<style scoped>
  .fl{ float:left;}
  .fr{ float:right;}
  .mr10{ margin-right:10px;}
  .line-form{ border-top: 1px solid #dcdfe6;}
  .pt15{ padding-top:15px;}
  .opr-box{padding-bottom: 15px;}
  .el-collapse li{list-style: none;}
  .info-icon{font-size: 10px; color: #7badff;}
  .cell .el-button--mini{width: 100px;}
  .card-box{margin: 0px 5px;width: 240px;height: 250px;float: left;background-color: #fff;}
  .card-tit{background-color: #7badff;height: 40px;line-height: 40px;color: #fff;font-size: 14px;padding: 0px 10px;}
  .card-con{padding: 20px;height: auto;overflow: hidden;text-align: center;}
  .card-con h4{color: #0072ea;margin: 5px 0px;}
  .card-con img{border-radius: 50%;}
  .card-con p{height: 90px;overflow: hidden;}
  .collapse-tit{border-left: 2px solid #0072ea;padding-left: 10px;}
</style>
<style>
  .app-card .el-collapse-item__wrap{background-color: #f5f5f5;padding: 20px;}
  .btnstyle{float: right; margin: 0 10px 10px 0;}
  iframe{width: 100%; height: 63vh; overflow: auto;}
  .create-and-train{ margin-left:-139px;}
  .status-container{ margin-left:-94px;}
  .training-container{ padding:0;margin-top: -29px;}
  .training-container .box{ margin-bottom:15px;overflow: hidden;}
  .el-progress{ display:inline-block; width:165px;margin-top:5px;}
  .tab-container{ clear: both;}
  .training-container .train-sta,.training-container .train-down,.training-container .progress-container{ float: left;margin-right: 10px;border-radius: 3px;overflow: hidden;}
  .collapse-tit{border-left: 2px solid #0072ea;padding-left: 10px;}
</style>
<style>
  .steps-common.el-steps--simple{ margin: 0px;height:37px; border-radius:0;background: #f3f6f8;
    /*border-top:1px solid #cbe3ff;border-bottom:1px solid #cbe3ff;*/
  }
  .steps-common .icon-envelop:before,.steps-common .icon-lock:before,.steps-common .icon-checkmark:before{ display:inline-block; content: '1';border-radius:50%;width:20px;height:20px;text-align:center;color: #fff;position: absolute;left: 2px;top: -6px;z-index: 1;font-weight: bold;font-size: 12px;    text-shadow: 0px 0 1px #ffffff;}
  .steps-common .icon-envelop:after,.steps-common .icon-lock:after,.steps-common .icon-checkmark:after{ display: inline-block;content: '●';border-radius: 50%;width: 20px;height: 20px;text-align: center;font-size: 35px;position: absolute;left: 0px;top: -20px;}
  /*.steps-common .is-wait .icon-envelop:after, .steps-common .icon-lock:after, .steps-common .icon-checkmark:after{*/
    /*color:#d6dbde;*/
  /*}*/
  .steps-common .icon-lock:before{ content: '2';}
  .steps-common .icon-checkmark:before{ content: '3';}
  .steps-common .el-step__head.is-process{ color:#245682;}
  .steps-common .el-step__title.is-process{ color:#245682;}
  .steps-common .el-step__title.is-wait,.el-step__head.is-wait{ color:#c7cbce;}
  .steps-common .el-step.is-simple .el-step__title{ font-size:12px;}
  .steps-common .el-step.is-simple .el-step__arrow::after, .el-step.is-simple .el-step__arrow::before{ height:13px; background:#245682;}
  .radiogroup-container .el-radio-button__inner{ width:73px;}
  .training-container .el-progress-bar__outer{ height:20px !important;border-radius:50px;}
  /*.training-container .el-progress-bar__innerText{ color: #223c53;}*/
  .training-container .el-tabs--border-card>.el-tabs__content{ min-height: 300px;}
  .active-name-1 .el-collapse, .el-collapse-item__header, .el-collapse-item__wrap{ border-bottom:0;}
  .active-name-1 .el-collapse-item:last-child{ margin-bottom:0;}
  .active-name-1 .el-collapse,.active-name-2 .el-collapse{ padding:0;}
</style>
