<template>
  <div name="list" class='zoo_box'>
    <el-row class='list-box' v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading....">
      <el-col :span='24' class='opr-box'>
        <el-col :span='18'>
          <div style='font-size: 2rem;vertical-align: middel;'>{{basicInfo.name}}</div>
        </el-col>
        <el-col :span='6' style='text-align:right;'>
          <el-button-group>
            <el-button size='small' @click='getInfo(curId)' icon='el-icon-refresh'>Refresh</el-button>
          </el-button-group>
        </el-col>
      </el-col>
      <el-col :span='24' class='basic-box'>
        <el-collapse v-model='activeNames'>
          <!-- model -->
          <el-collapse-item name='1'>
            <template slot='title'>
              <span class='collapse-tit'>Device Detail</span>
            </template>
            <ul>
              <li v-for="(value, key) in basicInfo" :key='key'>
                <label style='font-size: 15px;'>
                  <i class='icon-diamond4 info-icon'></i>
                  <span style='padding: 0px 6px;font-weight: bold;'>{{key}}:</span>
                  <span style='color: #444;'>{{value}}</span>
                </label>
              </li>
            </ul>
          </el-collapse-item>
         </el-collapse>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  // import Common from '../../../../static/js/common.js'
  import { eiqDetail } from '@/api/api'
  import publicJS from '../../../../static/js/public.js'
  let thisVue = null

  export default {
    data () {
      return {
        basicInfo: {},
        loading: true,
        status: '',
        activeNames: ['1'],
        curId: this.$route.params.id
      }
    },
    methods: {
      getInfo (id) {
        if (!thisVue.loading) {
          thisVue.loading = true
        }
        eiqDetail('get', 'device', {id: id}).then(json => {
          // console.log(json.data)
          thisVue.loading = false
          json.data.date_created = publicJS.timetrans(json.data.date_created)
          json.data.date_updated = publicJS.timetrans(json.data.date_updated)
          thisVue.basicInfo = json.data
        }).catch(_ => {
          thisVue.loading = false
          return false
        })
      }
    },
    mounted () {
      thisVue = this
      this.$nextTick(function () {
        let pageHeaderData = {
          'homeRouterName': 'home',
          'firstTitle': 'device',
          'firstRouterName': 'zoo_device_list',
          'secondTitle': 'Detail'
        }
        // Common.setPageHeaderData(thisVue, pageHeaderData)
        thisVue.$store.dispatch('setPageHeaderData', pageHeaderData)
        thisVue.getInfo(thisVue.curId)
      })
    }
  }
</script>

<style scoped>
  .opr-box{padding-bottom: 15px;}
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
</style>
<style>
  .app-card .el-collapse-item__wrap{background-color: #f5f5f5;padding: 20px;}
</style>