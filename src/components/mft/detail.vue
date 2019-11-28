<template>
  <div name="list" class='detail-box basic-box'>
    <el-row class='list-box' v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading....">
      <el-col :span='24' class='opr-box'>
        <el-col :span='18'>
          <div style='font-size: 2rem;vertical-align: middel;'>{{basicInfo.name}}</div>
        </el-col>
        <el-col :span='6' style='text-align:right;'>
          <el-button class="common-btn" size='small' @click='getInfo(curId)'><i class="icon-rotate-cw3"></i> {{ $t('refresh') }}</el-button>
        </el-col>
      </el-col>

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
                  <span style='color: #444;' v-if="key == 'create_time'">{{value | dateFormat}}</span>
                  <span style='color: #444;' v-else>{{value}}</span>
                </label>
              </li>
            </ul>
          </el-collapse-item>
          <!-- device -->
          <el-collapse-item name='2'>
            <template slot='title'>
              <span class='collapse-tit'>{{ $t('upper_device') }}</span>
            </template>
            <deviceTable :mftId='curId'></deviceTable>
          </el-collapse-item>
        </el-collapse>
      </el-col>

    </el-row>
  </div>
</template>

<script>
  import { getMftInfo } from '@/api'
  import deviceTable from './devtable'
  let thisVue = null

  export default {
    components: { deviceTable },
    data () {
      return {
        basicInfo: {},
        loading: true,
        status: '',
        activeNames: ['1', '2'],
        curId: this.$route.params.id
      }
    },
    methods: {
      getInfo (id) {
        thisVue.loading = true
        getMftInfo(id).then(dat => {
          let res = dat.data
          thisVue.loading = false
          thisVue.basicInfo = res
        }).catch(_ => {
          thisVue.loading = false
        })
      }
    },
    filters: {
      capitalize (val) {
        if (!val) return ''
        val = val.toString()
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
    mounted () {
      thisVue = this
      thisVue.getInfo(thisVue.curId)
    }
  }
</script>

<style scoped>
  .basic-box{padding: 0px;}
  .el-collapse li{list-style: none;}
  .info-icon{font-size: 10px; color: #7badff;}
  .collapse-tit{border-left: 2px solid #0072ea;padding-left: 10px;}
</style>
<style>
  .app-card .el-collapse-item__wrap{background-color: #f5f5f5;padding: 20px;}
</style>
