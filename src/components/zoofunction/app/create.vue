<template>
  <div name="list" class='app-list'>
    <el-row class='list-box' v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading....">
      <el-col :span='24'>
        <div>
          <el-steps :active='active' simple finish-status="success">
            <el-step title='Parameter configuration'></el-step>
            <el-step title='Create base'></el-step>
            <!-- <el-step title='Deploy APP' icon='icon-checkmark'></el-step> -->
          </el-steps>
        </div>
      </el-col>
      <el-col :span='24' class='create-form'>
        <el-form ref='form' size='small' :model='form' :rules='rules' label-width='200px'>
          <div class='step-box' v-if="active == 1">
            <el-col :span="24">
            <el-form-item prop='name' label='Name'>
              <el-input v-model='form.name' size='small' placeholder='please input model name'></el-input>
            </el-form-item>
            <el-form-item prop='distro' label='Distro'>
              <el-select v-model='form.distro' placeholder='select distro' size='small' @change="isFreeRTOS($event)">
                <el-option v-for="(item,index) in distroList" :key='index' :value="index" :label='item.name'></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop='description' :label="$t('description')">
              <el-input v-model='form.description' size='small' placeholder='please input model description'></el-input>
            </el-form-item>
            <el-form-item prop='model' label='Model'>
              <el-select v-model='form.model' placeholder='select Model' size='small'>
                <el-option v-for="(item,index) in modelList" :key='index' :value="index" :label='item.name'></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop='training' label='ML Framework'>
              <el-select v-model='form.training' placeholder='select Engine' size='small'>
                <el-option v-for="(item,index) in trainingList" :key='index' :value="index" :label='item.name'></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop='device' label='Platform'>
              <el-select v-model='form.device' placeholder='select platform' size='small'>
                <el-option v-for="(item,index) in deviceList" :key='index' :value="index" :label='item.name'></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop='code_url' label='Code Url'>
              <el-radio-group v-model="codeUrl" @change="changeCode">
                <el-radio-button label="1">Github</el-radio-button>
                <el-radio-button label="2">Zipfile</el-radio-button>
              </el-radio-group>
              <el-input v-if="codeUrl == 1" size='small' v-model='codeUrl1' placeholder='please input gitHub address'></el-input>
              <comUpload v-else :uploadParams="{type: 'eiq', username}" @fileState='getFileState' @fileUrl='getFileUrl'></comUpload>
            </el-form-item>
            <el-form-item v-if="false" label='Change code'>
              <myTree :data="theData" :name="menuName" :loading="loading" @getSubMenu="getSubMenu"></myTree>
            </el-form-item>
            </el-col>
          </div>
          <el-col :span="24">
          <!-- <div class='step-box' v-if='active == 2'>
            <el-form-item prop='description' label='Code'>
              <el-input v-model='form.description' type='textarea' size='small' placeholder='please input code'></el-input>
            </el-form-item>
          </div> -->
          </el-col>
          <div class="step-box" v-if='active == 2'>
            <el-col :span='24'>
              <el-col :span="24">
              <el-collapse class="active-name-1" v-model='activeNames'>
                <el-collapse-item name='1'>
                  <template slot='title'>
                    <span class='collapse-tit'>BASIC INFORMATION</span>
                  </template>
                <ul class='setting-ul'>
                <li>
                  <label style='font-size: 15px;'>
                    <i class='icon-diamond4 info-icon'></i>
                    <span style='padding: 0px 6px;font-weight: bold;'>Name:</span>
                    <span style='color: #444;'>{{form.name}}</span>
                  </label>
                </li>
                <li>
                  <label style='font-size: 15px;'>
                    <i class='icon-diamond4 info-icon'></i>
                    <span style='padding: 0px 6px;font-weight: bold;'>Description:</span>
                    <span style='color: #444;'>{{form.description}}</span>
                  </label>
                </li>
                <li>
                  <label style='font-size: 15px;'>
                    <i class='icon-diamond4 info-icon'></i>
                    <span style='padding: 0px 6px;font-weight: bold;'>Model:</span>
                    <span style='color: #444;'>{{modelList[form.model].name}}</span>
                  </label>
                </li>
                <li>
                  <label style='font-size: 15px;'>
                    <i class='icon-diamond4 info-icon'></i>
                    <span style='padding: 0px 6px;font-weight: bold;'>ML Framework:</span>
                    <span style='color: #444;'>{{trainingList[form.training].name}}</span>
                  </label>
                </li>
                <li>
                  <label style='font-size: 15px;'>
                    <i class='icon-diamond4 info-icon'></i>
                    <span style='padding: 0px 6px;font-weight: bold;'>Platform:</span>
                    <span style='color: #444;'>{{deviceList[form.device].name}}</span>
                  </label>
                </li>
                <li v-if="form.distro !== null">
                  <label style='font-size: 15px;'>
                    <i class='icon-diamond4 info-icon'></i>
                    <span style='padding: 0px 6px;font-weight: bold;'>Distro:</span>
                    <span style='color: #444;'>{{distroList[form.distro].name}}</span>
                  </label>
                </li>
                <li v-if="form.code_url !== null">
                  <label style='font-size: 15px;'>
                    <i class='icon-diamond4 info-icon'></i>
                    <span style='padding: 0px 6px;font-weight: bold;'>Code Url:</span>
                    <span style='color: #444;'>{{form.code_url}}</span>
                  </label>
                </li>
              </ul>
              </el-collapse-item>
            </el-collapse>
              <el-form-item v-if='active == 2'>
                <div class="step-action-create" v-if="baseOK === false && trainStart === false">
                  <div class="pt15"></div>
                  <el-button style="margin-left:22px" size='small' @click="active--" v-if="active != 1">
                    &lt; back</el-button>
                  <el-button size='small' type="primary" @click="submitForm('form')">Create base &gt;
                  </el-button>
                </div>
              </el-form-item>
              </el-col>
            </el-col>
            <el-dialog width="80%" top="10vh" title="Training Statistics" :visible.sync="dialogTableVisible">
              <iframe :src="trainingRes.t_stats_url"></iframe>
            </el-dialog>
          </div>
          <el-col :span="24">
          <el-form-item class='item-button' v-if='active != 2'>
            <el-button class="fl" size='small' @click="active--" v-if="active != 1">&lt; Back</el-button>
            <template v-if='active < 2'>
              <el-button class="fr" size='small' :disabled="fileState" :type="fileState ? 'info' : 'primary'" @click="next('form')">Next &gt;</el-button>
            </template>
            <template v-else>
              <el-button class="fr" size='small' type="primary" @click="submitForm('form')">Create &gt;</el-button>
            </template>
          </el-form-item>
          </el-col>
          <el-col class="training-container" :span='24' v-if='trainStart'>
            <el-collapse class="active-name-2" v-model='activeNames'>
              <el-collapse-item name='2'>
                <template slot='title'>
                  <span class='collapse-tit'>BUILDER INFORMATION</span>
                </template>
                <div class="box status-container">
                  <!-- <el-button class="train-sta" :disabled="trainOK ? false : true" size="small" @click="dialogTableVisible = true">Builder Statistics</el-button> -->
                  <!-- <el-button class="train-down" size="small" :disabled="trainOK ? false : true" @click="download('https://eiq-cloud.s3.amazonaws.com/'+trainingRes.t_full_log_url)" type="primary">Download Full Log</el-button> -->
                  <div v-if="trainStart && trainOK == false">
                    <div class="fl tip">In packing, please do not refresh the page!</div>
                  </div>
                </div>
                <el-tabs class="tab-container" type="border-card">
                  <el-tab-pane label="Builder log" v-html="trainingRes.t_cur_log_url"></el-tab-pane>
                </el-tabs>
              </el-collapse-item>
            </el-collapse>
          </el-col>
          <div v-if="baseOK && trainOK">
            <div class="pt15"></div>
            <template>
              <el-radio v-model="radio" label="1" style="margin-left:22px">Need to change the base docker and add your own code? just download it first</el-radio>
              <el-radio v-model="radio" label="2">Directly deploy the base docker just generated?</el-radio>
            </template>
            <!-- <el-button class="fl" style="margin-left:22px" size='small' type="primary" @click="$router.push({name: 'zoo_app_list'})">No deployment
            </el-button> -->
            <div v-if="radio == 1" class="pt15" style="margin-left:45px">
              <div class="fl">You can click here to download, edit and upload.</div>
              <el-button class="fl" style="margin-left:20px" size='small' type="primary" @click="$router.push({name: 'zoo_app_list'})">back list</el-button>
            </div>
            <div v-else class="pt15" style="margin-left:25px">
              <el-button size='small' style="margin-left:20px" type="primary" @click="isRT ? $router.push({name: 'software_solution_deploy_select_devices', params: {id: newSo}}) : $router.push({name: 'software_app_deploy_device_list', query: {name: newApp.name, applicaion_id: newApp.id}})">deploy</el-button>
            </div>
          </div>
        </el-form>
      </el-col>
    </el-row>


  </div>
</template>

<script>
  import comUpload from '../commonUpload'
  // import comUpload from '../minioUpload'
  import { eiqList, eiqDetail } from '@/api/api'
  import { appDockerConfig, applicationCreate, appBinidDocker, solutionCreate, solutionTagAdd } from '@/api'
  import Cookie from '../../../../static/js/cookie.js'
  import myTree from './treeMenu.vue'

  let thisVue = null
  const myData = [
    {
      id: '1',
      menuName: '基础管理',
      type: 1,
      menuCode: '10'
    },
    {
      id: '2',
      menuName: '商品管理',
      type: 1,
      menuCode: ''
    },
    {
      id: '3',
      menuName: '订单管理',
      menuCode: '30',
      type: 1,
      children: [
        {
          menuName: '订单列表',
          type: 1,
          menuCode: '31'
        },
        {
          menuName: '退货列表',
          menuCode: '32',
          type: 1,
          children: []
        }
      ]
    },
    {
      id: '4',
      type: 1,
      menuName: '商家管理',
      menuCode: '',
      children: [{
        menuName: '商家管理11',
        parentId: '4',
        type: 1,
        children: [
          {
            menuName: '商品一',
            path: '../../../../static/img/assets/text.txt',
            type: 2,
            menuCode: '41',
            children: []
          }
        ]
      }]
    }
  ]

  const subMenuData1 = {
    parentId: '1',
    type: 1,
    children: [
      {
        menuName: '用户管理',
        type: 1,
        menuCode: '11'
      },
      {
        id: '12',
        menuName: '角色管理',
        type: 1,
        menuCode: '12',
        children: [
          {
            menuName: '管理员',
            type: 1,
            menuCode: '121'
          },
          {
            menuName: 'CEO',
            type: 1,
            menuCode: '122'
          },
          {
            menuName: 'CFO',
            type: 1,
            menuCode: '123'
          },
          {
            menuName: 'COO',
            type: 1,
            menuCode: '124'
          },
          {
            menuName: '普通人',
            type: 1,
            menuCode: '124'
          }
        ]
      },
      {
        menuName: '权限管理',
        type: 1,
        menuCode: '13'
      }
    ]
  }

  const subMenuData2 = {
    parentId: '2',
    type: 1,
    children: [
      {
        menuName: '商品一',
        type: 1,
        menuCode: '21'
      },
      {
        id: '22',
        menuName: '商品二',
        type: 1,
        menuCode: '22',
        children: [
          {
            menuName: '子类商品1AAAAAAAAAAAAA',
            menuCode: '221',
            type: 2,
            path: 'https://eiq-cloud.s3.amazonaws.com/lili5454/git-info.txt'
          },
          {
            menuName: '子类商品2',
            menuCode: '222',
            type: 1
          }
        ]
      }
    ]
  }

  export default {
    components: { comUpload, myTree },
    data () {
      let createSolutionForm = {
        solution: '',
        model_id: 385,
        version: 1903,
        is_default: false,
        tagsAttr: [],
        sourceUploadMethod: '2',
        is_signed: false,
        image: '',
        have_installer: false,
        url: ''
      }
      return {
        theData: myData,
        menuName: 'menuName',
        loading: false,
        form: {
          model: null,
          name: '',
          description: '',
          training: null,
          device: null,
          distro: 1,
          code_url: null
        },
        deviceList: '',
        distroList: '',
        modelList: '',
        trainingList: '',
        active: 1,
        rules: {
          name: [{required: true, trigger: 'blur', message: 'customer name is required'}, {min: 2, max: 60, message: 'Names should not exceed 60 words', trigger: 'blur'}],
          model: [{required: true, trigger: 'change', message: 'select Model is required'}],
          training: [{required: true, trigger: 'change', message: 'select Engine is required'}],
          code_url: [
            {required: true, trigger: 'blur', message: 'code url is required'},
            {pattern: /^(https:\/\/github.com\/)([\w.-]+)\/([\w.-]+)$/, message: "repository starts with 'https://github.com/Owner/Repo'", trigger: 'blur'}
          ],
          distro: [{required: true, trigger: 'change', message: 'select distro is required'}],
          device: [{required: true, trigger: 'change', message: 'select Device is required'}]
        },
        page: {
          size: 10,
          total: 0,
          number: 1
        },
        params: {
          id: '',
          offset: '',
          limit: '',
          search: '',
          type: '',
          is_training: false,
          attribute: ''
        },
        trainStart: false,
        trainOK: false,
        trainingRes: {
          t_cur_log_url: '',
          t_full_log_url: '',
          t_progress: 0,
          t_stats_url: null
        },
        dialogTableVisible: false,
        noAttribute: false,
        noTraining: false,
        noModel: false,
        isFace: false,
        selectLevel: 0,
        activeNames: ['1', '2'],
        baseOK: false,
        newApp: {
          id: null,
          name: null
        },
        newSo: '',
        radio: '1',
        codeUrl: '1',
        S3: [
          {required: true, trigger: 'blur', message: 'Upload code is required'}
        ],
        gitHub: [
          {required: true, trigger: 'blur', message: 'code url is required'},
          { pattern: /^(https:\/\/github.com\/)([\w.-]+)\/([\w.-]+)$/, message: "repository starts with 'https://github.com/Owner/Repo'", trigger: 'blur' }
        ],
        codeUrl1: '',
        codeUrl2: '',
        fileState: false,
        deviceListOne: [],
        deviceListTwo: [],
        isRT: false,
        createSolutionForm: createSolutionForm
      }
    },
    created () {
      // 页面刚进入时开启长连接
      this.initWebSocket()
    },
    destroyed: function () {
      // 页面销毁时关闭长连接
      this.$websocket.close()
      this.websocketclose()
    },
    methods: {
      createSolutionTagById (solutioTag) {
        solutionTagAdd(solutioTag).then(dat => {
          let res = dat.data
          console.log(res)
          thisVue.loading = false
          if (res && res.status === 'success') {
            thisVue.$message({message: thisVue.$t('add_tag_success'), type: 'success'})
            thisVue.baseOK = true
          } else {
            thisVue.$message({type: 'error', message: thisVue.$t('operation_fail')})
          }
        }).catch(_ => {
          thisVue.loading = false
          return false
        })
      },
      createSolution (id) {
        thisVue.loading = true
        thisVue.createSolutionForm.solution = thisVue.form.name
        thisVue.createSolutionForm.url = 'https://s3-us-west-2.amazonaws.com/' + id + '.bin'
        console.log(thisVue.createSolutionForm)
        solutionCreate(thisVue.createSolutionForm).then(dat => {
          let res = dat.data
          console.log(res)
          thisVue.loading = false
          if (res && res.status === 'success') {
            let tagsAttr = thisVue.createSolutionForm.tagsAttr
            let solutionTagObj = {'solution_id': res.id, 'tag_name': tagsAttr}
            thisVue.newSo = res.id
            thisVue.$message({message: thisVue.$t('create_solution_success'), type: 'success'})
            thisVue.createSolutionTagById(solutionTagObj)
          } else {
            thisVue.$message({type: 'error', message: thisVue.$t('operation_fail')})
          }
        }).catch(_ => {
          thisVue.loading = false
          return false
        })
      },
      createEDApp () {
        let deployObjParams = {
          'parameters': {
            'dynamic_commands': '',
            'dynamic_args': '',
            'dynamic_host_network': false,
            'dynamic_ports': [{
              'containerPort': '',
              'hostPort': ''
            }],
            'dynamic_volumes': [{
              'mountPathReadOnly': false,
              'hostPath': '',
              'mountPath': ''
            }],
            'dynamic_cap_add': false
          }
        }
        console.log(deployObjParams)
        appDockerConfig(deployObjParams).then(dat => {
          let res = dat.data
          thisVue.loading = false
          if (res.status === 'fail') {
            thisVue.$notify.error({
              title: 'Error',
              message: res.message
            })
          } else if (res.status === 'success') {
            thisVue.$notify({
              title: 'Success ',
              message: res.message,
              type: 'success'
            })
            // thisVue.createAppFormSubmitTimeOut()
            thisVue.createApp()
          }
        }).catch(_ => {
          thisVue.loading = false
        })
      },
      createEdgeApp () {
        thisVue.createEDApp()
      },
      createApp () {
        let createAppFormData = {
          'application': {
            'name': thisVue.form.name,
            'display_name': '',
            'description': '',
            'image': ''
          }
        }
        console.log(JSON.stringify(createAppFormData))
        applicationCreate(createAppFormData).then(dat => {
          let res = dat.data
          thisVue.loading = false
          if (res.status === 'fail') {
            thisVue.$notify.error({
              title: 'Error',
              message: res.message
            })
          } else {
            thisVue.$notify({
              title: 'Success ',
              message: res.message,
              type: 'success'
            })
            thisVue.form.id = res.app_id
            thisVue.Create(res.app_id)
          }
        }).catch(_ => {
          thisVue.loading = false
        })
      },
      bindDocker (docker, dockerCmd) {
        let version = docker.split(':')
        console.log(dockerCmd)
        dockerCmd = JSON.parse(dockerCmd)
        console.log(dockerCmd)
        let bindDockerFormData = {
          'image': {
            'application_id': thisVue.form.id,
            'registry_id': '5',
            'image_name': version[0],
            'version': version[1],
            'commands': dockerCmd.commands,
            'args': dockerCmd.args
          },
          'arguments': {
            'host_network': dockerCmd.host_network,
            'ports': [{
              'containerPort': '',
              'hostPort': ''
            }],
            'volumes': [{
              'hostPath': '',
              'mountPathReadOnly': false,
              'mountPath': ''
            }],
            'cap_add': true
          }
        }
        console.log(JSON.stringify(bindDockerFormData))
        appBinidDocker(thisVue.form.id, bindDockerFormData).then(dat => {
          let res = dat.data
          thisVue.loading = false
          if (res.status === 'fail') {
            thisVue.$notify.error({
              title: 'Error',
              message: res.message
            })
          } else {
            thisVue.$notify.success({
              title: 'success',
              message: 'Base docker Creation Successful!'
            })
            thisVue.baseOK = true
          }
        }).catch(_ => {
          thisVue.loading = false
        })
      },
      getSubMenu (menuItem, callback) {
        thisVue.loading = true
        console.log(menuItem)
        console.log(callback)
        if (menuItem.type === 2) {
          alert(1111111)
        }
        if (menuItem.id === subMenuData1.parentId) {
          thisVue.loading = false
          menuItem.children = subMenuData1.children
          callback(menuItem.children)
        }
        setTimeout(() => {
          if (menuItem.id === subMenuData2.parentId) {
            thisVue.loading = false
            menuItem.children = subMenuData2.children
            callback(menuItem.children)
          }
        }, 2000)
      },
      submitForm (formName) {
        thisVue.$refs[formName].validate((valid) => {
          if (valid) {
            thisVue.trainStart = true
            thisVue.createEdgeApp()
          } else {
            return false
          }
        })
      },
      getModel () {
        eiqList('get', 'model', {}).then(json => {
          // console.log(json.data.results)
          thisVue.modelList = json.data.results
          eiqList('get', 'pre_trained_model', {}).then(json => {
            // console.log(json.data.results)
            json.data.results.forEach(function (value) {
              thisVue.modelList.push(value)
            })
            // console.log(thisVue.modelList)
          }).catch(_ => {
            return false
          })
        }).catch(_ => {
          return false
        })
      },
      getDevice () {
        eiqList('get', 'device', {}).then(json => {
          console.log(json.data.results)
          thisVue.deviceList = json.data.results
          // thisVue.deviceListOne.push(json.data.results[2])
          // thisVue.deviceListOne.push(json.data.results[3])
          // thisVue.deviceListOne.push(json.data.results[4])
          // thisVue.deviceListTwo.push(json.data.results[0])
          // thisVue.deviceListTwo.push(json.data.results[1])
          // thisVue.deviceList = thisVue.deviceListOne
        }).catch(_ => {
          return false
        })
      },
      getDistro () {
        eiqList('get', 'distro', {}).then(json => {
          // console.log(json.data.results)
          thisVue.distroList = json.data.results
        }).catch(_ => {
          return false
        })
      },
      getFileUrl (data) {
        thisVue.codeUrl2 = data
      },
      getFileState (data) {
        console.log(data)
        thisVue.fileState = data
      },
      Create (id) {
        let params = {
          id: id,
          name: thisVue.form.name,
          model: thisVue.modelList[thisVue.form.model].id,
          engine: thisVue.trainingList[thisVue.form.training].id,
          device: thisVue.deviceList[thisVue.form.device].id,
          code_url: thisVue.form.code_url
        }
        if (thisVue.form.distro !== null) {
          params.distro = thisVue.distroList[thisVue.form.distro].id
        }
        console.log(params)
        eiqDetail('post', 'app', params).then(json => {
          // console.log(json.data)
          thisVue.newApp.id = json.data.id
          thisVue.newApp.name = json.data.name
          thisVue.$notify.info({
            title: 'warning',
            message: 'APP Creation Successful, Packing in progress...'
          })
          thisVue.websocketsend(json.data.id)
        }).catch(_ => {
          return false
        })
      },
      initWebSocket () {
        const wsuri = 'wss://eiqcloud.edgescale.org:443'
        this.$websocket = new WebSocket(wsuri)
        this.$websocket.onopen = this.websocketonopen
        this.$websocket.onerror = this.websocketonerror
        this.$websocket.onmessage = this.websocketonmessage
        this.$websocket.onclose = this.websocketclose
      },
      websocketonopen () {
        console.log('WebSocket连接成功')
      },
      websocketonerror (e) {
        console.log('WebSocket连接发生错误')
      },
      websocketonmessage (e) {
        console.log('服务器端发送消息：')
        console.log(e)
        try {
          let data = JSON.parse(e.data)
          if (data.cmd === 'PACKAGE_SUCCESS') {   // 成功
            eiqDetail('get', 'app', {id: thisVue.newApp.id}).then(json => {
              // console.log(json.data)
              let docker = ''
              if (json.data.depolyed_docker_url === null) {
                docker = json.data.base_docker_url
              } else {
                docker = json.data.depolyed_docker_url
              }
              if (thisVue.isRT) {
                thisVue.createSolution(json.data.id)
              } else {
                thisVue.bindDocker(docker, json.data.docker_cmd)
              }
            }).catch(_ => {
              return false
            })
            thisVue.trainOK = true
          } else if (data.cmd === 'PACKAGE_STATUS') {  // 开始
            let datalog = data.msg.replace(new RegExp('\\n', 'gm'), '<br/>')
            datalog = datalog.replace(new RegExp('\\r', 'gm'), '<br/>')
            thisVue.trainingRes.t_cur_log_url += datalog
            document.documentElement.scrollTop = document.body.scrollHeight
          } else if (data.cmd === 'PACKAGE_RECONNECT') {  // 进行中
            thisVue.trainStart = true
            let datalog = data.msg.replace(new RegExp('\\n', 'gm'), '<br/>')
            datalog = datalog.replace(new RegExp('\\r', 'gm'), '<br/>')
            thisVue.trainingRes.t_cur_log_url += datalog
            document.documentElement.scrollTop = document.body.scrollHeight
          } else {
            let msg = ''
            if (data.msg === '') {
              msg = 'Sorry, please try again.'
            } else {
              msg = data.msg
            }
            thisVue.$alert(msg, 'Builder failed: ')
          }
        } catch (e) {
          console.log(e)
        }
        return e.data
      },
      websocketsend (id) {
        // 数据发送
        var that = this
        var webJson = {
          'cmd': 'PACKAGE_START',
          'app_id': id
        }
        // console.log(webJson)
        if (that.$websocket.readyState === 1) {
          that.$websocket.send(JSON.stringify(webJson))
        }
      },
      websocketclose (e) {
        if (e) {
          if (e.code !== 25214) {
            thisVue.$notify.error({
              title: 'error',
              message: 'connection closed (' + e.code + ')'
            })
          }
          console.log('connection closed (' + e.code + ')')
        } else {
          console.log('connection closed (Reconnect)')
        }
      },
      redioFun () {
        console.log(thisVue.radio)
      },
      close () {
        console.log('关闭')
        this.$websocket.close()
        this.websocketclose()
      },
      changeCode () {
        if (thisVue.codeUrl === '1') {
          thisVue.form.code_url = thisVue.codeUrl1
          thisVue.rules.code_url = thisVue.gitHub
        } else {
          thisVue.form.code_url = thisVue.codeUrl2
          thisVue.rules.code_url = thisVue.S3
        }
        console.log(thisVue.form.code_url)
      },
      getTraEngine () {
        thisVue.loading = true
        // thisVue.selectLevel = 3
        thisVue.params.is_inference_engine = true
        eiqList('get', 'engine', thisVue.params).then(json => {
          console.log(json.data.results)
          if (json.data.results.length === 0) {
            thisVue.noTraining = true
            thisVue.form.trainingID = null
          } else {
            thisVue.noTraining = false
            thisVue.trainingList = json.data.results
            // thisVue.trainingList.push(json.data.results[0])
          }
          // console.log(thisVue.trainingList)
          thisVue.loading = false
        }).catch(_ => {
          thisVue.loading = false
          return false
        })
      },
      isFreeRTOS (e) {
        console.log(thisVue.distroList[e])
        if (thisVue.distroList[e].name === 'FreeRTOS') {
          thisVue.isRT = true
          // thisVue.deviceList = thisVue.deviceListTwo
        } else {
          thisVue.isRT = false
          // thisVue.deviceList = thisVue.deviceListOne
        }
      },
      next (formName) {
        if (thisVue.codeUrl === '1') {
          thisVue.form.code_url = thisVue.codeUrl1
          thisVue.rules.code_url = thisVue.gitHub
        } else {
          thisVue.form.code_url = thisVue.codeUrl2
          thisVue.rules.code_url = thisVue.S3
        }
        console.log(thisVue.form.code_url)
        thisVue.$refs[formName].validate((valid) => {
          if (valid) {
            thisVue.active += 1
          } else {
            return false
          }
        })
      }
    },
    mounted () {
      thisVue = this
      this.$nextTick(function () {
        let pageHeaderData = {
          'homeRouterName': 'home',
          'firstTitle': 'APP',
          'firstRouterName': 'zoo_app_list',
          'secondTitle': 'Create'
        }
        // Common.setPageHeaderData(thisVue, pageHeaderData)
        // thisVue.getSolution()
        thisVue.$store.dispatch('setPageHeaderData', pageHeaderData)
        thisVue.username = Cookie.getCookie('username')
        thisVue.getTraEngine()
        thisVue.getModel()
        thisVue.getDevice()
        thisVue.getDistro()
      })
    }
  }
</script>

<style scoped>
  .fl{ float:left;}
  .fr{ float:right;}
  .mr10{ margin-right:10px;}
  .pt15{ padding-top:15px;}
  .app-list{min-height: 600px;}
  .list-box{background-color: #fff; border: 1px solid #e4ebf0;}
  .list-tit{padding: 15px 20px; font-size: 2rem; border-bottom: 1px solid #ddd;}
  .create-form{padding: 30px 20px 10px;    float: none;
    overflow: hidden;}
  .el-steps{margin:1px 0 0;background-color: #f5f8fa;}
  .el-select{width: 100%;}
  .input-info{padding-left: 10px;font-size: 2rem;color: #409EFF;}
  .setting-ul li{list-style:none;}
  .setting-ul .info-icon{ font-size: 10px; color: #7badff;}
  .setting-ul .item-tit{     font-weight: bold;
    width: 100px;
    display: inline-block;
    text-align: left;}
  .show-pro{float: left;margin-right: 20px;}
  .opr-btn{float: left;}
  iframe{width: 100%; height: 63vh; overflow: auto;}
  .step-action-create{ margin-left:-139px;text-align:right;}
  .status-container{ margin-left:-94px;}
  .status-container .tip{ color: #f68873;
    font-size: 12px;
    position: absolute;
    top: 14px;
    left: 173px;}
  .training-container{ padding:0;margin-top: -29px;position: relative;}
  .training-container .box{ margin-bottom:15px;overflow: hidden;}
  .el-progress{ display:inline-block; width:165px;margin-top:5px;}
  .tab-container{ clear: both;}
  .training-container .train-sta,.training-container .train-down,.training-container .progress-container{ float: left;margin-right: 10px;border-radius: 3px;overflow: hidden;}
  .collapse-tit{border-left: 2px solid #0072ea;padding-left: 10px;}
</style>
<style>
  .radiogroup-container .el-radio-button__inner{ width:73px;}
  .training-container .el-progress-bar__outer{ height:20px !important;border-radius:50px;}
  .training-container .el-tabs--border-card>.el-tabs__content{ min-height: 300px;}
  .active-name-1 .el-collapse, .el-collapse-item__header, .el-collapse-item__wrap{ border-bottom:0;}
  .active-name-1 .el-collapse-item:last-child{ margin-bottom:0;}
  .active-name-1 .el-collapse,.active-name-2 .el-collapse{ padding:0;}
</style>
