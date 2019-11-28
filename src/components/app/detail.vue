<template>
  <div name="list" class='app-group detail-box'>
    <el-row v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading....">
      <div class="media stack-media-on-mobile text-left opr-box-container">
      <el-col :span='24' class='opr-box'>
        <el-col :span='18'>
          <div style='font-size: 2rem;vertical-align: middel;'>{{basicInfo.name}}</div>
        </el-col>
        <el-col :span='6' style='text-align:right;'>
          <el-button class="common-btn" size='small' @click='getInfo(curId)'><i class="icon-rotate-cw3"></i>{{ $t('refresh') }}</el-button>
        </el-col>
      </el-col>
      </div>

      <el-col :span='24'>
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
              <span class='collapse-tit'>{{ $t('document') }}</span>
            </template>
            <div v-html='document' class='document-box'></div>
          </el-collapse-item>
        </el-collapse>
      </el-col>

    </el-row>
  </div>
</template>

<script>
  import { appInfo, appDocInfo } from '@/api'
  let thisVue = null

  export default {
    data () {
      return {
        basicInfo: {},
        document: '',
        loading: true,
        status: '',
        activeNames: ['1', '2'],
        curId: this.$route.params.id
      }
    },
    methods: {
      getInfo (id) {
        thisVue.loading = true
        appInfo(id).then(dat => {
          let res = dat.data
          thisVue.loading = false
          let {id, name, display_name, image, description} = res
          thisVue.basicInfo = {id, name, display_name, image, description}
        }).catch(_ => {
          thisVue.loading = false
          return false
        })
      },
      getDoc (id) {
        thisVue.loading = true
        appDocInfo(id).then(dat => {
          let res = dat.data
          thisVue.loading = false
          thisVue.document = res
        }).catch(_ => {
          thisVue.loading = false
          return false
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
      thisVue.getDoc(thisVue.curId)
    }
  }
</script>

<style scoped>
  .basic-box{padding: 10px;}
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
  .detail-box .document-box{padding-left: 20px;}
</style>
<style>
  .app-card .el-collapse-item__wrap{background-color: #f5f5f5;padding: 20px;}
  .detail-box .document-box h1{ font-size:15px;font-weight: bold;color: #223c53;}
  .detail-box .document-box h3{ margin: 2px 0 -10px;font-size:14px;color: #5d768d;}
  .detail-box .document-box p{ margin-bottom:0; font-size:14px;}
  .detail-box .document-box ul{ list-style:none;}
  .detail-box .document-box ul li{ margin-bottom: 6px;padding-left: 6px;border-left: 2px solid #dce2e7;}
</style>
