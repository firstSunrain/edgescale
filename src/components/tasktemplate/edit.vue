<template>
  <div name="list" class='task-template detail-box'>
    <el-row class='list-box' v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading....">
      <el-col :span='24' class='opr-box'>
        <el-col :span='18'>
          <div style='font-size: 2rem;vertical-align: middel;'>{{basicInfo.name}}</div>
        </el-col>
        <div class="btn-group">
          <el-button class="common-btn together-btn" size='small' type='primary' @click='deploy'><i class="iconfont icon-deployment"></i>{{ $t('deploy') }}</el-button>
          <el-button class="common-btn together-btn" size='small' type='warning' @click='save'><i class="iconfont icon-save"></i>{{ $t('save') }}</el-button>
        </div>
      </el-col>

      <el-col :span='24' class='basic-box'>
        <el-collapse v-model='activeNames'>
          <!-- basic -->
          <el-collapse-item name='1'>
            <template slot='title'>
              <span class='collapse-tit'>{{ $t('basic_info') }}</span>
            </template>
            <ul class="edit-ul">
              <li>
                <label style='font-size: 15px;'>
                  <span class="edit-tit">{{ $t('name') }} :</span>
                  <el-input size='small' style='width: 300px;' v-model='basicInfo.name'></el-input>
                </label>
              </li>
              <li>
                <label style='font-size: 15px;'>
                  <span class="edit-tit">{{ $t('description') }} :</span>
                  <el-input size='small' style='width: 300px;' v-model='basicInfo.desc'></el-input>
                </label>
              </li>
              <li>
                <label style='font-size: 15px;'>
                  <span class="edit-tit">{{ $t('type') }} :</span>
                  <span style='color: #444;'>{{defaultBody.type}}</span>
                </label>
              </li>
            </ul>
          </el-collapse-item>
          <!-- app -->
          <el-collapse-item class='app-card' name='2' v-if="defaultBody.type == 'deploy_app'">
            <template slot='title'>
              <span class='collapse-tit'>{{ $t('upper_application') }}</span>
            </template>
            <div class='card-box card-add' @click='appDialog = true'>
              <span class="addicon-wrap"><i class='el-icon-plus'></i></span>
            </div>
            <div class='card-box' v-for='(value, key) in selApp' :key='key'>
              <div class='card-con'>
                <span class="version">{{value.version[0]}}</span>
                <img :src="value.image" width='60px' height='60px'>
                <h4>{{value.name}}</h4>
                <p class="con-wrap" :title="value.description">{{value.description}}</p>
              </div>
              <div class="card-tit">
                <div class="card-del">
                  <span @click="showConfigDialog(value.id, key)"><i class="icon-spinner4"></i> {{$t('arguments')}}</span>
                  <span @click="delApp(key)"><i class="icon-trash"></i> {{ $t('delete') }}</span>
                </div>
              </div>
            </div>
          </el-collapse-item>

          <!-- device -->
          <el-collapse-item name='3'>
            <template slot='title'>
              <span class='collapse-tit'>{{ $t('upper_device') }}</span>
            </template>
            <deviceTable :isEdit='true' :groupId='groupId' :devices='devices'></deviceTable>
          </el-collapse-item>
        </el-collapse>
      </el-col>

      <!-- dialog -->
      <el-dialog :visible.sync='appDialog' :title="$t('add_app')" width="80%">
        <appTable @closeDialog='closeDialog' @getSelectApp='getSelectApp'></appTable>
      </el-dialog>
      <!-- Config Dialog -->
      <el-dialog :visible.sync='configDialog' :title="$t('add_docker_arguments')">
        <appArg @dockerConfig='getDockerConfig' :appId='curAppId'></appArg>
      </el-dialog>
    </el-row>
  </div>
</template>

<script>
  import { taskTemplateInfo, deployGroup, taskCreate, taskTemplateUpdate } from '@/api'
  import deviceTable from './devtable'
  import appTable from './apptable'
  import appArg from './apparg'
  let thisVue = null

  export default {
    components: { deviceTable, appTable, appArg },
    data () {
      return {
        version: '',
        basicInfo: {},
        selApp: [],
        groupId: '',
        defaultBody: {},
        appDialog: false,
        configDialog: false,
        curAppId: null,
        curAppKey: null,
        loading: true,
        devices: [],
        activeNames: ['1', '2', '3'],
        curId: this.$route.params.id
      }
    },
    methods: {
      getInfo () {
        thisVue.loading = true
        taskTemplateInfo(thisVue.curId).then(dat => {
          let res = dat.data
          thisVue.loading = false
          let {name, desc} = res
          thisVue.basicInfo = {name, desc}
          thisVue.defaultBody = res.body
          if (res.body.group_id) {
            thisVue.groupId = res.body.group_id
          }
          if (res.tr && res.body.type === 'deploy_app') {
            thisVue.selApp = res.tr.payload
            res.body.payload.map((value, index) => {
              thisVue.selApp[index].payload = value
            })
          }
          if (res.tr.device_ids) {
            thisVue.devices = res.tr.device_ids
          }
        }).catch(_ => {
          thisVue.loading = false
        })
      },
      getDockerConfig (id, config, version) {
        thisVue.selApp[thisVue.curAppKey].payload = {application_id: id, parameters: JSON.parse(config), version}
        thisVue.closeDialog()
      },
      showConfigDialog (id, key) {
        thisVue.configDialog = true
        thisVue.curAppId = id
        thisVue.curAppKey = key
      },
      deploy () {
        let params = thisVue.defaultBody
        let taskAction = null
        if (params.type === 'deploy_app') {
          params.payload = thisVue.selApp.map(item => {
            return item.payload
          })
        }
        if (thisVue.groupId) {
          taskAction = deployGroup
        } else {
          params = {task: params}
          taskAction = taskCreate
        }
        thisVue.loading = true
        taskAction(params).then(dat => {
          let res = dat.data
          thisVue.loading = false
          if (res.status === 'success') {
            thisVue.$message({type: res.status, message: res.message})
          } else {
            thisVue.$message({type: 'error', message: res.message})
          }
        }).catch(_ => {
          thisVue.loading = false
        })
      },
      save () {
        let params = thisVue.basicInfo
        params.body = thisVue.defaultBody
        if (thisVue.defaultBody.type === 'deploy_app') {
          params.body.payload = thisVue.selApp.map(item => {
            return item.payload
          })
        }
        thisVue.loading = true
        taskTemplateUpdate(thisVue.curId, params).then(dat => {
          let res = dat.data
          thisVue.loading = false
          if (res.status === 'success') {
            thisVue.$message({type: res.status, message: res.message})
          } else {
            thisVue.$message({type: 'error', message: res.message})
          }
        }).catch(_ => {
          thisVue.loading = false
        })
      },
      delApp (index) {
        thisVue.selApp.splice(index, 1)
      },
      getSelectApp (dat) {
        thisVue.closeDialog()
        let exitId = thisVue.selApp.map(item => {
          return item.id
        })
        dat.selApp.map(val => {
          if (exitId.indexOf(val.id) === -1) {
            thisVue.selApp.push(val)
          }
        })
      },
      closeDialog () {
        thisVue.appDialog = false
        thisVue.configDialog = false
      }
    },
    mounted () {
      thisVue = this
      thisVue.getInfo()
    }
  }
</script>

<style scoped>
  .opr-box{padding-bottom: 15px;}
  .el-collapse li{list-style: none;}
  .info-icon{font-size: 10px; color: #7badff;}
  .cell .el-button--mini{width: 100px;}
  .card-box{ overflow:hidden; margin: 0px 5px;width: 240px;float: left;margin-bottom:20px;background-color: #fff;border-radius:10px;}
  .card-add{ height:192px;line-height: 192px; text-align: center; background-color: rgba(255,255,255,0.3);border: 1px dashed #aaa;color: #aaa;cursor: pointer;}
  .card-add .addicon-wrap{font-size: 30px;background-color: #e8e8e8;padding: 22px 25px;border-radius: 50%;}
  .card-tit{padding:0 3px 0 10px;background-color: #90adc5;line-height: 40px;font-size: 14px;position: relative;}
  .card-tit .card-del{ color:#fff;}
  .card-tit .card-del span{ margin-right: 2px;display:inline-block;}
  .card-tit .card-del i{ margin-left: 8px;cursor: pointer;}
  .card-tit .card-del span:hover{ cursor:pointer; color:#245682;}
  .card-con{ position:relative; padding: 20px 20px 0;height: auto;overflow: hidden;text-align: center;}
  .card-con h4{ margin: 8px 0px 0px;font-size: 18px;color: #245682;}
  .card-con img{border-radius: 50%;}
  .card-con p{ overflow: hidden;margin-bottom:18px;height:20px; color:#a2a9af;font-size:14px;line-height: 18px;}
  .card-con .version { position: absolute;right: 0;top: 0;padding: 0px 5px;background: #d5d9dd;color: #fff;border-bottom-left-radius: 12px;}
  .collapse-tit{border-left: 2px solid #245682;padding-left: 10px;}
  .edit-ul{ }
  .edit-ul label{ margin-bottom:16px;}
  .edit-ul .edit-tit{ display:inline-block; width:108px;padding-right:12px;text-align:right;}
</style>
<style>
  .app-card .el-collapse-item__wrap{padding: 20px 16px 0;background-color: #f7f7f7;}
</style>
