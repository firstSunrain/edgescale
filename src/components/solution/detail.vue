<template>
  <div name="list" class='solution-group detail-box'>
    <el-row v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading....">
      <div class="media stack-media-on-mobile text-left opr-box-container">
      <el-col :span='24' class='opr-box'>
        <el-col :span='18'>
          <div style='font-size: 2rem;vertical-align: middel;'>{{basicInfo.solution}}</div>
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
                <label style='font-size: 15px;width: 100%;' v-if="key !== 'link'">
                  <i class='icon-diamond4 info-icon'></i>
                  <span style='padding: 0px 6px;font-weight: bold;'>{{key | capitalize}} :</span>
                  <span class='con-info' v-if="key == 'create_time'">{{value | dateFormat}}</span>
                  <a class='con-info' v-else-if="key == 'image'" :href='basicInfo.link'>{{value}}</a>
                  <span class='con-info' v-else>{{value}}</span>
                </label>
              </li>
            </ul>
          </el-collapse-item>
          <!-- device -->
          <el-collapse-item name='2'>
            <template slot='title'>
              <span class='collapse-tit'>{{ $t('tag') }}</span>
            </template>
            <div class="tag-box">
              <el-tag type='success' size='' v-for='(value, key) in tags' :key='key'>{{value.name}}</el-tag>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-col>

    </el-row>
  </div>
</template>

<script>
  import { solutionInfo } from '@/api'
  let thisVue = null

  export default {
    data () {
      return {
        basicInfo: {},
        tags: [],
        loading: true,
        status: '',
        activeNames: ['1', '2'],
        curId: this.$route.params.id
      }
    },
    methods: {
      getInfo (id) {
        thisVue.loading = true
        solutionInfo(id).then(dat => {
          let res = dat.data
          thisVue.loading = false
          let {model, type, vendor, platform} = res.model
          let {id, solution, is_default, image, link, version} = res
          thisVue.basicInfo = {id, solution, is_default, model, type, vendor, platform, image, link, version}
          thisVue.tags = res.tags
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
  .opr-box-container{ overflow:hidden;}
  .el-collapse li{list-style: none;}
  .info-icon{font-size: 10px; color: #7badff;}
  .cell .el-button--mini{width: 100px;}
  .card-box{margin: 0px 5px;width: 240px;height: 250px;float: left;background-color: #fff;}
  .card-tit{background-color: #7badff;height: 40px;line-height: 40px;color: #fff;font-size: 14px;padding: 0px 10px;}
  .card-con{padding: 20px;height: auto;overflow: hidden;text-align: center;}
  .card-con h4{color: #0072ea;margin: 5px 0px;}
  .card-con img{border-radius: 50%;}
  .card-con p{height: 90px;overflow: hidden;}
  .collapse-tit{border-left: 2px solid #245682;padding-left: 10px;}
  .tag-box{padding-left: 20px;}
  .tag-box .el-tag{ margin-right: 5px;}
  .con-info{color: #444;display: inline-block;vertical-align: middle;overflow: hidden;}
  a.con-info{color: #4a95c3;}
</style>
<style>
  .app-card .el-collapse-item__wrap{background-color: #f5f5f5;padding: 20px;}
</style>
