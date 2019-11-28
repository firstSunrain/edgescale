<template>
  <div name="list" class='app-list docker-add'>
    <el-row class='list-box' v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading....">
      <el-col :span='24'>
        <div role="alert" v-if="tip" style="z-index: 2022;">
          <div style="padding: 10px 20px 10px 10px;">
            <span>Docker run -it </span>
            <el-tag class="m-5">
              <span v-if="!createAppDockerConfigForm.registry_id">hub.docker.com</span>
              <span v-else><span v-for="item in appDockerMirrorList" v-if="item.id.toString() === createAppDockerConfigForm.registry_id">{{item.name}}</span></span>
            </el-tag>
            <el-tag class="m-5">
              <span v-if="createAppDockerConfigForm.image_name">{{createAppDockerConfigForm.image_name }}</span>
              <span v-else>ubutun</span>
            </el-tag>
            <span>: </span>
            <el-tag type="success" class="m-5">
              <span v-if="createAppDockerConfigForm.version">{{createAppDockerConfigForm.version }}</span>
              <span v-else>latest</span>
            </el-tag>
            <el-tag type="info" class="m-5">
              <span v-if="createAppDockerConfigForm.commands">{{createAppDockerConfigForm.commands }}</span>
              <span v-else>/bin/bash -c</span>
            </el-tag>
            <el-tag type="warning" class="m-5">
              <span v-if="createAppDockerConfigForm.args">{{createAppDockerConfigForm.args }}</span>
              <span v-else>cd /root/flask-facep-reg-v2; python main.py --dev laptop </span>
            </el-tag>
          </div>
        </div>
        <el-form :model="createAppDockerConfigForm" :rules="createAppDockerConfigRules" ref="form" label-width="170px" class="demo-ruleForm" status-icon size='small'>
          <el-collapse v-model='activeNames'>
            <el-collapse-item name='1'>
              <template slot='title'>
                <span class='collapse-tit'>{{ $t('basic_info') }}</span>
              </template>
              <el-form-item :label="$t('registry')" prop="registry_id">
                <el-select v-model="createAppDockerConfigForm.registry_id" filterable>
                  <el-option v-for="item in appDockerMirrorList" :key="item.name" :label="item.name" :value="item.id.toString()">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('image')" prop="image_name">
                <el-input v-model="createAppDockerConfigForm.image_name" name="image_name"></el-input>
              </el-form-item>
              <el-form-item :label="$t('version')" prop="version">
                <el-select v-model="createAppDockerConfigForm.version" filterable allow-create>
                  <el-option v-for="item in dockerVersionList" :key="item.name" :label="item.name" :value="item.name">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('commands')" prop="commands">
                <el-col :span='24'><el-input v-model="createAppDockerConfigForm.commands" placeholder="/bin/bash -c"></el-input></el-col>
              </el-form-item>
              <el-form-item :label="$t('arguments')" prop="args">
                <el-col :span='24'><el-input v-model="createAppDockerConfigForm.args" placeholder="cd /root/flask-facep-reg-v2; python main.py --dev laptop "></el-input></el-col>
              </el-form-item>
            </el-collapse-item>


            <el-collapse-item name='2'>
              <template slot='title'>
                <span class='collapse-tit'>{{ $t('docker_run_params') }}</span>
              </template>
              <el-col :span='24'>
                <el-form-item :label="$t('host_arguments')">
                  <div v-for="(port, index) in createAppDockerConfigForm.arguments.ports" :key='index'>
                    <div class="inline-form">
                      <el-input placeholder="Host port" type="number" v-model.number="port.hostPort" auto-complete="off"></el-input>
                      <el-input placeholder="Container port" type="number" v-model.number="port.containerPort" auto-complete="off"></el-input>
                      <i class="icon-subtract item-add" v-if="index !== 0" @click.prevent="removeItem('port', index)"></i>
                    </div>
                    <i class="icon-plus-circle2 item-add" v-if="index === 0" @click="addItem('port')"></i>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="24" class="arguments-sty">
                <el-form-item :label="$t('volume_arguments')">
                  <div v-for="(volume, index) in createAppDockerConfigForm.arguments.volumes">
                    <div class="inline-form">
                      <el-input placeholder="Host path" v-model="createAppDockerConfigForm.arguments.volumes[index].hostPath" auto-complete="off"></el-input>
                      <el-input placeholder="Mount path" v-model="createAppDockerConfigForm.arguments.volumes[index].mountPath" auto-complete="off"></el-input>
                      <span class="item-special">
                        <el-checkbox v-model="createAppDockerConfigForm.arguments.volumes[index].mountPathReadOnly">{{ $t('read_only') }}</el-checkbox>
                      </span>
                      <i class="icon-subtract item-add" v-if="index !== 0" @click.prevent="removeItem('path', index)"></i>
                    </div>
                    <i class="icon-plus-circle2 item-add" v-if="index === 0" @click="addItem('path')"></i>
                  </div>
                 </el-form-item>
              </el-col>

              <el-col :span='24'>
                <el-form-item :label="$t('env_arguments')">
                  <div v-for="(env, index) in createAppDockerConfigForm.arguments.envs" :key='index'>
                    <div class="inline-form">
                      <el-input placeholder="name" v-model="env.name" auto-complete="off"></el-input>
                      <el-input placeholder="value" v-model="env.value" auto-complete="off"></el-input>
                      <i class="icon-subtract item-add" v-if="index !== 0" @click.prevent="removeItem('env', index)"></i>
                    </div>
                    <i class="icon-plus-circle2 item-add" v-if="index === 0" @click="addItem('env')"></i>
                  </div>
                </el-form-item>
                <el-form-item>
                  <div class='item-cbx' prop="cap_add" >
                    <el-checkbox v-model="createAppDockerConfigForm.arguments.cap_add">{{ $t('cap_add') }}</el-checkbox>
                  </div>
                  <div class='item-cbx' prop="host_network" >
                    <el-checkbox v-model="createAppDockerConfigForm.arguments.host_network">{{ $t('host_network') }}</el-checkbox>
                  </div>
                </el-form-item>
                <el-form-item style='text-align: right;'>
                  <el-button size='small' @click="cancel">{{ $t('cancel') }}</el-button>
                  <el-button size='small' type="primary" @click="submitForm('form')">{{ $t('submit') }}</el-button>
                </el-form-item>
              </el-col>
            </el-collapse-item>
          </el-collapse>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { appDockerConfig, appMirrorsList, appBinidDocker } from '@/api'

  let thisVue = null

  export default {
    data () {
      let createAppDockerConfigForm = {
        registry_id: '',
        application_id: this.$route.params.appId,
        image_name: '',
        version: '',
        commands: '',
        args: '',
        arguments: {
          host_network: false,
          ports: [{
            containerPort: '',
            hostPort: ''
          }],
          envs: [{
            name: '',
            value: ''
          }],
          volumes: [{
            mountPathReadOnly: false,
            hostPath: '',
            mountPath: ''
          }],
          cap_add: false
        }
      }
      let createAppDockerConfigRules = {
        registry_id: [
          { required: true, message: this.$t('rule_register_require'), trigger: 'change' }
        ],
        image_name: [
          { required: true, message: this.$t('rule_image_require'), trigger: 'blur' }
        ],
        version: [
          { required: true, message: this.$t('rule_version_require'), trigger: 'change' }
        ],
        arguments: {
          ports: [{
            containerPort: [
              { required: true, message: 'Please enter the container port', trigger: 'blur' },
              { type: 'number', message: 'Container port must be number' }
            ],
            hostPort: [
              { required: true, message: 'Please enter the host port', trigger: 'blur' },
              { type: 'number', message: 'Host port must be number' }
            ]
          }]
        }
      }
      return {
        tip: true,
        app_name: this.$route.params.appId,
        activeNames: ['1', '2'],
        createAppDockerConfigForm: createAppDockerConfigForm,
        createAppDockerConfigRules: createAppDockerConfigRules,
        appDockerMirrorList: [],
        dockerVersionList: [ {'id': 1, 'name': 'latest'} ],
        loading: true
      }
    },
    methods: {
      addItem (type) {
        if (type === 'port') {
          thisVue.createAppDockerConfigForm.arguments.ports.push({ containerPort: '', hostPort: '' })
        } else if (type === 'path') {
          thisVue.createAppDockerConfigForm.arguments.volumes.push({ mountPathReadOnly: false, hostPath: '', mountPath: '' })
        } else {
          thisVue.createAppDockerConfigForm.arguments.envs.push({ name: '', value: '' })
        }
      },
      removeItem (type, value) {
        if (type === 'port') {
          thisVue.createAppDockerConfigForm.arguments.ports.splice(value, 1)
        } else if (type === 'path') {
          thisVue.createAppDockerConfigForm.arguments.volumes.splice(value, 1)
        } else {
          thisVue.createAppDockerConfigForm.arguments.envs.splice(value, 1)
        }
      },
      submitForm (form) {
        thisVue.$refs[form].validate((valid) => {
          if (valid) {
            thisVue.loading = true
            let dynamicVolumes = []
            for (let i in thisVue.createAppDockerConfigForm.arguments.volumes) {
              dynamicVolumes[i] = {
                mountPathReadOnly: thisVue.createAppDockerConfigForm.arguments.volumes[i].mountPathReadOnly,
                hostPath: thisVue.createAppDockerConfigForm.arguments.volumes[i].hostPath,
                mountPath: thisVue.createAppDockerConfigForm.arguments.volumes[i].mountPath
              }
            }
            let createAppForm = {
              dynamic_commands: thisVue.createAppDockerConfigForm.commands,
              dynamic_args: thisVue.createAppDockerConfigForm.args,
              dynamic_host_network: thisVue.createAppDockerConfigForm.arguments.host_network,
              dynamic_ports: thisVue.createAppDockerConfigForm.arguments.ports,
              dynamic_env: thisVue.createAppDockerConfigForm.arguments.envs,
              dynamic_volumes: dynamicVolumes,
              dynamic_cap_add: thisVue.createAppDockerConfigForm.arguments.cap_add
            }
            let deployObjParams = {parameters: createAppForm}
            appDockerConfig(deployObjParams).then(dat => {
              let res = dat.data
              thisVue.loading = false
              if (res.status === 'fail') {
                thisVue.$message({type: 'error', message: thisVue.$t('create_fail')})
              } else if (res.status === 'success') {
                thisVue.$message({message: thisVue.$t('create_app_success'), type: 'success'})
                thisVue.bindDocker()
              }
            }).catch(_ => {
              thisVue.loading = false
            })
          }
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
      bindDocker () {
        let bindDockerName = thisVue.createAppDockerConfigForm
        let bindDockerFormData = {'image': {'application_id': bindDockerName.application_id, 'registry_id': bindDockerName.registry_id, 'image_name': bindDockerName.image_name, 'version': bindDockerName.version, 'commands': bindDockerName.commands, 'args': bindDockerName.args}, 'arguments': bindDockerName.arguments}
        appBinidDocker(bindDockerName.application_id, bindDockerFormData).then(dat => {
          let res = dat.data
          thisVue.loading = false
          if (res.status === 'fail') {
            thisVue.$message({type: 'error', message: thisVue.$t('bind_docker_fail')})
          } else {
            thisVue.$message({message: thisVue.$t('bind_docker_success'), type: 'success'})
            thisVue.$router.push({name: 'software_app_detail', params: { appId: bindDockerName.application_id }})
          }
        }).catch(_ => {
          thisVue.loading = false
        })
      },
      cancel () {
        thisVue.$confirm(thisVue.$t('give_up_tip'), thisVue.$t('cancel'), {type: 'warning'}).then(() => {
          thisVue.$router.go(-1)
        }).catch(() => {
          return false
        })
      }
    },
    mounted () {
      thisVue = this
      thisVue.getMirrorList()
    },
    watch: {
      createAppDockerConfigForm: {
        handler (curCal, oldVal) {
          for (let itemList in curCal.images) {
            let formImagesItem = curCal.images[itemList]
            for (let item in formImagesItem.arguments.ports) {
              if (formImagesItem.arguments.ports[item].containerPort && formImagesItem.arguments.ports[item].hostPort) {
                thisVue.createAppDockerConfigForm.images[itemList].arguments.ports[item].containerPort = formImagesItem.arguments.ports[item].containerPort
                thisVue.createAppDockerConfigForm.images[itemList].arguments.ports[item].hostPort = formImagesItem.arguments.ports[item].hostPort
              }
            }
          }
        },
        deep: true
      }
    }
  }
</script>

<style scoped>

  .opr-box{padding: 15px 20px;background-color: #fcfcfc;}
  .el-collapse{padding: 0px 20px;}
  .el-collapse li{list-style: none;}
  .cell .el-button--mini{width: 100px;}

  .app-list{min-height: 600px;}
  .list-box{background-color: #fff; border: 1px solid #ddd;padding: 20px;}
  .list-tit{padding: 15px 20px; font-size: 2rem; border-bottom: 1px solid #ddd;}
  .create-form{padding: 15px 20px;}
  .el-steps{height: 70px;background-color: #fcfcfc;}
  .el-select{width: 100%;}
  .item-button{float: right;display: inline-block;}
  .item-button .common-btn{font-size: 24px;cursor: pointer;vertical-align: middle}
  .inline-item{display: inline-block;}
  .input-info{padding-left: 10px;font-size: 2rem;color: #409EFF;}
  .el-steps{
    padding-left: 20px;
    padding-right: 20px;
    background: #fff;
  }
  .el-steps{
    padding-top: 20px;
    padding-bottom: 20px;
  }
  .input-info{padding-left: 10px;font-size: 2rem;color: #409EFF;}
  .avatar {
    display: block;
    max-width: 100%;
    height: auto;
    margin: 2px auto;
  }
  .text-semibold{
    font-size: 12px;
    color: #333;
    text-transform: uppercase;
    border-top: 1px solid #f1f1f1;
    padding-top: 10px;
  }
  .inline-form{position: relative;margin-bottom: 10px;}
  .inline-form .el-input{display: inline-block;width: 30%;}
  .item-cbx{ float:left;margin-right:30px;}
  .item-add{font-size: 20px; color: #245682; position: absolute; top: 3px; left: 80%;cursor: pointer;}
  .item-add:hover{ color:#5ca3e2;}
  .item-special{ margin-left:5px;}
</style>
<style>
  .docker-add .el-tabs__header{display: none !important;}
  .item-special .el-checkbox__label{padding-left:5px;}
</style>
