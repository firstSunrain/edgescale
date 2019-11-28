<template>
  <div name="list" class='app-list detail-box'>
    <el-row class='list-box' v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading....">
      <div class="media stack-media-on-mobile text-left opr-box-container">
        <el-col :span='24' class='opr-box'>
          <el-col :span='18'>
            <div style='font-size: 2rem;'>{{build_name}}</div>
          </el-col>
          <div class="btn-group">
            <el-button class='common-btn together-btn' size='small' @click='toCreate'><i class="icon-pencil5"></i>{{ $t('edit') }}</el-button>
            <el-button class='common-btn together-btn' size='small' @click='getInfo(build_name)'><i class="icon-rotate-cw3"></i>{{ $t('refresh') }}</el-button>
          </div>
        </el-col>
      </div>

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
                    <span style='color: #444;'>{{value}}</span>
                  </label>
                </li>
              </ul>
          </el-collapse-item>
          <!-- source code -->
          <el-collapse-item name='2'>
            <template slot='title'>
              <span class='collapse-tit'>{{ $t('source_code') }}</span>
            </template>
            <ul>
              <li v-for="(value, key) in sourceInfo" :key='key'>
                <label style='font-size: 15px;'>
                  <i class='icon-diamond4 info-icon'></i>
                  <span style='padding: 0px 6px;font-weight: bold;'>{{key | capitalize}}:</span>
                  <span style='color: #444;'>{{value}}</span>
                </label>
              </li>
            </ul>
          </el-collapse-item>
          <!-- environment -->
          <el-collapse-item name='3'>
            <template slot='title'>
              <span class='collapse-tit'>{{ $t('build_env') }}</span>
            </template>
            <ul>
              <li v-for="(value, key) in imageInfo" :key='key'>
                <label style='font-size: 15px;'>
                  <i class='icon-diamond4 info-icon'></i>
                  <span style='padding: 0px 6px;font-weight: bold;'>{{key | capitalize}}:</span>
                  <span style='color: #444;'>{{value}}</span>
                </label>
              </li>
            </ul>
          </el-collapse-item>
          <!-- log -->
          <el-collapse-item name='4'>
            <template slot='title'>
              <span class='collapse-tit'>{{ $t('build_history') }}</span>
            </template>
            <div class="com-table">
              <el-table :data='logList' size='small'>
                <el-table-column :label="$t('id')" width='300'>
                  <template slot-scope='scope'>
                    <router-link :to="{name: 'build_log', query: {name: build_name, executionId: scope.row.id}}">{{scope.row.id}}</router-link>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('status')">
                  <template slot-scope='scope'>
                    <el-button class="status-scheduled" v-if="scope.row.status == 'Pended'">{{ $t('builder_pended') }}</el-button>
                    <el-button class="status-off" v-if="scope.row.status == 'Failed'">{{ $t('builder_failed') }}</el-button>
                    <el-button class="status-on" v-if="scope.row.status == 'Succeeded'">{{ $t('builder_succeeded') }}</el-button>
                    <el-button class="status-private" v-if="scope.row.status == 'InProgress'" :loading='true'>{{ $t('builder_inprogress') }}</el-button>
                  </template>
                </el-table-column>
                <el-table-column prop='lastUpdateTime' :label="$t('last_time')"></el-table-column>
                <el-table-column prop='startTime' :label="$t('start_time')"></el-table-column>
              </el-table>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-col>

    </el-row>
  </div>
</template>

<script>
  import { builderInfo } from '@/api'

  let thisVue = null

  export default {
    data () {
      return {
        sourceInfo: {},
        imageInfo: {},
        basicInfo: {},
        logList: [],
        loading: true,
        status: '',
        activeNames: ['1', '2', '3', '4'],
        build_name: this.$route.params.buildName
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
      getInfo (name) {
        thisVue.loading = true
        builderInfo(name).then(dat => {
          let res = dat.data
          thisVue.loading = false
          let {name, description, sourceProvider, pollForSourceChanges, timeoutInMinutes, image, computeType, source} = res
          thisVue.sourceInfo = {sourceProvider, source, pollForSourceChanges}
          thisVue.imageInfo = {image, computeType, 'timeout': timeoutInMinutes}
          thisVue.basicInfo = {name, description}
          thisVue.logList = res.builds
        }).catch(_ => {
          thisVue.loading = false
          return false
        })
      },
      toCreate () {
        thisVue.$router.push('/builder/edit/' + thisVue.build_name)
      }
    },
    mounted () {
      thisVue = this
      thisVue.getInfo(thisVue.build_name)
    }
  }
</script>

<style scoped>
  .opr-box-container{ overflow:hidden;}
  .app-list{min-height: 500px;background: #fff;}
  .list-box{background-color: #fff;}
  .opr-box{ }
  .list-tit{padding: 15px 20px; font-size: 2rem; border-bottom: 1px solid #ddd;}
  .el-collapse{ }
  .el-collapse li{list-style: none;}
  .cell .el-button--mini{width: 100px;}
</style>
