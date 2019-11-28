<template>
  <div name="dashboard" class='dashboard-box'>
    <div class="panel panel-flat">
      <div class="panel-heading panel-heading-map">
        <h5 class="panel-title">{{ $t('dash_dev_distribute') }} &nbsp;&nbsp;&nbsp;<span style='font-size: 14px;'>( {{ $t('total') }}: {{ totalDevices }} {{ $t('devices') }}</span> )</h5>
        <div class="heading-elements">
          <ul class="icons-list" style="margin: 0px;">
            <li v-if="mapType == 'google'">
              <span>{{ $t('dash_theme') }} </span>
              <el-select size='small' v-model="mapStyle" @change="changeMapStyle">
                <el-option v-for="item in options" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </li>
            <li class='map-icon'><a data-action="reload" @click="reload('blockMap')"></a></li>
          </ul>
        </div>
      </div>
      <div class="panel-body panel-body-map">
        <div class="map-container map-world" v-if="mapType == 'google'">
          <gmap-map :center="center" :zoom="zoom" :minZoom="minZoom" ref="map" :options="optionsMapStyles" @zoom_changed="setPlace">
            <gmap-info-window :options="infoOptions" :position="infoWindowPos" :opened="infoWinOpen" @closeclick="infoWinOpen=false">
              <div class="googft-info-window"><b>Devices Number : {{ infoContent }}</b></div>
            </gmap-info-window>
            <gmap-cluster ref="map">
              <gmap-marker v-for="(m,i) in markers" :key="i" :position="m.position" :clickable="true" :draggable="true" @click="showBlockList(m.position, m.deviceIds)" @mouseover="toggleInfoWindow(m,i)" :options="markerOption"></gmap-marker>
            </gmap-cluster>
          </gmap-map>
        </div>
        <div class="map-container map-world" v-if="mapType == 'baidu'"><bdmap :markers='markers' @getDeviceList='showBlockList'></bdmap></div>
      </div>
    </div>
    <!-- device list -->
    <div v-if="blockList && deviceIdList" class="dashboard-center">
      <div class="col-md-8 d_jump dashboard-center-left">
        <div class="panel panel-flat dashboard-cl-inner" style="min-height: 486px;">
          <div class="panel-heading">
            <h6 class="panel-title">{{ $t('list') }}</h6>
            <div class="heading-elements">
              <span class="label bg-success heading-text">{{ deviceIdTotal }} devices</span>
              <ul class="icons-list">
                <li><a data-action="reload" @click="reload('blockListTable')"></a></li>
              </ul>
            </div>
          </div>
          <div class="com-table" v-if="deviceIdList">
            <el-table :data='deviceIdList' size='small'>
              <el-table-column :label="$t('name')" sortable='true'>
                <template slot-scope='scope'>
                  <template v-if='scope.row.display_name'>
                    <router-link :to="{name: 'device_detail', params: {deviceId: scope.row.id}}">
                      <span v-if='!isEdit[scope.$index]' v-text='scope.row.display_name'></span>
                    </router-link>
                    <el-input size='small' class='display-name' v-if='isEdit[scope.$index]' v-model='scope.row.display_name'></el-input>
                    <i class='common-btn spe-btn icon-pencil5' v-if='!isEdit[scope.$index]' @click='canEditable(scope.$index)'></i>
                    <i class='common-btn spe-btn icon-checkmark4' v-if='isEdit[scope.$index]' @click='updateDisplayName(scope.row.id, scope.row.display_name, scope.$index)'></i>
                  </template>
                  <div v-else>
                    <router-link :to="{name: 'device_detail', params: {deviceId: scope.row.id}}">
                      <div class='con-wrap'>{{scope.row.name}}</div>
                    </router-link>
                  </div>
                </template>
              </el-table-column>
              <el-table-column :label="$t('location')" prop='location'></el-table-column>
              <el-table-column :label="$t('status')">
                <template slot-scope='scope'>
                  <el-button class='status-on' size="mini" v-if="scope.row.status == 'online'">{{ $t('upper_online') }}</el-button>
                  <el-button class='status-off' size="mini" v-else="scope.row.status == 'offline'">{{ $t('upper_offline') }}</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="common-page">
              <el-pagination background :page-size="10" layout="prev, pager, next" :total="deviceIdList.length"></el-pagination>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-4 dashboard-center-right">
        <!-- My messages -->
        <div class="panel panel-flat dashboard-cr-inner">
          <div class="panel-heading">
            <h6 class="panel-title">{{ $t('dev_status_chart') }}<a class="heading-elements-toggle"><i class="icon-more"></i></a></h6>
            <div class="heading-elements">
              <ul class="icons-list">
                <li><a data-action="reload" @click="reload('blockListChart')"></a></li>
              </ul>
            </div>
          </div>
          <div class="bar-chart-box">
            <ve-histogram :data="chartDataDevicesPonit" :extend="chartSettingsAreaStatus"></ve-histogram>
          </div>
        </div>
      </div>
    </div>
    <!-- devices Area statistics -->
    <div class="dashboard-center">
      <el-row :gutter='10'>
        <el-col :span='12' v-loading='chartLoading' element-loading-text="loading..." element-loading-spinner="el-icon-loading">
          <div class="panel panel-flat dashboard-cl-inner" style="min-height: 486px;">
            <div class="panel-heading">
              <h6 class="panel-title">{{ $t('dash_dev_area_statistics') }}</h6>
              <div class="heading-elements">
                <ul class="icons-list">
                  <li><a data-action="reload" @click="reload('blockArea')"></a></li>
                </ul>
              </div>
            </div>
            <div class="bar-chart-box">
              <ve-histogram :data="chartDataAreaStatus" :extend="chartSettingsAreaStatus"></ve-histogram>
            </div>
          </div>
        </el-col>
        <el-col :span='12' v-loading='statusLoading' element-loading-text="loading..." element-loading-spinner="el-icon-loading">
          <div class="panel panel-flat dashboard-cl-inner" style="min-height: 486px;">
            <div class="panel-heading">
              <h6 class="panel-title">{{ $t('dash_dev_status_statistics') }}</h6>
              <div class="heading-elements">
                <ul class="icons-list">
                  <li><a data-action="reload" @click="getDeviveStatistics"></a></li>
                </ul>
              </div>
            </div>
            <div class="bar-chart-box">
              <ve-pie :data="chartDataStatus" :extend='pieSetting'></ve-pie>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import { deviceMapPos, getDevList, devicelifeStatistics, devicePosStatistics, devDisplayNameUpdate, getDevByLocation } from '@/api'
  import mapIcon from '../../../static/img/spotlight-poi.png'
  import bdmap from './map'
  import * as VueGoogleMaps from 'vue2-google-maps'
  import allStyles from './style.js'
  let thisVue = null
  Vue.use(VueGoogleMaps, {
    load: {
      key: 'AIzaSyC7eyFx2SRyHAXu15tS7AFQgegES04Bnnk',
      v: 3.26,
      libraries: 'visualization',
      language: 'en-us'
    }
  })
  export default {
    components: { bdmap },
    data () {
      return {
        totalDevices: 0,
        chartLoading: false,
        statusLoading: false,
        isEdit: [],
        mapStyle: 'native',
        options: ['default', 'native', 'silver', 'night', 'retro', 'hiding'],
        optionsMapStyles: {styles: allStyles['native']},
        markerOption: {icon: mapIcon},
        chartDataAreaStatus: {
          columns: ['area', 'online', 'offline'],
          rows: []
        },
        chartDataStatus: {
          columns: ['status', 'number'],
          rows: []
        },
        chartSettingsAreaStatus: {
          color: ['#2ec7c9', '#f68873', '#52a2db', '#ffb980'],
          axisSite: {right: ['proportion ']},
          yAxisType: ['KMB', 'percent'],
          yAxis: { minInterval: 1 },
          barMaxWidth: '30px',
          label: { show: true, position: 'top' },
          itemStyle: {barBorderRadius: 3},
          yAxisName: ['Number', ' rate ']
        },
        pieSetting: {
          color: ['#2ec7c9', '#f68873', '#52a2db', '#ffb980', '#b6a2de', '#e5cf0d', '#97b552']
        },
        chartDataDevicesPonit: {
          columns: ['status', 'online', 'offline'],
          rows: []
        },
        deviceId: null,
        deviceIdList: null,
        deviceIdTotal: 0,
        devicesTotal: 0,
        zoom: 4,
        maxZoom: 17,
        minZoom: 10,
        center: {lat: 39.9, lng: 116.40},
        mapType: 'google',
        markers: [],
        offset: 0,
        limit: 5000,
        infoContent: '',
        infoWindowPos: {
          lat: 0,
          lng: 0
        },
        infoWinOpen: false,
        currentMidx: null,
        infoOptions: {
          pixelOffset: {
            width: 0,
            height: -35
          }
        },
        blockList: true
      }
    },
    methods: {
      reload (type) {
        if (type === 'blockMap') {
          thisVue.getMapPosition()
        } else if (type === 'blockListTable') {
          thisVue.showDeviceList(thisVue.deviceId)
        } else if (type === 'blockListChart') {
          thisVue.showDeviceList(thisVue.deviceId)
        } else if (type === 'blockArea') {
          thisVue.getPicData()
        } else if (type === 'blockAreaContrast') {
          thisVue.getPicData()
        } else if (type === 'blockStatus') {
          thisVue.getPicData()
        }
      },
      getMapPosition () {
        let offset = thisVue.offset
        let limit = thisVue.limit
        deviceMapPos({offset, limit}).then(dat => {
          let res = dat.data
          thisVue.markers = []
          if (res) {
            for (let item in res) {
              let lat = res[item]['lat']
              let lng = res[item]['lng']
              let deviceIds = res[item]['device_ids']
              let position = {position: {lat: lat, lng: lng}, deviceIds: deviceIds, deviceIdsLength: deviceIds.length}
              thisVue.markers.push(position)
            }
            if ((res.length - thisVue.offset) === 5000) {
              thisVue.offset = thisVue.limit
              thisVue.limit += 5000
              thisVue.getMapPosition()
            }
          }
        }).catch(_ => {
          return false
        })
      },
      getAllDevices () {
        getDevList({offset: 0, limit: 1}).then(dat => {
          let res = dat.data
          if (res.total) {
            thisVue.totalDevices = res.total
          }
        }).catch(_ => {
          return false
        })
      },
      getDeviveStatistics () {
        thisVue.statusLoading = true
        devicelifeStatistics().then(dat => {
          let res = dat.data
          thisVue.statusLoading = false
          if (res) {
            thisVue.chartDataStatus.rows = res.map(item => {
              item.status = `${item.status}(${item.number})`
              return item
            })
          }
        }).catch(_ => {
          thisVue.statusLoading = false
        })
      },
      toggleInfoWindow: function (marker, idx) {
        thisVue.infoWindowPos = marker.position
        thisVue.infoContent = marker.deviceIdsLength
        if (thisVue.currentMidx === idx) {
          thisVue.infoWinOpen = !this.infoWinOpen
        } else {
          thisVue.infoWinOpen = true
          thisVue.currentMidx = idx
        }
      },
      getPicData: function () {
        thisVue.chartLoading = true
        devicePosStatistics().then(dat => {
          let res = dat.data
          thisVue.chartLoading = false
          if (res && res.length > 0) {
            thisVue.chartDataAreaStatus.rows = res
          }
        }).catch(_ => {
          thisVue.chartLoading = false
        })
      },
      setPlace: function () {
        if (thisVue.$refs.map.$mapObject.zoom <= thisVue.zoom) {
          if (thisVue.zoom === 3) {
            thisVue.$refs.map.$mapObject.zoom = thisVue.zoom
          } else {
            thisVue.zoom = thisVue.$refs.map.$mapObject.zoom
          }
        }
      },
      showBlockList (position, deviceId) {
        thisVue.center = position
        if (thisVue.zoom < 15) {
          thisVue.zoom = 15
        } else {
          thisVue.zoom += 5
        }
        thisVue.blockList = true
        thisVue.blockListTable = true
        thisVue.blockListChart = true
        thisVue.deviceId = deviceId
        thisVue.showDeviceList(deviceId)
      },
      showDeviceList: function (deviceId, status) {
        let params = {device_ids: deviceId.join(','), offset: 0, limit: 100000}
        getDevByLocation(params).then(dat => {
          let res = dat.data
          if (res) {
            let online = 0
            let offline = 0
            res.map((item, index) => {
              thisVue.isEdit[index] = false
              if (item.status === 'online') {
                online++
              } else if (item.status === 'offline') {
                offline++
              }
            })
            thisVue.deviceIdTotal = res.length
            thisVue.deviceIdList = res
            thisVue.chartDataDevicesPonit.rows = [{'status': 'devices', online, offline}]
          }
        }).catch(_ => {
          return false
        })
      },
      changeMapStyle () {
        thisVue.optionsMapStyles = {styles: allStyles[thisVue.mapStyle]}
      },
      updateDisplayName (deviceId, name, index) {
        thisVue.loading = true
        devDisplayNameUpdate(deviceId, {display_name: name}).then(dat => {
          let res = dat.data
          thisVue.loading = false
          if (res.status === 'success') {
            thisVue.$message({message: thisVue.$t('update_success'), type: 'success'})
            thisVue.isEdit.splice(index, 1, false)
          } else {
            thisVue.$message({message: thisVue.$t('update_fail'), type: 'error'})
          }
        }).catch(_ => {
          thisVue.loading = false
        })
      },
      canEditable (index) {
        thisVue.isEdit.splice(index, 1, true)
      }
    },
    mounted () {
      thisVue = this
      thisVue.getMapPosition()
      thisVue.getPicData()
      thisVue.getAllDevices()
      thisVue.getDeviveStatistics()
      if (thisVue.$store.state.language === 'en') {
        thisVue.mapType = 'google'
      } else {
        thisVue.mapType = 'baidu'
      }
    }
  }
</script>
<style scoped>
  .panel{
    box-shadow: 0 1px 0px 0 rgba(255,255,255,1);
    border-color: #fff;
    border-radius: 0;
    margin-bottom:0;
  }
  .panel-flat > .panel-heading{padding-top: 0;
    padding-left: 0;
    background: #f1f4f7;
    padding-bottom: 0px;
    padding: 10px 15px;
    border-radius: 0;
    margin-bottom: 20px;
    border-radius:3px;
  }
  .panel-flat > .panel-heading-map{ margin-bottom:0;border-bottom-left-radius: 0;border-bottom-right-radius: 0;}
  .panel-body{ padding:20px 0;}
  .panel-body-map{border: 11px solid #f1f4f7;border-top:0;
    padding-bottom: 0;
    margin-bottom: 20px;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;background: #f1f4f7;border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;}
  .panel.panel-nb{ box-shadow: 0 0px 0px 0 rgba(0,0,0,0);}
  .vue-map-container {
    width: 100%!important;
    height:  100%!important;
  }
  html, body {
    height: 100%;
    margin: 0;
    padding: 0;
  }
  .map-container{
    height: 450px!important;    overflow: hidden;
    border-radius: 16px;
  }
  .map-control {
    background-color: #fff;
    border: 1px solid #ccc;
    box-shadow: 0 2px 2px rgba(33, 33, 33, 0.4);
    font-family: 'Roboto','sans-serif';
    margin: 10px;
    display: none;
  }
  #map .map-control { display: block; }

  .selector-control {
    font-size: 14px;
    line-height: 30px;
    padding-left: 5px;
    padding-right: 5px;
  }
  .list-inline > li:first-child{
    padding-right: 10px!important;
  }
  .spe-btn{float:right;padding-top: 6px;}
  li.map-icon{line-height: 36px;}
  .dash-act{position: fixed; right: 46px; width: 36px; bottom: 10px;}
  .btn-act{font-size: 20px;background-color: #245682; color: #fff;padding: 5px;width: 36px;line-height: 26px;cursor: pointer;}
  .dash-act .item{margin: 0px 0px 1px 4px;}
  .dashboard-center{ overflow: hidden;float: left;width: 100%;margin:0px auto 10px;position: relative;margin-bottom: 20px;padding-bottom:5px;}
  .dashboard-center-left{ margin-bottom:0;}
  .dashboard-center-right{ position: absolute;right: 10px;height: 99%;}
  .dashboard-cr-inner{  position: absolute;right: 0;height: 100%;width: 96%;margin-bottom:0;}
  .dashboard-cl-inner{ margin-bottom:0;}
  .dashboard-box{background-color: #fff;height: auto;overflow: hidden;padding-bottom: 20px;}
  .display-name{width: 90%;padding-right: 5px;}
</style>
