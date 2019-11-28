<template>
  <div class="baidu-map">
    <baidu-map class="map" :center="center" :zoom="zoom" :scroll-wheel-zoom='true'>
      <bm-marker v-for='(value, key) in markers' :position='value.position' :key='key' @click='infoWindowOpen(value)'>
        <bm-info-window :show="showInfoWindow">
          Total Device Numbers: {{value.deviceIdsLength}}
        </bm-info-window>
      </bm-marker>
    </baidu-map>
  </div>
</template>
<script>
import BaiduMap from 'vue-baidu-map'
import mapIcon from '../../../static/img/spotlight-poi.png'
let thisVue = null
import Vue from 'vue'
Vue.use(BaiduMap, {
  ak: '7KfiNuV6dO5cH9icyNdHeIeSTVSsrHEB'
})
export default {
  props: ['markers'],
  data () {
    return {
      icon: {url: mapIcon, size: {width: 90, height: 60}},
      center: {},
      zoom: 4,
      showInfoWindow: false
    }
  },
  methods: {
    infoWindowClose () {
      thisVue.showInfoWindow = false
    },
    infoWindowOpen (val) {
      thisVue.$emit('getDeviceList', val.position, val.deviceIds)
      thisVue.showInfoWindow = true
      thisVue.center = val.position
      thisVue.zoom = 10
    }
  },
  mounted () {
    thisVue = this
  }
}
</script>
<style>
  .map{width: 100%;height: 450px;}
  .anchorBL{display: none;}
</style>
