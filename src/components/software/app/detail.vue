<template>
  <div name="list" class='app-list'>
    <el-row class='list-box' v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading....">
      <el-col :span='24' class='opr-box'>
        <el-col :span='14'>
          <div style='font-size: 2rem;vertical-align: middel;'>
          <span style='color: #444;'>
            <img v-if='appBasicInfo.image' :src="appBasicInfo.image" alt="app icon" style="width:25px;height:25px;border-radius: 50%;">
            <img v-else :src="defaultIcon" alt="app icon" style="width:25px;height:25px;border-radius: 50%;">
          </span>
          <span>{{appBasicInfo.name}}</span>
          </div>
        </el-col>
        <el-col :span='10' style='text-align:right;'>
          <el-button class="common-btn" size='small' @click="$router.push({name: 'software_app_add', params: {appId: app_name}})"><i class="icon-googleplus5 text-size-base"></i> {{ $t('add_image') }}</el-button>
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
              <li>
                <label style='font-size: 14px;'>
                  <i class='icon-diamond4 info-icon' style='color: #06bcbf;font-size: 10px;'></i>
                  <span style='padding: 0px 6px;font-weight: bold;'>{{ $t('app_name') }}:</span>
                  <span style='color: #444;'>{{appBasicInfo.name}}</span>
                </label>
              </li>
              <li>
                <label style='font-size: 14px;'>
                  <i class='icon-diamond4 info-icon' style='color: #06bcbf;font-size: 10px;'></i>
                  <span style='padding: 0px 6px;font-weight: bold;'>{{ $t('desc') }}:</span>
                  <span style='color: #444;'>{{appBasicInfo.description}}</span>
                </label>
              </li>
              <li>
                <label style='font-size: 14px;'>
                  <i class='icon-diamond4 info-icon' style='color: #06bcbf;font-size: 10px;'></i>
                  <span style='padding: 0px 6px;font-weight: bold;'> {{ $t('version') }}:</span>
                  <span style='color: #444;' v-for="item in versions">{{item}}</span>
                </label>
              </li>
              <li  v-if="checkPermissionsList==='private'">
                <label style='font-size: 14px;'>
                  <i class='icon-diamond4 info-icon' style='color: #06bcbf;font-size: 10px;'></i>
                  <span style='padding: 0px 6px;font-weight: bold;'>{{ $t('permission') }}: </span>
                  <span>{{checkPermissionsList}}</span>
                </label>
              </li>
            </ul>
          </el-collapse-item>
          <el-collapse-item name='2'>
            <template slot='title'>
              <span class='collapse-tit'>{{ $t('image') }}</span>
            </template>
            <el-tabs v-model="tabActive">
              <el-tab-pane  v-for="(item, index) in appDockerInfo" :key="index" :name="`tab${index}`">
                <span slot="label"> {{ $t('docker_config') }} {{index+1}} <i class='el-icon-close' @click='handleDeleteDocker(item.id)'></i> </span>
                <ul>
                  <li>
                    <label style='font-size: 14px;'>
                      <i class='icon-diamond4 info-icon' style='color: #06bcbf;font-size: 10px;'></i>
                      <span style='padding: 0px 6px;font-weight: bold;'>{{ $t('registry') }}:</span>
                      <span style='color: #444;' v-for="itemM in appDockerMirrorList"><span v-if="itemM.id == item.registry_id">{{itemM.name}}</span></span>
                    </label>
                  </li>
                  <li>
                    <label style='font-size: 14px;'>
                      <i class='icon-diamond4 info-icon' style='color: #06bcbf;font-size: 10px;'></i>
                      <span style='padding: 0px 6px;font-weight: bold;'>{{ $t('app_image_name') }}:</span>
                      <span style='color: #444;'>{{ item.image_name}}</span>
                    </label>
                  </li>
                  <li>
                    <label style='font-size: 14px;'>
                      <i class='icon-diamond4 info-icon' style='color: #06bcbf;font-size: 10px;'></i>
                      <span style='padding: 0px 6px;font-weight: bold;'>{{ $t('version') }}:</span>
                      <span style='color: #444;'>{{item.version}}</span>
                    </label>
                  </li>
                  <li v-if="item.commands">
                    <label style='font-size: 14px;'>
                      <i class='icon-diamond4 info-icon' style='color: #06bcbf;font-size: 10px;'></i>
                      <span style='padding: 0px 6px;font-weight: bold;'>{{ $t('commands') }}:</span>
                      <span style='color: #444;'>{{item.commands}}</span>
                    </label>
                  </li>
                  <li v-if="item.args">
                    <label style='font-size: 14px;'>
                      <i class='icon-diamond4 info-icon' style='color: #06bcbf;font-size: 10px;'></i>
                      <span style='padding: 0px 6px;font-weight: bold;'>{{ $t('arguments') }}:</span>
                      <span style='color: #444;'>{{item.args}}</span>
                    </label>
                  </li>
                  <li v-if="item.arguments">
                    <label style='font-size: 14px;'>
                      <i class='icon-diamond4 info-icon' style='color: #06bcbf;font-size: 10px;'></i>
                      <span style='padding: 0px 6px;font-weight: bold;'>{{ $t('host_network') }}:</span>
                      <span style='color: #444;'>{{item.arguments.host_network}}</span>
                    </label>
                  </li>
                  <li v-if="item.arguments">
                    <label style='font-size: 14px;'>
                      <i class='icon-diamond4 info-icon' style='color: #06bcbf;font-size: 10px;'></i>
                      <span style='padding: 0px 6px;font-weight: bold;'>{{ $t('cap_add') }}: </span>
                      <span style='color: #444;'>{{item.arguments.cap_add}}</span>
                    </label>
                  </li>
                  <li v-if="item.arguments  && item.arguments.ports && item.arguments.ports.length
                  === 1 &&  item.arguments.ports[0].hostPort &&  item.arguments.ports[0].containerPort">
                    <label style='font-size: 14px;'>
                      <i class='icon-diamond4 info-icon' style='color: #06bcbf;font-size: 10px;'></i>
                      <span style='padding: 0px 6px;font-weight: bold;'>{{ $t('port') }}:</span>
                      <p class="pl-20" v-for="itemD in item.arguments.ports">
                        <span style='color: #444;' ><span style="font-weight: bold">{{ $t('host_port') }}: </span>{{itemD.hostPort}}</span>
                        <span class="pr-10" style='color: #444;' ><span style="font-weight: bold">{{ $t('container_port') }}: </span>{{itemD.containerPort}}</span>
                      </p>
                    </label>
                  </li>
                  <li v-else-if="item.arguments  && item.arguments.ports && item.arguments.ports.length > 1">
                    <label style='font-size: 14px;'>
                      <i class='icon-diamond4 info-icon' style='color: #06bcbf;font-size: 10px;'></i>
                      <span style='padding: 0px 6px;font-weight: bold;'>{{ $t('port') }}:</span>
                      <p class="pl-20" v-for="itemD in item.arguments.ports">
                        <span style='color: #444;' ><span style="font-weight: bold">{{ $t('host_port') }}: </span>{{itemD.hostPort}}</span>
                        <span class="pr-10" style='color: #444;' ><span style="font-weight: bold">{{ $t('container_port') }}: </span>{{itemD.containerPort}}</span>
                      </p>
                    </label>
                  </li>
                  <li v-if="item.arguments && item.arguments.volumes && item.arguments.volumes.length">
                    <label style='font-size: 14px;'>
                      <i class='icon-diamond4 info-icon' style='color: #06bcbf;font-size: 10px;'></i>
                      <span style='padding: 0px 6px;font-weight: bold;'>{{ $t('volumes') }}: </span>
                      <p class="pl-20" v-for="itemD in item.arguments.volumes">
                       <span class="pr-10" style='color: #444;'  v-if="itemD.hostPath"><span style="font-weight: bold">{{ $t('host_path') }}: </span>{{itemD.hostPath}}</span>
                       <span style='color: #444;' ><span style="font-weight: bold" v-if="itemD.mountPath">{{ $t('mount_path') }} </span>{{itemD.mountPath}}</span>
                       <span class="pr-10" style='color: #444;' ><span style="font-weight: bold">{{ $t('read_only') }} </span>{{itemD.mountPathReadOnly}}</span>
                      </p>
                    </label>
                  </li>
                </ul>
              </el-tab-pane>
            </el-tabs>
          </el-collapse-item>
          <!-- documents -->
          <el-collapse-item name='3'>
            <template slot='title'>
              <span class='collapse-tit'>{{ $t('app_doc') }}</span>
            </template>
            <div v-html='documents'></div>
          </el-collapse-item>
        </el-collapse>
      </el-col>

    </el-row>
  </div>
</template>

<script>
  import { appInfo, appVersionList, appDocInfo, appDockerDelete, appDockerInfo, appMirrorsList } from '@/api'
  import defaultIcon from '../../../../static/img/SMBRouterF.png'

  let thisVue = null

  export default {
    data () {
      return {
        loading: true,
        defaultIcon: defaultIcon,
        username: '',
        documents: 'The owner has not added the document information',
        basicInfo: this.$route.params.info,
        appPeimission: this.$route.params.appPermission,
        activeNames: ['1', '2', '3'],
        tabActive: 'tab0',
        app_name: this.$route.params.appId,
        checkPermissionsList: 'private',
        appBasicInfo: '',
        appDockerInfo: '',
        versions: '',
        appDockerMirrorList: []
      }
    },
    methods: {
      getInfo () {
        thisVue.loading = true
        appInfo(thisVue.app_name).then(dat => {
          let res = dat.data
          thisVue.loading = false
          thisVue.appBasicInfo = res
          if (res.is_public === true) {
            thisVue.checkPermissionsList = 'public'
          } else {
            thisVue.checkPermissionsList = 'private'
          }
        }).catch(_ => {
          thisVue.loading = false
        })
      },
      getBasicInfo () {
        thisVue.loading = true
        appDockerInfo(thisVue.app_name).then(dat => {
          let res = dat.data
          thisVue.loading = false
          if (res.images) {
            thisVue.appDockerInfo = res.images
            let aryVersion = []
            for (let item in res.images) {
              aryVersion.push(res.images[item].version)
            }
            if (aryVersion && aryVersion.length > 0) {
              aryVersion = [...new Set(aryVersion)]
            }
            localStorage.setItem('versionAry', aryVersion)
          }
        }).catch(_ => {
          thisVue.loading = false
        })
      },
      getAllVersion () {
        appVersionList(thisVue.app_name).then(dat => {
          let res = dat.data
          thisVue.loading = false
          if (res.versions) {
            thisVue.versions = res.versions
          }
        }).catch(_ => {
          thisVue.loading = false
        })
      },
      getDocument () {
        appDocInfo(thisVue.app_name).then(dat => {
          let res = dat.data
          thisVue.loading = false
          if (res) {
            thisVue.documents = res
          }
        }).catch(_ => {
          thisVue.loading = false
        })
      },
      handleDeleteDocker (id) {
        thisVue.$confirm(thisVue.$t('want_to_continue'), thisVue.$t('delete'), {type: 'warning'}).then(_ => {
          thisVue.loading = true
          appDockerDelete(thisVue.app_name, id).then(dat => {
            thisVue.loading = false
            thisVue.tabActive = 'tab0'
            thisVue.getBasicInfo()
          }).catch(_ => {
            thisVue.loading = false
          })
        }).catch(_ => {
          return false
        })
      },
      getMirrorList () {
        appMirrorsList().then(dat => {
          let res = dat.data
          thisVue.loading = false
          if (res) {
            thisVue.appDockerMirrorList = res.mirrors
          }
        }).catch(_ => {
          thisVue.loading = false
        })
      },
      getAllInfo () {
        thisVue.getInfo()
        thisVue.getBasicInfo()
        thisVue.getAllVersion()
        thisVue.getDocument()
        thisVue.getMirrorList()
      }
    },
    mounted () {
      thisVue = this
      thisVue.getAllInfo()
    }
  }
</script>

<style scoped>
  .app-list{min-height: 500px;}
  .list-box{background-color: #fff;padding: 15px 20px;}
  .opr-box{padding-bottom: 10px;}
  .list-tit{padding: 15px 20px; font-size: 2rem; border-bottom: 1px solid #ddd;}
  .el-collapse li{list-style: none;}
  .cell .el-button--mini{width: 100px;}
  .col-btn{padding-left: 30px;}
</style>
