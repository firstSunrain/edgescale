<template>
  <div class="appdpl-box" v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading...">
    <el-row :gutter='20'>
      <el-col :span='12' class='com-table'>
        <el-table :data='tableData' size='small'>
          <el-table-column :label="$t('app_name')">
            <template slot-scope='scope'>
              <router-link :to="{name: 'app_detail', params: {id: scope.row.metadata.name}}">
                <span>{{scope.row.metadata.display_name}}</span>
              </router-link>
            </template>
          </el-table-column>
          <el-table-column :label="$t('cpu_usage')">
            <template slot-scope='scope'>
              <span>19%</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('mem_usage')">
            <template slot-scope='scope'>
              <span>23%</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('status')">
            <template slot-scope='scope'>
              <router-link :to="{name: 'app_detail', params: {id: '1111'}}">
                <span class="status-private" v-if="scope.row.status.phase === 'waiting'">{{ scope.row.status.phase | capitalize }}</span>
                <span class="status-private" v-else-if="scope.row.status.phase === 'pending'">{{ scope.row.status.phase | capitalize }}</span>
                <span class="status-on" v-else-if="scope.row.status.phase === 'running'">{{ scope.row.status.phase | capitalize }}</span>
                <span class="status-retired" v-else>{{scope.row.status.phase | capitalize}}</span>
              </router-link>
            </template>
          </el-table-column>
          <el-table-column :label="$t('action')" width='140'>
            <template slot-scope='scope'>
              <el-tooltip class="item" effect="dark" :content="$t('stop')" placement="top">
                <i class="table-btn icon-pause" @click="del(scope.$index)"></i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="$t('start')" placement="top">
                <i class="table-btn icon-play3" @click="del(scope.$index)"></i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="$t('delete')" placement="top">
                <i class="table-btn icon-trash" @click="del(scope.$index)"></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span='12'>
        <el-row :gutter='10'>
          <el-col :span='8' style='text-align: center; color: #189471;margin-top: 20px;'>
            <div style='font-size: 60px;font-weight: bold;line-height: 60px;'>{{info.running}}</div>
            <p>Running</p>
          </el-col>
          <el-col :span='8' style='text-align: center; color: #b3841c;margin-top: 20px;'>
            <div style='font-size: 60px;font-weight: bold;line-height: 60px;'>{{info.creating}}</div>
            <p>Creating</p>
          </el-col>
          <el-col :span='8' style='text-align: center; color: #b94848;margin-top: 20px;'>
            <div style='font-size: 60px;font-weight: bold;line-height: 60px;'>{{info.stopped}}</div>
            <p>Stoped</p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='12'><el-divider><span class='divider-w'>Memory usage</span></el-divider></el-col>
          <el-col :span='12'><el-divider><span class='divider-w'>CPU usage</span></el-divider></el-col>
        </el-row>
        <el-row>
          <el-col :span='12'><ve-ring :data="chartMem" :extend="ringSettings"></ve-ring></el-col>
          <el-col :span='12'><ve-ring :data="chartCpu" :extend="ringSettings"></ve-ring></el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getAppInDevice, appDeployDelete } from '@/api'
let thisVue = null

export default {
  props: ['deviceId'],
  data () {
    this.ringSettings = {
      legend: {x: 'center', icon: 'diamond', itemHeight: 12, itemWidth: 12},
      series: {
        radius: ['33%', '40%'],
        center: ['50%', '25%'],
        label: {show: false}
      }
    }
    return {
      loading: false,
      tableData: [],
      info: {},
      chartMem: {
        columns: ['name', 'usage'],
        rows: []
      },
      chartCpu: {
        columns: ['name', 'usage'],
        rows: []
      }
    }
  },
  filters: {
    capitalize (val) {
      if (!val) return ''
      val = val.toString().toLowerCase()
      return thisVue.$t(val)
    },
    dateFormat (val) {
      if (val) {
        let _date = new Date(val)
        let y = _date.getFullYear()
        let m = _date.getMonth() + 1
        let d = _date.getDate()
        let h = _date.getHours() >= 10 ? _date.getHours() : `0${_date.getHours()}`
        let mm = _date.getMinutes() >= 10 ? _date.getMinutes() : `0${_date.getMinutes()}`
        let s = _date.getSeconds() >= 10 ? _date.getSeconds() : `0${_date.getSeconds()}`
        return `${y}-${m}-${d} ${h}:${mm}:${s}`
      } else {
        return ''
      }
    }
  },
  methods: {
    getTable () {
      thisVue.loading = true
      let params = {device_id: thisVue.deviceId}
      getAppInDevice(params).then(dat => {
        let res = dat.data
        thisVue.loading = false
        thisVue.info = res
        if (res) {
          thisVue.tableData = res.list
          res.list.map(item => {
            thisVue.chartMem.row.push({name: item.name, usage: item.mem_usage})
            thisVue.chartCpu.row.push({name: item.name, usage: item.cpu_usage})
          })
        }
      }).catch(_ => {
        thisVue.loading = false
      })
    },
    del (index) {
      let id = thisVue.tableData[index].id
      thisVue.$confirm(thisVue.$t('customer_del_msg'), thisVue.$t('delete'), {type: 'warning'}).then(_ => {
        thisVue.loading = true
        appDeployDelete({names: id}).then(dat => {
          let res = dat.data
          thisVue.loading = false
          if (res.status === 'success') {
            thisVue.$message({message: thisVue.$t('del_success'), type: 'success'})
            thisVue.getTable()
          } else {
            thisVue.$message({message: thisVue.$t('del_fail'), type: 'error'})
          }
        }).catch(_ => {
          thisVue.loading = false
        })
      }).catch(_ => {
        return false
      })
    }
  },
  mounted () {
    thisVue = this
    thisVue.getTable()
  }
}
</script>
<style>
.ve-ring{height: 250px !important;}
.divider-w{color: #a5a0a0;font-weight: normal;}
</style>
