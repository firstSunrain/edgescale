<template>
  <div name="list" class='key-box'>
    <el-row class='list-box' v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading....">
      <el-col :span='24' class='opr-box'>
        <el-col :span='18'>
          <div style='font-size: 2rem;vertical-align: middle;'>{{basicInfo.name}}</div>
        </el-col>
        <el-col :span='6' style='text-align:right;'>
          <el-button class='common-btn' size='small' @click='getInfo(curId)'><i class="icon-rotate-cw3"></i> {{ $t('refresh') }}</el-button>
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
                <label style='font-size: 15px;' v-if="key != 'is_active'">
                  <i class='icon-diamond4 info-icon'></i>
                  <span style='padding: 0px 6px;font-weight: bold;'>{{key | capitalize}}:</span>
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
  import { getKeyInfo } from '@/api'
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
    filters: {
      capitalize (val) {
        if (!val) return ''
        val = val.toString()
        return thisVue.$t(val)
      }
    },
    methods: {
      getInfo (id) {
        thisVue.loading = true
        getKeyInfo(id).then(dat => {
          let res = dat.data
          thisVue.loading = false
          thisVue.basicInfo = res
        }).catch(_ => {
          thisVue.loading = false
        })
      }
    },
    mounted () {
      thisVue = this
      thisVue.getInfo(thisVue.curId)
    }
  }
</script>

<style scoped>
  .opr-box{padding-bottom: 15px;}
  .el-collapse{ padding:0;}
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
