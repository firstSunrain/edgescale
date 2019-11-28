<template>
  <div name="app_deploy_list" style='background-color: #fff;' v-loading='loadingDeploy' element-loading-spinner='el-icon-loading' element-loading-text='loading...'>
    <div class="com-box">
      <div class='com-tit'><b>{{$route.query.name}}</b></div>
      <devTable @getSelDev='getSelDev'>
        <div slot='other' style='float: right;'>
          <el-select class="common-input" size='small' v-model="appVersionNumber" :rules="appVersionNumberRules" style="display: inline-block">
            <el-option v-for="item in appVersionNumberObj" :key="item" :label="item" :value="item"></el-option>
          </el-select>
          <span style="color: #fa5555;" v-if="showErrorMessage">{{ showErrorMessage }}</span>
          <el-button size='small' class="common-btn together-btn" @click="showDialog"><i class="icon-spinner4"></i> {{ $t('more_arguments') }}</el-button>
          <el-button size='small' class="common-btn together-btn" :disabled='DeployCheckedDeviceAry.length == 0' @click="DeployAppSubmit"><i class="iconfont icon-deployment"></i> {{ $t('deploy') }}</el-button>
        </div>
      </devTable>
    </div>

    <el-dialog :title="$t('add_docker_arguments')" :visible.sync='isArgsDialog' width='50%'>
      <el-form  :model="createAppForm" ref="createAppForm" label-width="170px" class="demo-ruleForm" size='small' status-icon>
        <!-- arguments-->
        <el-form-item :label="$t('commands')" prop="dynamic_commands">
          <el-col :span='23'><el-input v-model="createAppForm.dynamic_commands" placeholder="/bin/bash -c"></el-input></el-col>
        </el-form-item>
        <el-form-item :label="$t('arguments')" prop="dynamic_args">
          <el-col :span='23'><el-input v-model="createAppForm.dynamic_args" placeholder="cd /root/flask-facep-reg-v2; python main.py --dev laptop "></el-input></el-col>
        </el-form-item>

        <el-row>
          <el-col>
            <el-form-item :label="`${$t('host_arguments')}`">
              <div v-for="(port, index) in createAppForm.dynamic_ports">
                <div class="inline-form">
                  <el-input :key="port.key" :prop="'dynamic_ports.'+index+'.hostPort'"  placeholder="Host port" type="number" v-model.number="port.hostPort" auto-complete="off"></el-input>
                  <el-input :key="port.key" :prop="'dynamic_ports.'+index+'.containerPort'" placeholder="Container port" type="number" v-model.number="port.containerPort" auto-complete="off"></el-input>
                  <span class="item-button">
                    <i class="icon-subtract item-add" v-if="index !== 0" @click.prevent="removeItem('port', index)"></i>
                    <i class="icon-plus-circle2 item-add" v-if="index === 0" @click="addItem('port')"></i>
                  </span>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col>
            <el-form-item :label="$t('volume_arguments')">
              <div v-for="(volume, index) in createAppForm.dynamic_volumes">
                <div class="inline-form">
                  <el-input :prop="'dynamic_volumes.'+index+'.hostPath'" placeholder="Host path" v-model="createAppForm.dynamic_volumes[index].hostPath" auto-complete="off"></el-input>
                  <el-input :prop="'dynamic_volumes.'+index+'.mountPath'" placeholder="Mount path" v-model="createAppForm.dynamic_volumes[index].mountPath" auto-complete="off"></el-input>
                  <span class="item-special">
                    <el-checkbox :prop="'dynamic_volumes['+index+'].mountPathReadOnly'" v-model="createAppForm.dynamic_volumes[index].mountPathReadOnly">{{ $t('read_only') }}</el-checkbox>
                  </span>
                  <span class="item-button">
                    <i class="icon-subtract item-add" v-if="index !== 0" @click.prevent="removeItem('path', index)"></i>
                    <i class="icon-plus-circle2 item-add" v-if="index === 0" @click="addItem('path')"></i>
                  </span>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col>
            <el-form-item :label="$t('env_arguments')">
              <div v-for="(value, index) in createAppForm.dynamic_env">
                <div class="inline-form">
                  <el-input v-model="value.name" auto-complete="off"></el-input>
                  <el-input v-model="value.value" auto-complete="off"></el-input>
                  <span class="item-button">
                    <i class="icon-subtract item-add" v-if="index !== 0" @click.prevent="removeItem('env', index)"></i>
                    <i class="icon-plus-circle2 item-add" v-if="index === 0" @click="addItem('env')"></i>
                  </span>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
            <el-checkbox v-model="createAppForm.dynamic_cap_add" prop="dynamic_cap_add">{{ $t('cap_add') }}</el-checkbox>
            <el-checkbox v-model="createAppForm.dynamic_host_network" prop="dynamic_host_network">{{ $t('host_network') }}</el-checkbox>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button size='small' @click="cancle('createAppForm')">{{ $t('cancel') }}</el-button>
      <el-button size='small' type="primary" @click="changeDockerArguments('createAppForm')">{{ $t('save') }}</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
  import { appDockerConfig, taskCreate, appVersionList } from '@/api'
  import devTable from '../devtable'

  let thisVue = null
  export default {
    components: {devTable},
    data () {
      return {
        isArgsDialog: false,
        disabled: [false],
        createAppForm: {
          dynamic_commands: '',
          dynamic_args: '',
          dynamic_host_network: false,
          dynamic_ports: [{
            containerPort: '',
            hostPort: ''
          }],
          dynamic_env: [{ name: '', value: '' }],
          dynamic_volumes: [{
            mountPathReadOnly: false,
            hostPath: '',
            mountPath: ''
          }],
          dynamic_cap_add: false
        },
        loadingDeploy: false,
        DeployCheckedDeviceAry: [],
        showErrorMessage: null,
        appVersionNumber: null,
        appVersionNumberObj: [],
        appVersionNumberRules: [
          {required: true, message: this.$t('rule_version_require'), trigger: 'change'}
        ]
      }
    },
    watch: {
      createAppForm: {
        handler (curCal, oldVal) {
          for (let item in curCal.dynamic_ports) {
            if (curCal.dynamic_ports[item].containerPort && curCal.dynamic_ports[item].hostPort) {
              thisVue.createAppForm.dynamic_ports[item].containerPort = curCal.dynamic_ports[item].containerPort
              thisVue.createAppForm.dynamic_ports[item].hostPort = curCal.dynamic_ports[item].hostPort
            }
          }
          for (let item in curCal.dynamic_volumes) {
            if (curCal.dynamic_volumes[item].name) {
              thisVue.createAppForm.dynamic_volumeMounts[item].name = curCal.dynamic_volumes[item].name
              thisVue.disabled[item] = true
            }
          }
        },
        deep: true
      }
    },
    methods: {
      addItem (type) {
        if (type === 'port') {
          thisVue.createAppForm.dynamic_ports.push({ containerPort: '', hostPort: '' })
        } else if (type === 'path') {
          thisVue.createAppForm.dynamic_volumes.push({ mountPathReadOnly: false, hostPath: '', mountPath: '' })
          thisVue.disabled.push(false)
        } else {
          thisVue.createAppForm.dynamic_env.push({ name: '', value: '' })
        }
      },
      removeItem (type, value) {
        if (type === 'port') {
          thisVue.createAppForm.dynamic_ports.splice(value, 1)
        } else if (type === 'path') {
          thisVue.createAppForm.dynamic_volumes.splice(value, 1)
          thisVue.disabled.splice(value, 1)
        } else {
          thisVue.createAppForm.dynamic_env.splice(value, 1)
        }
      },
      showDialog () {
        thisVue.isArgsDialog = true
      },
      cancle (formName) {
        thisVue.$refs[formName].resetFields()
        thisVue.isArgsDialog = false
      },
      changeDockerArguments (formName) {
        thisVue.$refs[formName].validate((valid) => {
          if (valid) {
            let deployObjParams = {parameters: thisVue.createAppForm}
            appDockerConfig(deployObjParams).then(dat => {
              let res = dat.data
              thisVue.loading = false
              if (res.status === 'fail') {
                thisVue.$message({type: 'error', message: thisVue.$t('save_app_config_fail')})
              } else if (res.status === 'success') {
                thisVue.$message({message: thisVue.$t('save_app_config_success'), type: 'success'})
                thisVue.isArgsDialog = false
              }
            }).catch(_ => {
              thisVue.loading = false
            })
          }
        })
      },
      DeployAppSubmit () {
        if (thisVue.DeployCheckedDeviceAry.length === 0) {
          thisVue.$message.error(thisVue.$t('sel_dev_tip'))
          return false
        }
        thisVue.loadingDeploy = true
        let deploy = {}
        let appVersionNumber = thisVue.appVersionNumber
        if (appVersionNumber === null) {
          thisVue.showErrorMessage = thisVue.$t('sel_version_tip')
        } else {
          thisVue.showErrorMessage = null
          deploy['version'] = appVersionNumber
          deploy['application_id'] = thisVue.$route.query.applicaion_id
          deploy['parameters'] = thisVue.createAppForm
          let deployObjParams = {
            task: {
              'device_ids': thisVue.DeployCheckedDeviceAry,
              'type': 'deploy_app',
              'payload': [deploy]
            }
          }
          taskCreate(deployObjParams).then(dat => {
            let res = dat.data
            thisVue.loadingDeploy = false
            if (res.status === 'fail') {
              thisVue.$message({type: 'error', message: thisVue.$t('create_task_fail')})
            } else if (res.status === 'success') {
              thisVue.$message({message: thisVue.$t('create_task_success'), type: 'success'})
              thisVue.$router.push({name: 'task_detail', params: { taskId: res.task.id }})
            }
          }).catch(_ => {
            thisVue.loadingDeploy = false
          })
        }
      },
      getAppVersionNumberObj () {
        let applicaionId = thisVue.$route.query.applicaion_id
        appVersionList(applicaionId).then(dat => {
          let res = dat.data
          if (res) {
            thisVue.appVersionNumberObj = res.versions
            thisVue.appVersionNumber = res.versions[0]
          }
        }).catch(_ => {
          return false
        })
      },
      getSelDev (val) {
        thisVue.DeployCheckedDeviceAry = []
        thisVue.DeployCheckedDeviceAry = val.map(item => {
          return item.id
        })
      }
    },
    mounted: function () {
      thisVue = this
      thisVue.getAppVersionNumberObj()
    }
  }
</script>
<style scoped>
  .com-box{padding: 20px;}
  .item-button .item-add{ font-size: 20px; color: #245682; position: absolute; top: 3px; left: 80%;cursor: pointer;}
  .inline-form{position: relative;margin-bottom: 10px;}
  .inline-form .el-input{display: inline-block;width: 30%;}
  .item-special{ margin-left:5px;}
</style>
<style>
  .item-special .el-checkbox__label{padding-left:5px;}
</style>
