<template>
  <el-row v-loading='info_loading' element-loading-spinner="el-icon-loading" element-loading-text="loading....">
    <el-col :span='24'>
      <div class="cont-container" v-if="deviceData.mode">
        <p>
          <span class="titName"><i class='icon-diamond4 info-icon'></i>{{ $t('display_name') }}: </span>
          <span v-if='!isEdit' v-text='deviceData.display_name'></span>
          <el-input size='small' class='display-name' v-if='isEdit' v-model='deviceData.display_name'></el-input>
          <el-button class="edit" type='text' icon='icon-pencil5' v-if='!isEdit' @click='isEdit = true' style='padding: 0px;'></el-button>
          <el-button class="edit" type='text' icon='icon-checkmark4' v-if='isEdit' @click='updateDisplayName(deviceData.display_name)' style='padding: 0px;'></el-button>
        </p>
        <p>
          <span class="titName"><i class='icon-diamond4 info-icon'></i>{{ $t('model') }}: </span>
          {{deviceData.mode.model}}-{{deviceData.mode.type}}-{{deviceData.mode.vendor}}-{{deviceData.mode.platform}}
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
      <!-- <div class="basic-container">
        <span class='collapse-tit'>{{ $t('statistics') }}</span>
      </div> -->
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
  </el-row>
</template>
<script>
  import { getDevInfo, devUpdate, devTagAdd, devTagDelete } from '@/api'
  let thisVue = null

  export default {
    props: ['deviceId'],
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
        isEdit: false,
        inputVisible: false,
        info_loading: false,
        inputValue: '',
        deviceData: {},
        deviceTagsData: [],
        tagTypes: ['', 'success', 'warning', 'danger'],
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
      handleClose (deviceName, tagName) {
        thisVue.deleteTagToDeviceItem(deviceName, tagName)
      },
      showInput () {
        this.inputVisible = true
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
      },
      getDeviceDetail () {
        thisVue.info_loading = true
        getDevInfo(thisVue.deviceId).then(dat => {
          let res = dat.data
          thisVue.info_loading = false
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
          thisVue.$emit('deviceData', thisVue.deviceData)
        }).catch(_ => {
          thisVue.info_loading = false
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
      addTagToDevice (deviceName, tagName) {
        let _data = {'tag_name': tagName, 'device_ids': [deviceName]}
        thisVue.info_loading = true
        devTagAdd(_data).then(dat => {
          let res = dat.data
          thisVue.info_loading = false
          if (res.status === 'success') {
            thisVue.$message({message: thisVue.$t('add_tag_success'), type: 'success'})
            thisVue.getDeviceDetail()
          } else {
            thisVue.$message({message: thisVue.$t('add_tag_fail'), type: 'error'})
          }
        }).catch(_ => {
          thisVue.info_loading = false
          return false
        })
      },
      deleteTagToDeviceItem (deviceName, tagName) {
        let params = {name: tagName, devId: deviceName}
        thisVue.info_loading = true
        devTagDelete(params).then(dat => {
          let res = dat.data
          thisVue.info_loading = false
          if (res.status === 'success') {
            thisVue.$message({message: thisVue.$t('remove_tag_success'), type: 'success'})
            thisVue.getDeviceDetail()
          } else {
            thisVue.$message({message: thisVue.$t('remove_tag_fail'), type: 'error'})
          }
        }).catch(_ => {
          thisVue.info_loading = false
          return false
        })
      },
      updateDisplayName (name) {
        thisVue.info_loading = true
        devUpdate(thisVue.deviceId, {display_name: name}).then(dat => {
          let res = dat.data
          thisVue.info_loading = false
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
    }
  }
</script>
<style scoped>
  .detail-box{background-color: #fff; height: auto; min-height: 400px; overflow: hidden;padding: 20px;}
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
