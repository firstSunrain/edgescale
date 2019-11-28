<template>
  <div name="list" class='app-list detail-box'>
    <el-row class='list-box' v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading....">
      <div class="media stack-media-on-mobile text-left opr-box-container">
      <el-col :span='24' class="opr-box">
        <el-col :span='18'>
          <div style='font-size: 2rem;'>{{build_name}}</div>
        </el-col>
        <div class="btn-group">
          <el-button class="common-btn" type='primary' size='small' @click='autoRefresh' v-if='!is_auto'><i class="icon-rotate-cw3"></i>Auto Refresh</el-button>
          <el-button class="common-btn" size='small' @click='clearRefresh' v-if='is_auto'><i class="icon-rotate-cw3"></i>Disable Auto Refresh</el-button>
        </div>
      </el-col>
      </div>

      <el-col :span='24'>
        <el-collapse v-model='activeNames'>
          <el-collapse-item name='1'>
            <template slot='title'>
              <span class='collapse-tit'>{{ $t('log') }}</span>
            </template>
            <el-col :span='24' class='basic-box' id='log-box'>
              <p v-if='log_info.length > 0' v-for='(value, key) in log_info' class='log-p'>
                <span>{{value.ingestionTime}}: </span><span v-html='value.message'></span>
              </p>
              <p v-if='log_info.length == 0 && !is_auto' style='text-align: center; font-size: 30px;padding: 30px 0px;color: #afafaf;'>Build is started and logs are not available currently. Please refresh</p>
              <p v-if='log_info.length == 0 && is_auto' style='text-align: center; font-size: 30px;padding: 30px 0px;color: #afafaf;'>trying to build, please wait...</p>
            </el-col>
          </el-collapse-item>
        </el-collapse>
      </el-col>


    </el-row>
  </div>
</template>

<script>
  import { builderLogs } from '@/api'

  let thisVue = null
  let durTime

  export default {
    data () {
      return {
        log_info: [],
        loading: true,
        is_auto: false,
        build_name: '',
        executionId: '',
        activeNames: ['1', '2']
      }
    },
    methods: {
      getInfo (name) {
        builderLogs(name, {id: thisVue.executionId}).then(dat => {
          let res = dat.data
          thisVue.loading = false
          for (let value of res) {
            if (value.ingestionTime) {
              value.ingestionTime = thisVue.timeTransfer(value.ingestionTime)
            }
          }
          thisVue.log_info = res
          document.getElementById('log-box').scrollTo(0, document.getElementById('log-box').scrollHeight)
        }).catch(_ => {
          thisVue.loading = false
          return false
        })
      },
      timeTransfer (str) {
        let d = new Date(str)
        let year = d.getFullYear()
        let mon = d.getMonth() + 1
        let day = d.getDate()
        let h = d.getHours()
        let m = d.getMinutes()
        let sec = d.getSeconds()
        return year + '-' + mon + '-' + day + ' ' + h + ':' + m + ':' + sec
      },
      autoRefresh () {
        thisVue.is_auto = true
        durTime = setInterval(function () {
          thisVue.getInfo()
        }, 5000)
      },
      clearRefresh () {
        thisVue.is_auto = false
        clearInterval(durTime)
      }
    },
    mounted () {
      thisVue = this
      thisVue.build_name = thisVue.$route.query.name
      thisVue.executionId = thisVue.$route.query.executionId
      thisVue.getInfo(thisVue.build_name)
    },
    updated () {
      document.getElementById('log-box').scrollTo(0, document.getElementById('log-box').scrollHeight)
    },
    destroyed () {
      thisVue.clearRefresh()
    }
  }
</script>

<style scoped>
  .app-list{min-height: 500px;background: #fff;}
  .list-box{background-color: #fff;}
  .basic-box{ height:400px;margin-bottom:20px;overflow-y:auto;border: 1px solid #e9eef1;
    padding-left:0;
    -webkit-box-shadow: 0px 1px 5px 0px rgba(21,59,92,0.11);
    -moz-box-shadow: 0px 1px 5px 0px rgba(21,59,92,0.11);
    box-shadow: 0px 1px 5px 0px rgba(21,59,92,0.11);}
  .log-p{padding: 0px 10px;}
  .collapse-tit{border-left: 2px solid #0072ea;padding-left: 10px;}
</style>
