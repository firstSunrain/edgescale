<template>
  <!-- Details -->
  <div name="list" class='task-template detail-box' v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading....">
    <el-row>
      <div class="media stack-media-on-mobile text-left opr-box-container">
          <div class="panel-body" v-if="deviceData && Object.keys(deviceData).length">
            <el-col :span='24' class='opr-box opr-box-space'>
              <el-col :span='12'>
                <div style='font-size: 2rem;vertical-align: middle;'>
                  <span v-if='deviceData.display_name'>{{deviceData.display_name}}</span>
                  <span v-else>{{deviceData.name}}</span>
                </div>
              </el-col>
                <div class="btn-group">
                  <el-button class="common-btn together-btn" size='small' @click="getDeviceDetail"><i class="icon-rotate-cw3"></i>{{ $t('refresh') }}</el-button>
                </div>
            </el-col>
            <el-col :span='24'>
              <!-- basic -->
              <div class="basic-container">
                <span class='collapse-tit'>{{ $t('basic_info') }}</span>
              </div>
              <div class="cont-container" v-if="deviceData.mode">
                <p>
                  <span class="titName"><i class='icon-diamond4 info-icon'></i>{{ $t('display_name') }}: </span>
                  <span v-if='!isEdit' v-text='deviceData.display_name'></span>
                  <el-input size='small' class='display-name' v-if='isEdit' v-model='deviceData.display_name'></el-input>
                  <el-button class="edit" type='text' icon='icon-pencil5' v-if='!isEdit' @click='isEdit = true' style='padding: 0px;'></el-button>
                  <el-button class="edit" type='text' icon='icon-checkmark4' v-if='isEdit' @click='updateDisplayName(deviceData.display_name)' style='padding: 0px;'></el-button>
                </p>
                <p v-for='(item, index) in deviceData.mode' :key='index'>
                  <span class="titName"><i class='icon-diamond4 info-icon'></i>{{ $t(index) }}: </span>
                  {{item}}
                </p>
                <p>
                  <span class="titName"><i class='icon-diamond4 info-icon'></i>{{ $t('certname') }}: </span>
                  {{deviceData.certname}}
                </p>
                <p>
                  <span class="titName"><i class='icon-diamond4 info-icon'></i>{{ $t('create_time') }}: </span>
                  {{deviceData.created_at}}
                </p>
                <div v-if="deviceData.status === 'online'">
                  <p>
                    <span class="titName"><i class='icon-diamond4 info-icon'></i>{{ $t('edgescale_version') }}: </span>
                    {{deviceData.es_version}}
                  </p>
                  <p>
                    <span class="titName"><i class='icon-diamond4 info-icon'></i>{{ $t('app_number') }}: </span>
                    {{deviceData.app_num}}
                  </p>
                </div>
                <!--tags-->
                <div class="content-group-lg">
                  <span class="titName titName-tags"><i class='icon-diamond4 info-icon'></i>{{ $t('tag') }}: </span>
                  <div class="row tags-cont-container">
                    <div>
                      <el-tag :key="tag.id" v-for="(tag, index) in deviceTagsData" closable :type="tagTypes[index%5]" :disable-transitions="false" @close="handleClose(deviceData.id, tag.name)"> {{tag.name}}</el-tag>
                      <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" :maxlength='16' @keyup.enter.native="handleInputConfirm(deviceData.id)" @blur="handleInputConfirm(deviceData.id)"></el-input>
                      <el-button v-else class="button-new-tag" size="small" @click="showInput">+ {{ $t('new_tag') }}</el-button>
                    </div>
                  </div>
                </div>
                <!--tags-->
              </div>
            </el-col>
            <!-- usage -->
            <el-col :span='24' v-if="deviceData.status == 'online'">
              <div class="basic-container">
                <span class='collapse-tit'>{{ $t('statistics') }}</span>
              </div>
              <el-col :span='5' class='sta-box'>
                <ve-gauge :data="cpuData" :settings='gaugeSetting'></ve-gauge>
              </el-col>
              <el-col :span='5' class='sta-box'>
                <ve-gauge :data="memData" :settings='gaugeSetting'></ve-gauge>
              </el-col>
              <el-col :span='5' class='sta-box' v-if='chartData.rows.length > 0'>
                <ve-gauge :data="chartData" :settings='gaugeSetting'></ve-gauge>
              </el-col>
            </el-col>

            <el-col :span='24' v-if="deviceData && deviceData.status != 'offline'">
              <div class="basic-container">
                <span class='collapse-tit'>{{ $t('device_log') }}</span>
              </div>
              <el-tabs v-model="logActive" type="card" @tab-click="handleTab">
                <el-tab-pane :label="$t('sysLog')" name="sys"><div :style='logBox' v-html='sysLog'></div></el-tab-pane>
                <el-tab-pane :label="$t('mqttLog')" name="mqtt"><div :style='logBox' v-html='mqttLog'></div></el-tab-pane>
                <el-tab-pane :label="$t('kubeLog')" name="kubelet"><div :style='logBox' v-html='kubeLog'></div></el-tab-pane>
              </el-tabs>
            </el-col>
          </div>
      </div>
    </el-row>
  </div>
  <!-- /details -->
</template>
<script>
  import { getDevLogUrl, getDevLogTxt, getDevInfo, devUpdate, devTagAdd, devTagDelete } from '@/api'
  let thisVue = null

  export default {
    data () {
      this.gaugeSetting = {
        dataType: {
          'usage': 'percent',
          'memory': 'percent',
          'cpu': 'percent'
        },
        dataName: {
          'usage': 'Disk',
          'memory': 'Memory',
          'cpu': 'CPU'
        },
        seriesMap: {
          'usage': {
            min: 0,
            max: 1,
            axisLine: {
              lineStyle: {
                color: [[0.29, '#2ec7c9'], [0.86, '#52a2db'], [1, '#f68873']],
                width: 3
              }
            },
            axisTick: {
              length: 6,
              lineStyle: {
                color: 'auto'
              }
            },
            pointer: {
              width: 2
            },
            axisLabel: {
              textStyle: {
                fontSize: 10
              }
            },
            detail: {
              textStyle: {
                fontSize: 16
              }
            },
            title: {
              textStyle: {
                fontSize: 12
              }
            },
            splitLine: {
              length: 5,
              lineStyle: {
                color: 'auto'
              }
            }
          },
          'memory': {
            min: 0,
            max: 1,
            axisLine: {
              lineStyle: {
                color: [[0.29, '#2ec7c9'], [0.86, '#52a2db'], [1, '#f68873']],
                width: 3
              }
            },
            axisTick: {
              length: 6,
              lineStyle: {
                color: 'auto'
              }
            },
            pointer: {
              width: 2
            },
            axisLabel: {
              textStyle: {
                fontSize: 10
              }
            },
            title: {
              textStyle: {
                fontSize: 12
              }
            },
            detail: {
              textStyle: {
                fontSize: 16
              }
            },
            splitLine: {
              length: 5,
              lineStyle: {
                color: 'auto'
              }
            }
          },
          'cpu': {
            min: 0,
            max: 1,
            axisLine: {
              lineStyle: {
                color: [[0.29, '#2ec7c9'], [0.86, '#52a2db'], [1, '#f68873']],
                width: 3
              }
            },
            axisTick: {
              length: 6,
              lineStyle: {
                color: 'auto'
              }
            },
            pointer: {
              width: 2
            },
            axisLabel: {
              textStyle: {
                fontSize: 10
              }
            },
            title: {
              textStyle: {
                fontSize: 12
              }
            },
            detail: {
              textStyle: {
                fontSize: 16
              }
            },
            splitLine: {
              length: 5,
              lineStyle: {
                color: 'auto'
              }
            }
          }
        }
      }
      return {
        deviceId: this.$route.params.deviceId,
        deviceData: {},
        deviceTagsData: [],
        deviceProgressData: {},
        deviceTasksData: [],
        inputVisible: false,
        inputValue: '',
        isEdit: false,
        tagTypes: ['', 'success', 'warning', 'danger'],
        logActive: 'sys',
        sysLog: '',
        mqttLog: '',
        kubeLog: '',
        puppetLog: '',
        log_device_id: '',
        loading: true,
        logBox: {
          'maxHeight': '500px',
          'overflow-y': 'scroll'
        },
        chartData: {
          columns: ['type', 'usage'],
          rows: []
        },
        cpuData: {
          columns: ['type', 'value'],
          rows: [
            { type: 'cpu', value: 0.2 }
          ]
        },
        memData: {
          columns: ['type', 'value'],
          rows: [
            { type: 'memory', value: 0.2 }
          ]
        }
      }
    },
    methods: {
      handleTab (tab, event) {
        thisVue.getLogUrl(tab.name)
      },
      readMore () {
        thisVue.logBox.maxHeight = parseInt(thisVue.logBox.maxHeight) + 1000 + 'px'
      },
      getLogUrl (type) {
        thisVue.loading = true
        let params = {deviceid: thisVue.log_device_id, logtype: type}
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
      },
      getDeviceDetail () {
        thisVue.loading = true
        getDevInfo(thisVue.deviceId).then(dat => {
          let res = dat.data
          thisVue.loading = false
          if (res.device_info) {
            thisVue.deviceData = res.device_info
            thisVue.deviceTagsData = res.tags
            thisVue.log_device_id = res.device_info.name
            if (res.device_info.disk_used && res.device_info.disk_free) {
              let used, free
              if (res.device_info.disk_used.endsWith('MB')) {
                used = parseFloat(res.device_info.disk_used) / 1024
              } else {
                used = parseFloat(res.device_info.disk_used)
              }
              if (res.device_info.disk_free.endsWith('MB')) {
                free = parseFloat(res.device_info.disk_free) / 1024
              } else {
                free = parseFloat(res.device_info.disk_free)
              }
              thisVue.deviceData.disk_total = (used + free).toFixed(2)
              let _per = parseFloat(used / (used + free))
              thisVue.chartData.rows.push({ type: 'usage', usage: _per })
              thisVue.gaugeSetting.dataName.usage = `Disk\n${thisVue.deviceData.disk_used}/${thisVue.deviceData.disk_total}GB`
            }
            if (res.device_info.cpu_usage) {
              let _dat = parseFloat(res.device_info.cpu_usage)
              thisVue.cpuData.rows[0].value = _dat * 0.01
            }
            if (res.device_info.mem_usage) {
              let _dat = parseFloat(res.device_info.mem_usage)
              thisVue.memData.rows[0].value = _dat * 0.01
              thisVue.deviceData.mem_used = (parseFloat(thisVue.deviceData.mem_total) * parseFloat(thisVue.deviceData.mem_usage) * 0.01).toFixed(2)
              thisVue.gaugeSetting.dataName.memory = `Memory\n${thisVue.deviceData.mem_used}GB/${thisVue.deviceData.mem_total}`
            }
          }
        }).catch(_ => {
          thisVue.loading = false
        })
      },
      addTagToDevice (deviceName, tagName) {
        let _data = {'tag_name': tagName, 'device_ids': [deviceName]}
        thisVue.loading = true
        devTagAdd(_data).then(dat => {
          let res = dat.data
          thisVue.loading = false
          if (res.status === 'success') {
            thisVue.$message({message: thisVue.$t('add_tag_success'), type: 'success'})
            thisVue.getDeviceDetail()
          } else {
            thisVue.$message({message: thisVue.$t('add_tag_fail'), type: 'error'})
          }
        }).catch(_ => {
          thisVue.loading = false
          return false
        })
      },
      deleteTagToDeviceItem (deviceName, tagName) {
        let params = {name: tagName, devId: deviceName}
        thisVue.loading = true
        devTagDelete(params).then(dat => {
          let res = dat.data
          thisVue.loading = false
          if (res.status === 'success') {
            thisVue.$message({message: thisVue.$t('remove_tag_success'), type: 'success'})
            thisVue.getDeviceDetail()
          } else {
            thisVue.$message({message: thisVue.$t('remove_tag_fail'), type: 'error'})
          }
        }).catch(_ => {
          thisVue.loading = false
          return false
        })
      },
      handleClose (deviceName, tagName) {
        thisVue.deleteTagToDeviceItem(deviceName, tagName)
      },
      showInput () {
        this.inputVisible = true
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
      },
      handleInputConfirm (deviceName) {
        let tagName = this.inputValue.replace(/(^\s*)|(\s*$)/g, '')
        if (tagName && tagName !== '') {
          thisVue.addTagToDevice(deviceName, tagName)
        }
        this.inputVisible = false
        this.inputValue = ''
      },
      updateDisplayName (name) {
        thisVue.loading = true
        devUpdate(thisVue.deviceId, {display_name: name}).then(dat => {
          let res = dat.data
          thisVue.loading = false
          thisVue.isEdit = false
          if (res.status === 'success') {
            thisVue.$message({message: thisVue.$t('update_success'), type: 'success'})
            thisVue.getDeviceDetail()
          } else {
            thisVue.$message({message: thisVue.$t('update_fail'), type: 'error'})
          }
        }).catch(_ => {
          return false
        })
      }
    },
    mounted () {
      thisVue = this
      thisVue.getDeviceDetail()
    },
    watch: {
      log_device_id: function (newVal, oldVal) {
        if (thisVue.deviceData.status !== 'offline') {
          thisVue.handleTab({name: 'sys'})
        }
      }
    }
  }
</script>
<style scoped>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  .log-more{
    line-height: 40px;
    font-size: 16px;
  }
  .modal-header{
    border-bottom: none;
  }
  .cont-container{ padding-left:20px;}
  .cont-container p{ margin-bottom: 3px;font-size: 14px;}
  .panel-body{ padding:0;}
  .opr-box-container{ overflow:hidden;}
  .opr-box-space{ margin-bottom:10px;border-bottom: 1px solid #ebeef5;overflow: hidden;}
  .task-template{background-color: #fff; height: auto; min-height: 400px; overflow: hidden;padding: 20px;}
  .info-icon{ margin-right:10px; font-size: 10px;color: #7badff;}
  .collapse-tit{ margin-bottom: 20px; border-left: 2px solid #0072ea; padding-left: 10px; font-size: 14px; font-weight: 500;}
  .titName{ color:#333;font-weight: 700;color: #333;font-weight: 700;padding: 0 6px;display: inline-block;}
  .titName-tags{ float:left;margin-top:4px;font-size:14px;margin-right: 10px;}
  .tags-cont-container{ float: left;}
  .display-name{width: 200px; padding-right: 5px;}
  .basic-container{ margin-bottom:10px;clear: both;}
  .content-group-lg{height: auto;overflow:hidden;margin-bottom: 10px !important;}
  .sta-box{position: relative;height: 240px;overflow: hidden;}
</style>
<style>
  .el-button.edit i{ margin-left: 5px;color:#223c53;}
  .el-button.edit i:hover{ color:#5ca3e2;}
  .ve-gauge canvas{top: -70px !important;}
</style>