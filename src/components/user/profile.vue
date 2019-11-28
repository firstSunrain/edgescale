<template>
  <div name="list" class='app-list detail-box'>
    <el-row class='list-box' v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading....">
      <el-col :span='24' class='opr-box'>
        <el-col :span='18'>
          <div style='font-size: 2rem;vertical-align: middel;'>{{ userDetail.username }}</div>
        </el-col>
        <el-col :span='6' style='text-align:right;'>
          <el-button class="common-btn" size='small' @click='getInfo'><i class="icon-rotate-cw3"></i> {{ $t('refresh') }}</el-button>
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
              <li v-for="(value, key) in userDetail" :key='key'>
                <label style='font-size: 15px;' v-if="value !== null && key !== 'is_admin'">
                  <i class='icon-diamond4' style='color: #06bcbf;font-size: 10px;'></i>
                  <span style='padding: 0px 6px;font-weight: bold;'>{{key | charUpper}}:</span>
                  <span style='color: #444;'>{{value}}</span>
                </label>
              </li>
            </ul>
          </el-collapse-item>
          <!-- basic -->
          <el-collapse-item name='2'>
            <template slot='title'>
              <span class='collapse-tit'>{{ $t('limit_info') }}</span>
            </template>
            <div class="com-table">
              <el-table :data='tableList' align='center'>
                <el-table-column :label="$t('id')" prop='limit_type_id' width='120'>
                </el-table-column>
                <el-table-column :label="$t('type')" prop='limit_type'></el-table-column>
                <el-table-column  :label="$t('max_limit')" prop='max_limit' width='160'></el-table-column>
              </el-table>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-col>

    </el-row>
  </div>
</template>

<script>
  import { getUserLimit, getPermission } from '@/api'
  let thisVue = null

  export default {
    data () {
      return {
        tableList: [],
        userDetail: {},
        logList: [],
        loading: true,
        activeNames: ['1', '2'],
        user_name: ''
      }
    },
    filters: {
      charUpper (val) {
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
    methods: {
      getInfo () {
        thisVue.loading = true
        getUserLimit().then(dat => {
          let res = dat.data
          thisVue.loading = false
          if (res.limits) {
            thisVue.tableList = res.limits
          }
        }).catch(_ => {
          thisVue.loading = false
        })
      },
      getPermissions () {
        getPermission().then(dat => {
          let res = dat.data
          if (res) {
            thisVue.is_admin = res.is_admin
            let {username, email} = res
            let type = res.account_type.name
            let identify = res.is_admin ? 'Admin' : 'User'
            thisVue.userDetail = {username, email, type, identify}
            thisVue.loading = false
          }
        }).catch(_ => {
          thisVue.loading = false
        })
      }
    },
    mounted () {
      thisVue = this
      thisVue.getInfo()
      thisVue.getPermissions()
    }
  }
</script>

<style scoped>
  .app-list{min-height: 500px;background-color: #fff;}
</style>
