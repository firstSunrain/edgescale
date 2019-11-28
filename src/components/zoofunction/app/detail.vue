<template>
  <div name="list" class='zoo_box detail-box'>
    <el-row class='list-box' v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading....">
      <el-col :span='24' class='opr-box'>
        <el-col :span='18'>
          <div style='font-size: 2rem;vertical-align: middel;'>{{basicInfo.name}}</div>
        </el-col>
          <div class="btn-group">
            <el-button class="common-btn together-btn" v-if="basicInfo.status === 3 && trainStart === 1" size='small' @click="goTrain">Rebuild</el-button>
            <el-button class="common-btn together-btn" size='small' @click='getInfo(curId)'><i class="icon-rotate-cw3"></i>Refresh</el-button>
          </div>
      </el-col>

      <el-col :span='24' class='basic-box'>
        <el-collapse v-model='activeNames'>
          <!-- model -->
          <el-collapse-item name='1'>
            <template slot='title'>
              <span class='collapse-tit'>APP Detail</span>
            </template>
            <ul>
              <li v-for="(value, key) in basicInfo" :key='key'>
                <label style='font-size: 15px;'>
                  <i class='icon-diamond4 info-icon'></i>
                  <span style='padding: 0px 6px;font-weight: bold;'>{{key === 'device' ? key = 'Platform' : key = key}}:</span>
                  <span style='color: #444;'>{{value}}</span>
                </label>
              </li>
            </ul>
          </el-collapse-item>
          <!-- Builder state -->
          <el-col class="training-container" :span='24'>
          <el-collapse-item name='2' v-if="trainStart === 2" class="">
            <template slot='title'>
              <span class='collapse-tit'>Builder state</span>
            </template>
            <el-col :span='24'>
              <div class="box status-container">
                <!-- <el-button class="train-sta" :disabled="trainOK ? false : true" size="small" @click="dialogTableVisible = true">Builder Statistics</el-button> -->
                <!-- <el-button class="train-down" size="small" :disabled="trainOK ? false : true" @click="download('https://eiq-cloud.s3.amazonaws.com/'+trainingRes.t_full_log_url)" type="primary">Download Full Log</el-button> -->
                <div class="fl tip">In packing, please do not refresh the page!</div>
              </div>
              <el-tabs class="tab-container" type="border-card">
                <el-tab-pane label="Builder log" v-html="trainingRes.t_cur_log_url"></el-tab-pane>
              </el-tabs>
            </el-col>
          </el-collapse-item>
          </el-col>
          <div v-if="trainOK">
            <div class="pt15"></div>
            <template>
              <el-radio v-model="radio" label="1" style="margin-left:22px">Need to change the base docker and add your own code? just download it first</el-radio>
              <el-radio v-model="radio" label="2">Directly deploy the base docker just generated?</el-radio>
            </template>
            <!-- <el-button class="fl" style="margin-left:22px" size='small' type="primary" @click="$router.push({name: 'zoo_app_list'})">No deployment
            </el-button> -->
            <div v-if="radio == 1" class="pt15" style="margin-left:45px">
              <div class="fl">You can click here to download, edit and upload.</div>
              <el-button class="fl" style="margin-left:20px" size='small' type="primary" @click="$router.push({name: 'zoo_app_list'})">back list</el-button>
            </div>
            <div v-else class="pt15" style="margin-left:25px">
              <el-button size='small' style="margin-left:20px" type="primary" @click="$router.push({name: 'software_app_deploy_device_list', query: {name: newApp.name, applicaion_id: newApp.id}})">deploy</el-button>
            </div>
          </div>
         </el-collapse>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { eiqDetail } from '@/api/api'
  import publicJS from '../../../../static/js/public.js'
  import { appBinidDocker } from '@/api'
  let thisVue = null

  export default {
    data () {
      return {
        basicInfo: {},
        loading: true,
        status: '',
        activeNames: ['1', '2'],
        curId: this.$route.params.id,
        trainStart: 0,
        trainOK: false,
        trainingRes: {
          t_cur_log_url: ''
        }
      }
    },
    created () {
      // 页面刚进入时开启长连接
      this.initWebSocket()
    },
    destroyed: function () {
      // 页面销毁时关闭长连接
      this.$websocket.close()
      this.websocketclose()
    },
    methods: {
      getInfo (id) {
        if (!thisVue.loading) {
          thisVue.loading = true
        }
        eiqDetail('get', 'app', {id: id}).then(json => {
          // console.log(json.data)
          thisVue.loading = false
          json.data.date_created = publicJS.timetrans(json.data.date_created)
          json.data.date_updated = publicJS.timetrans(json.data.date_updated)
          thisVue.basicInfo = json.data
          if (json.data.status === 1) {
            thisVue.websocketsendRE(thisVue.curId)
          }
        }).catch(_ => {
          thisVue.loading = false
          return false
        })
      },
      goTrain () {
        thisVue.websocketsend(thisVue.curId)
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
        thisVue.trainStart = 1
      },
      websocketonerror (e) {
        console.log('WebSocket连接发生错误')
      },
      websocketonmessage (e) {
        console.log('服务器端发送消息：')
        console.log(e)
        try {
          let data = JSON.parse(e.data)
          if (data.cmd === 'PACKAGE_SUCCESS') {   // 成功
            thisVue.$notify.success({
              title: 'success',
              message: 'Base docker Creation Successful!'
            })
            let docker = ''
            if (thisVue.basicInfo.depolyed_docker_url === null) {
              docker = thisVue.basicInfo.base_docker_url
            } else {
              docker = thisVue.basicInfo.depolyed_docker_url
            }
            thisVue.bindDocker(docker, thisVue.basicInfo.docker_cmd)
            thisVue.trainOK = true
          } else if (data.cmd === 'PACKAGE_STATUS') {  // 开始
            let datalog = data.msg.replace(new RegExp('\\n', 'gm'), '<br/>')
            datalog = datalog.replace(new RegExp('\\r', 'gm'), '<br/>')
            thisVue.trainingRes.t_cur_log_url += datalog
          } else if (data.cmd === 'PACKAGE_RECONNECT') {  // 训练中
            let datalog = data.msg.replace(new RegExp('\\n', 'gm'), '<br/>')
            datalog = datalog.replace(new RegExp('\\r', 'gm'), '<br/>')
            thisVue.trainingRes.t_cur_log_url += datalog
          } else {
            let msg = ''
            if (data.msg === '') {
              msg = 'Sorry, please try again.'
            } else {
              msg = data.msg
            }
            thisVue.$alert(msg, 'Builder failed: ')
          }
        } catch (e) {
          console.log(e)
        }
        return e.data
      },
      websocketsend (id) {
        // 数据发送
        var that = this
        that.trainStart = 2
        var webJson = {
          'cmd': 'PACKAGE_START',
          'app_id': id
        }
        console.log(webJson)
        if (that.$websocket.readyState === 1) {
          that.$websocket.send(JSON.stringify(webJson))
        }
      },
      websocketsendRE (id) {
        // 数据发送
        var that = this
        that.loading = true
        var webJson = {
          'cmd': 'PACKAGE_RECONNECT',
          'app_id': id
        }
        let time = setTimeout(() => {
          console.log(webJson)
          if (that.$websocket.readyState === 1) {
            thisVue.trainStart = 2
            that.$websocket.send(JSON.stringify(webJson))
          }
          that.loading = false
          window.clearInterval(time)
        }, 1000)
      },
      websocketclose (e) {
        if (e) {
          if (e.code !== 25214) {
            thisVue.$notify.error({
              title: 'error',
              message: 'connection closed (' + e.code + ')'
            })
          }
          console.log('connection closed (' + e.code + ')')
        } else {
          console.log('connection closed (Reconnect)')
        }
      },
      bindDocker (docker, dockerCmd) {
        let version = docker.split(':')
        console.log(dockerCmd)
        dockerCmd = JSON.parse(dockerCmd)
        console.log(dockerCmd)
        let bindDockerFormData = {
          'image': {
            'application_id': thisVue.form.id,
            'registry_id': '5',
            'image_name': version[0],
            'version': version[1],
            'commands': dockerCmd.commands,
            'args': dockerCmd.args
          },
          'arguments': {
            'host_network': dockerCmd.host_network,
            'ports': [{
              'containerPort': '',
              'hostPort': ''
            }],
            'volumes': [{
              'hostPath': '',
              'mountPathReadOnly': false,
              'mountPath': ''
            }],
            'cap_add': true
          }
        }
        console.log(JSON.stringify(bindDockerFormData))
        appBinidDocker(thisVue.form.id, bindDockerFormData).then(dat => {
          let res = dat.data
          thisVue.loading = false
          if (res.status === 'fail') {
            thisVue.$notify.error({
              title: 'Error',
              message: res.message
            })
          } else {
            thisVue.$notify({
              title: 'Success ',
              message: res.message,
              type: 'success'
            })
            thisVue.baseOK = true
          }
        }).catch(_ => {
          thisVue.loading = false
        })
      }
    },
    mounted () {
      thisVue = this
      this.$nextTick(function () {
        let pageHeaderData = {
          'homeRouterName': 'home',
          'firstTitle': 'APP',
          'firstRouterName': 'zoo_app_list',
          'secondTitle': 'Detail'
        }
        // Common.setPageHeaderData(thisVue, pageHeaderData)
        thisVue.$store.dispatch('setPageHeaderData', pageHeaderData)
        thisVue.getInfo(thisVue.curId)
        if (thisVue.$route.params.active && thisVue.$route.params.active === 'again') {
          console.log('开始Builder!')
        }
      })
    }
  }
</script>

<style scoped>
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
  .training-container{ padding:0;margin-top: -29px;position: relative;}
  .status-container .tip{ color: #f68873;
    font-size: 12px;
    position: absolute;
    top: 13px;
    left: 109px;}
</style>
<style>
  .app-card .el-collapse-item__wrap{background-color: #f5f5f5;padding: 20px;}
  .btnstyle{float: right; margin: 0 10px 10px 0;}
  iframe{width: 100%; height: 63vh; overflow: auto;}
</style>
