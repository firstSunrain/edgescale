<template>
  <el-row class='api-box' v-loading='loading' element-loading-spinner="el-icon-loading">
    <el-col :span='24' class='opr-box'>
      <el-date-picker size='small' v-model="date_filter_start" placeholder="start date" value-format="yyyy-MM-dd HH"></el-date-picker>
      <el-date-picker size='small' v-model="date_filter_end" placeholder="end date" value-format="yyyy-MM-dd HH"></el-date-picker>
      <el-button class='common-btn' size='mini' @click='getChartData' icon='el-icon-search'>{{$t('search')}}</el-button>
      <el-select v-model='type' size='small' class='api-type' @change='getChartData'>
        <el-option :label="$t('allApiStatistice')" value=''></el-option>
        <el-option :label='$t("createDeviceStatistice")' value='cd'></el-option>
        <el-option :label='$t("deployAppStatistice")' value='da'></el-option>
        <el-option :label='$t("OTAStatistice")' value='ota'></el-option>
      </el-select>
    </el-col>
    <el-col :span='24' class='api-all-usage'>
      <ve-line :data="chartData" :settings='chartSettings' v-if='chartData.rows.length > 0'></ve-line>
      <p v-if='chartData.rows.length == 0' class='no-data-p'>{{$t('noData')}}</p>
    </el-col>
  </el-row>
</template>
<script>
import { apiUsageSts } from '@/api'
let thisVue = null
export default {
  data () {
    return {
      chartSettings: {
        xAxisType: 'time',
        metrics: ['usage_rate']
      },
      chartData: {
        columns: ['date', 'usage_rate'],
        rows: []
      },
      date_filter_start: '',
      date_filter_end: '',
      activeNames: ['1', '2', '3', '4'],
      type: '',
      loading: true
    }
  },
  methods: {
    getChartData () {
      thisVue.loading = true
      let url = '/api/usage'
      let _start = thisVue.date_filter_start
      let _end = thisVue.date_filter_end
      if (thisVue.type) {
        url += `/${thisVue.type}`
        _start = _start.substr(0, _start.length - 3)
        _end = _end.substr(0, _end.length - 3)
      }
      let params = {start_utc_time: _start, end_utc_time: _end}
      apiUsageSts(params, url).then(dat => {
        let res = dat.data
        thisVue.loading = false
        let arr = []
        if (res.status === 'fail') {
          thisVue.$message({type: 'error', message: res.message})
        } else {
          for (let _date in res) {
            for (let _time in res[_date]) {
              let newTime
              if (_time < 10) {
                newTime = '0' + _time
              } else {
                newTime = _time
              }
              let newDate = _date.substr(0, 4) + '-' + _date.substr(4, 2) + '-' + _date.substr(6, 2) + ' ' + newTime + ':00:00'
              let params = {'date': newDate, 'usage_rate': parseInt(res[_date][_time])}
              arr.push(params)
            }
          }
          thisVue.chartData.rows = arr
        }
      }).catch(_ => {
        thisVue.loading = false
      })
    }
  },
  mounted () {
    thisVue = this
    let curDate = new Date()
    thisVue.date_filter_end = curDate.getFullYear() + '-' + (curDate.getMonth() + 1) + '-' + (curDate.getDate() + ' 23')
    curDate.setDate(curDate.getDate() - 7)
    thisVue.date_filter_start = curDate.getFullYear() + '-' + (curDate.getMonth() + 1) + '-' + (curDate.getDate() + ' 00')
    thisVue.getChartData()
  }
}
</script>
<style scoped>
  /**/
  .api-box{min-height: 500px;background-color: #fff;padding: 0px 20px;}
  .opr-box{padding: 15px 20px;}
  .api-all-usage{margin-top: 20px;}
  .api-type{margin-left: 20px;}
  .no-data-p{font-size: 80px;text-align: center;margin: 60px 0px;color: #cecece;font-weight: bold;}
</style>
