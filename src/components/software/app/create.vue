<template>
  <div name="list" class='app-list'>
    <el-row class='list-box' v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading....">
      <div>
        <el-col :span='24'>
          <el-steps :active="active" finish-status="success" simple class="steps-common">
            <el-step :title="$t('create_app')"></el-step>
            <el-step :title="$t('config_app')"></el-step>
            <el-step :title="$t('success')"></el-step>
          </el-steps>
        </el-col>
        <el-col :span='24' class='create-form'>
          <el-form  :model="createAppForm" :rules="createAppRules" ref="createAppForm" label-width="160px" class="demo-ruleForm" size='small' status-icon>

            <!-- step one -->
            <div class="step-three" v-if="active == 1">
              <el-form-item :label="$t('app_name')" prop="name">
                <el-input v-model="createAppForm.name" name="name" size='small'></el-input>
              </el-form-item>
              <el-form-item :label="$t('description')" prop="description">
                <el-input v-model="createAppForm.description"  name="description" size='small'></el-input>
              </el-form-item>
              <el-form-item :label="$t('upload_app_icon')" prop="image">
                <comUpload :uploadParams="{type: 'app', username}" @fileName='getFileName'></comUpload>
              </el-form-item>
            </div>

            <!-- step two -->
            <div class="step-one" v-if="active == 2">
              <div role="alert" class="">
                <div style='padding: 10px 0px;'>
                  <span style='font-weight: bold;'>Docker run -it : </span>
                  <el-tag class="m-5">
                    <span v-if="!createAppForm.registry_id">hub.docker.com</span>
                    <span v-else>
                       <span v-for="item in appDockerMirrorList" v-if="item.id.toString() === createAppForm.registry_id">{{item.name}}</span>
                    </span>
                  </el-tag>
                  <el-tag class="m-5">
                    <span v-if="createAppForm.image_name">{{createAppForm.image_name }}</span>
                    <span v-else>ubutun</span>
                  </el-tag>
                  <span>: </span>
                  <el-tag type="success" class="m-5">
                    <span v-if="createAppForm.version">{{createAppForm.version }}</span>
                    <span v-else>latest</span>
                  </el-tag>
                  <el-tag type="info" class="m-5">
                    <span v-if="createAppForm.commands">{{createAppForm.commands }}</span>
                    <span v-else>/bin/bash -c</span>
                  </el-tag>
                  <el-tag type="warning" class="m-5">
                    <span v-if="createAppForm.args">{{createAppForm.args }}</span>
                    <span v-else>cd /root/flask-facep-reg-v2; python main.py --dev laptop </span>
                  </el-tag>
                </div>
              </div>
              <el-collapse v-model='activeNames'>
                <!-- basic -->
                <el-collapse-item name='1'>
                  <template slot='title'>
                    <span class='collapse-tit'>{{ $t('basic_info') }}</span>
                  </template>
                  <el-form-item style="width:100%" :label="$t('registry')" prop="registry_id">
                    <el-col :span='24'>
                    <el-select v-model="createAppForm.registry_id" filterable>
                      <el-option v-for="item in appDockerMirrorList" :key="item.name" :label="item.name" :value="item.id.toString()">
                      </el-option>
                    </el-select>
                    </el-col>
                  </el-form-item>
                  <el-form-item :label="$t('image')" prop="image_name">
                    <el-col :span='24'><el-input v-model="createAppForm.image_name" name="image_name"></el-input></el-col>
                  </el-form-item>
                  <el-form-item :label="$t('version')" prop="version">
                    <el-col :span='24'>
                    <el-select v-model="createAppForm.version" filterable allow-create>
                      <el-option v-for="item in dockerVersionList" :key="item.name" :label="item.name" :value="item.name">
                      </el-option>
                    </el-select>
                    </el-col>
                  </el-form-item>
                  <el-form-item :label="$t('commands')" prop="commands">
                    <el-col :span='24'><el-input v-model="createAppForm.commands" placeholder="/bin/bash -c"></el-input></el-col>
                  </el-form-item>
                  <el-form-item :label="$t('arguments')" prop="args">
                    <el-col :span='24'><el-input v-model="createAppForm.args" placeholder="cd /root/flask-facep-reg-v2; python main.py --dev laptop "></el-input></el-col>
                  </el-form-item>
                </el-collapse-item>
                <!-- arguments-->
                <el-collapse-item name='2'>
                  <template slot='title'>
                    <span class='collapse-tit'>{{ $t('docker_run_params') }}</span>
                  </template>
                  <el-col :span="24" class="arguments-sty">
                      <el-col :span="17">
                        <el-form-item :label="$t('host_arguments')">
                            <div class="demo-input-suffix" v-for="(port, index) in createAppForm.arguments.ports">
                            <div class="inline-form">
                            <el-input :key="port.key"
                                        :prop="'arguments.ports.' + index + '.hostPort'" :rules="[{ validator: checkHostPort, trigger: 'blur' }]"
                              placeholder="Host port"
                                      type="number"
                                      v-model.number="port.hostPort"
                                      auto-complete="off"></el-input>

                              <el-input :key="port.key"
                                        :prop="'arguments.ports.' + index +'.containerPort'"  :rules="[{ validator: checkContainerPort, trigger: 'blur' }]"
                                placeholder="Container port"
                                        type="number"
                                        v-model.number="port.containerPort"
                                        auto-complete="off"></el-input>
                              <i class="icon-subtract item-add" v-if="index !== 0"@click.prevent="removePort(port)"></i>
                            </div>
                            <i class="icon-plus-circle2 item-add" type="primary" v-if="index === 0" @click="addPort"></i>
                          </div>
                        </el-form-item>
                      </el-col>
                  </el-col>
                    <el-col :span="24" class="arguments-sty">
                      <div class="demo-input-suffix">
                        <el-col :span="17">
                          <el-form-item :label="$t('volume_arguments')">
                            <div  v-for="(volume, index) in createAppForm.arguments.volumes">
                              <div class="inline-form">
                                <el-input :prop="'arguments.volumes.'+index+'.hostPath'"
                                          :rules="[{ validator: checkHostPath, trigger: 'blur' } ]"
                                          placeholder="Host path" v-model="createAppForm.arguments.volumes[index].hostPath" auto-complete="off"></el-input>
                                <el-input :prop="'arguments.volumes.'+index+'.mountPath'" :rules="[{ validator: checkMountPath, trigger: 'blur' }]"
                                          placeholder="Mount path" v-model="createAppForm.arguments.volumes[index].mountPath" auto-complete="off"></el-input>

                                <span class="item-special">
                                  <el-checkbox :prop="'arguments.volumes['+index+'].mountPathReadOnly'"
                                               v-model="createAppForm.arguments.volumes[index].mountPathReadOnly">{{ $t('read_only') }}</el-checkbox>
                                </span>
                                <i class="icon-subtract item-add" v-if="index !== 0"@click.prevent="removeVolumes(index)"></i>
                              </div>
                              <i class="icon-plus-circle2 item-add" type="primary" v-if="index === 0" @click="addVolumes"></i>
                            </div>
                          </el-form-item>
                        </el-col>
                      </div>
                    </el-col>
                  <el-form-item>
                    <div prop="cap_add" class="item-cbx">
                        <el-checkbox v-model="createAppForm.arguments.cap_add">{{ $t('cap_add') }}</el-checkbox>
                    </div>

                    <div prop="host_network" class="item-cbx">
                      <el-checkbox v-model="createAppForm.arguments.host_network">{{ $t('host_network') }}</el-checkbox>
                    </div>
                  </el-form-item>

                </el-collapse-item>
              </el-collapse>
            </div>
            <!-- step three -->
            <div class="step-two" v-if="active == 3">
            </div>


            <el-form-item class='item-button'>
              <el-button size='small' @click="cancel">{{ $t('cancel') }}</el-button>
              <el-button size='small' @click="active--" v-if="active != 1">{{ $t('back') }}</el-button>
              <el-button size='small' type="primary" @click="submitForm('createAppForm')" v-if="active == 2">{{ $t('submit') }}</el-button>
              <el-button size='small' type="primary" @click="next('createAppForm')" v-else>{{ $t('next') }}</el-button>
            </el-form-item>
          </el-form>

        </el-col>
      </div>

    </el-row>
  </div>
</template>

<script>
  import { appDockerConfig, appMirrorsList, applicationCreate, appBinidDocker } from '@/api'
  import comUpload from '../../commonUpload'

  let thisVue = null

  export default {
    components: { comUpload },
    data () {
      var checkHostPort = (rule, value, callback) => {
        let index = parseInt(rule.field.split('.')[2])
        let containerPort = thisVue.createAppForm.arguments.ports[rule.field.split('.')[2]].containerPort
        if (value === '' && containerPort === '' && index === 0) {
          callback()
        } else if (value === '' && containerPort === '' && index > 0) {
          callback(new Error(this.$t('rule_number_check')))
        } else if (value === '' && containerPort) {
          callback(new Error(this.$t('rule_number_check')))
        }
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error(this.$t('rule_number_check')))
          } else {
            callback()
          }
        }, 1000)
      }
      var checkContainerPort = (rule, value, callback) => {
        let index = parseInt(rule.field.split('.')[2])
        let hostPort = thisVue.createAppForm.arguments.ports[rule.field.split('.')[2]].hostPort
        if (value === '' && hostPort === '' && index === 0) {
          callback()
        } else if (value === '' && hostPort === '' && index > 0) {
          callback(new Error(this.$t('rule_number_check')))
        } else if (value === '' && hostPort) {
          callback(new Error(this.$t('rule_number_check')))
        }
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error(this.$t('rule_number_check')))
          } else {
            callback()
          }
        }, 1000)
      }
      var checkHostPath = (rule, value, callback) => {
        let index = parseInt(rule.field.split('.')[2])
        let mountPath = thisVue.createAppForm.arguments.volumes[rule.field.split('.')[2]].mountPath
        if (value === '' && mountPath === '' && index === 0) {
          callback()
        } else if (value === '' && mountPath === '' && index > 0) {
          callback(new Error('repository starts with /your/path'))
        } else if (value === '' && mountPath) {
          callback(new Error('repository starts with /your/path'))
        } else {
          if (value.match(/^((\/)([\w.-]+))+$/)) {
            callback()
          } else {
            callback(new Error('repository starts with /your/path'))
          }
        }
      }
      var checkMountPath = (rule, value, callback) => {
        let index = parseInt(rule.field.split('.')[2])
        let hostPath = thisVue.createAppForm.arguments.volumes[rule.field.split('.')[2]].hostPath
        if (value === '' && hostPath === '' && index === 0) {
          callback()
        } else if (value === '' && hostPath === '' && index > 0) {
          callback(new Error('repository starts with /your/path'))
        } else if (value === '' && hostPath) {
          callback(new Error('repository starts with /your/path'))
        } else {
          if (value.match(/^((\/)([\w.-]+))+$/)) {
            callback()
          } else {
            callback(new Error('repository starts with /your/path'))
          }
        }
      }
      var checkPathName = (rule, value, callback) => {
        if (value === '') {
          callback()
        } else {
          if (value.match(/^[-\w]+$/)) {
            if (value.length < 2) {
              callback(new Error(this.$t('rule_app_name')))
            } else {
              callback()
            }
          } else {
            callback(new Error(this.$t('rule_app_name')))
          }
        }
      }
      let createAppForm = {
        name: '',
        display_name: '',
        description: '',
        image: '',
        registry_id: '',
        application_id: '',
        image_name: '',
        version: 'latest',
        commands: '',
        args: '',
        arguments: {
          host_network: false,
          ports: [{
            containerPort: '',
            hostPort: ''
          }],
          volumes: [{
            hostPath: '',
            mountPathReadOnly: false,
            mountPath: ''
          }],
          cap_add: false
        }
      }
      let createAppRules = {
        name: [
          { required: true, message: this.$t('rule_name_require'), trigger: 'blur' },
          { pattern: /^[-0-9a-z]{2,255}$/, message: this.$t('rule_app_name'), trigger: 'blur' }
        ],
        display_name: [
          { required: true, message: this.$t('rule_name_require'), trigger: 'blur' },
          { pattern: /^[-0-9a-z]{2,255}$/, message: this.$t('rule_app_name'), trigger: 'blur' }
        ],
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
              { required: true, message: this.$t('rule_port_require'), trigger: 'blur' },
              { type: 'number', message: this.$t('rule_number_check') }
            ],
            hostPort: [
              { required: true, message: this.$t('rule_port_require'), trigger: 'blur' },
              { type: 'number', message: this.$t('rule_number_check') }
            ]
          }]
        }
      }
      return {
        tip: true,
        show: false,
        checkHostPort: checkHostPort,
        checkContainerPort: checkContainerPort,
        checkHostPath: checkHostPath,
        checkMountPath: checkMountPath,
        checkPathName: checkPathName,
        activeNames: ['1', '2'],
        noCircle: true,
        params: {
          token: '123456789',
          name: 'avatar'
        },
        headers: {
          smail: '*_~'
        },
        imgDataUrl: '',
        createAppForm: createAppForm,
        createAppRules: createAppRules,
        appDockerMirrorList: [],
        dockerVersionList: [{'id': 1, 'name': 'latest'}],
        signError: false,
        autoUpload: false,
        fileList: [],
        file: '',
        uploadS3DataParam: {},
        s3Url: '',
        loading: true,
        username: '',
        active: 1
      }
    },
    methods: {
      addVolumes () {
        thisVue.createAppForm.arguments.volumes.push({
          hostPath: '',
          mountPathReadOnly: false,
          mountPath: ''
        })
      },
      removeVolumes (item) {
        thisVue.createAppForm.arguments.volumes.splice(item, 1)
      },
      removePort (item) {
        var index = thisVue.createAppForm.arguments.ports.indexOf(item)
        if (index !== -1) {
          thisVue.createAppForm.arguments.ports.splice(index, 1)
        }
      },
      addPort () {
        thisVue.createAppForm.arguments.ports.push({
          containerPort: '',
          hostPort: ''
        })
      },
      convertBase64UrlToBlob (dataURI, type) {
        var binary = atob(dataURI.split(',')[1])
        var array = []
        for (var i = 0; i < binary.length; i++) {
          array.push(binary.charCodeAt(i))
        }
        return new Blob([new Uint8Array(array)], {type: type})
      },
      getFileName (data) {
        thisVue.createAppForm['image'] = data
      },
      submitForm (formName) {
        thisVue.$refs[formName].validate((valid) => {
          if (valid) {
            let dynamicVolumes = []
            for (let i in thisVue.createAppForm.arguments.volumes) {
              dynamicVolumes[i] = {
                mountPathReadOnly: thisVue.createAppForm.arguments.volumes[i].mountPathReadOnly,
                hostPath: thisVue.createAppForm.arguments.volumes[i].hostPath,
                mountPath: thisVue.createAppForm.arguments.volumes[i].mountPath
              }
            }
            let createAppForm = {
              dynamic_commands: thisVue.createAppForm.commands,
              dynamic_args: thisVue.createAppForm.args,
              dynamic_host_network: thisVue.createAppForm.arguments.host_network,
              dynamic_ports: thisVue.createAppForm.arguments.ports,
              dynamic_volumes: dynamicVolumes,
              dynamic_cap_add: thisVue.createAppForm.arguments.cap_add
            }
            let deployObjParams = {parameters: createAppForm}
            appDockerConfig(deployObjParams).then(dat => {
              let res = dat.data
              thisVue.loading = false
              if (res.status === 'fail') {
                thisVue.$message({type: 'error', message: thisVue.$t('create_fail')})
              } else if (res.status === 'success') {
                thisVue.$message({message: thisVue.$t('create_app_success'), type: 'success'})
                thisVue.createApp()
              }
            }).catch(_ => {
              thisVue.loading = false
            })
          }
        })
      },
      next (formName) {
        thisVue.$refs[formName].validate((valid) => {
          if (valid) {
            thisVue.active += 1
          } else {
            return false
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
      createApp () {
        thisVue.loading = true
        let createAppFormData = {'name': thisVue.createAppForm.name, 'display_name': thisVue.createAppForm.display_name, 'description': thisVue.createAppForm.description, 'image': thisVue.createAppForm.image}
        applicationCreate({'application': createAppFormData}).then(dat => {
          let res = dat.data
          thisVue.loading = false
          if (res.status === 'fail') {
            thisVue.$message({type: 'error', message: thisVue.$t('create_fail')})
          } else {
            thisVue.$message({message: thisVue.$t('create_success'), type: 'success'})
            thisVue.createAppForm.application_id = res.app_id
            thisVue.bindDocker()
          }
        }).catch(_ => {
          thisVue.loading = false
        })
      },
      bindDocker () {
        let bindDockerFormData = {'image': {'application_id': thisVue.createAppForm.application_id, 'registry_id': thisVue.createAppForm.registry_id, 'image_name': thisVue.createAppForm.image_name, 'version': thisVue.createAppForm.version, 'commands': thisVue.createAppForm.commands, 'args': thisVue.createAppForm.args}, 'arguments': thisVue.createAppForm.arguments}
        appBinidDocker(thisVue.createAppForm.application_id, bindDockerFormData).then(dat => {
          let res = dat.data
          thisVue.loading = false
          if (res.status === 'fail') {
            thisVue.$message({type: 'error', message: thisVue.$t('bind_docker_fail')})
          } else {
            thisVue.$message({message: thisVue.$t('bind_docker_success'), type: 'success'})
            thisVue.$router.push({name: 'software_app', params: {param: 'my'}})
          }
        }).catch(_ => {
          thisVue.loading = false
        })
      },
      cancel () {
        thisVue.$confirm(thisVue.$t('give_up_tip'), thisVue.$t('cancel'), {
          type: 'warning'
        }).then(() => {
          thisVue.$router.go(-1)
        }).catch(() => {
          return false
        })
      }
    },
    mounted () {
      thisVue = this
      thisVue.getMirrorList()
      thisVue.username = thisVue.$cookie.get('username')
    },
    watch: {
      createAppForm: {
        handler (curCal, oldVal) {
          for (let item in curCal.arguments.ports) {
            if (curCal.arguments.ports[item].containerPort && curCal.arguments.ports[item].hostPort) {
              thisVue.createAppForm.arguments.ports[item].containerPort = curCal.arguments.ports[item].containerPort
              thisVue.createAppForm.arguments.ports[item].hostPort = curCal.arguments.ports[item].hostPort
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
  .el-collapse li{list-style: none;}
  .cell .el-button--mini{width: 100px;}

  .app-list{min-height: 600px;}
  .list-box{background-color: #fff;}
  .list-tit{padding: 20px; font-size: 2rem; border-bottom: 1px solid #ddd;}
  .create-form{padding: 15px 20px;}
  .el-steps{margin-top:1px;background-color: #f5f8fa;}
  .el-select{width: 100%;}
  .item-button{text-align: right;margin-top: 10px;}
  .input-info i{ font-size:16px;}
  .avatar {
    display: block;
    max-width: 100%;
    height: auto;
    margin: 2px auto;
  }
  .el-notification{
    min-width: 500px!important;
  }
  .text-semibold{
    font-size: 12px;
    color: #333;
    text-transform: uppercase;
  }

  .item-add{font-size: 20px; color: #245682; position: absolute; top: 3px; left: 80%;cursor: pointer;}
  .item-add:hover{ color:#5ca3e2;}
  .inline-form{position: relative;margin-bottom: 10px;}
  .inline-form .el-input{display: inline-block;width: 30%;}
  .item-cbx{ float:left;margin-right:30px;}
  .item-add-wrap{ }
  .item-add-wrap .item-add{ }
  .item-special{ margin-left:5px;}
</style>
<style>
  .item-special .el-checkbox__label{padding-left:5px;}
</style>
