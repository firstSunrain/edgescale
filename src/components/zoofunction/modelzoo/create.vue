<template>
  <div name="list" class='app-list'>
    <el-row class='list-box' v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading....">
      <el-col :span='24'>
        <div>
          <el-steps class="steps-common" finish-status="process" :active='active-1' simple>
            <el-step title='Select Pre-trained Model' icon='icon-envelop'></el-step>
            <el-step title='Choose Dataset' icon='icon-lock'></el-step>
            <el-step title='Train Model' icon='icon-checkmark'></el-step>
          </el-steps>
        </div>
      </el-col>

      <el-col :span='24' class='create-form'>
        <el-form ref='form' size='small' :model='form' :rules='rules' label-width='200px'>
          <!-- step Two -->
          <div class='step-box' v-if="active == 1">
            <el-col :span="14">
            <el-form-item prop='name' label='Name'>
              <el-input v-model='form.name' size='small' placeholder='please input model name'></el-input>
            </el-form-item>
            <el-form-item prop='description' label='Description'>
              <el-input v-model='form.description' type='textarea' size='small' placeholder='please input description'></el-input>
            </el-form-item>
            <el-form-item prop='training_step' label='TrainStep'>
              <el-input v-model='form.training_step' size='small' placeholder='please input TrainStep'></el-input>
            </el-form-item>
            <el-form-item prop='solution' label='Solution'>
              <el-select v-model='form.solution' placeholder='select solution' size='small' @change="getAttribute($event)">
                <el-option v-for="(item,index) in solutionList" :key='index' :value="index" :label='item.name'></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop='attribute' label='Architecture' v-if='noAttribute == false'>
              <el-select v-model='form.attribute' placeholder='select attribute' size='small' @change="getPreModel($event)">
                <el-option v-for="(item,index) in attributeList" :key='index' :value="index" :label='item'></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop='attribute' label='Architecture' v-if='noAttribute'>
              <div>The 'Solution' is not 'attribute'. Please re-select it.</div>
            </el-form-item>
            <el-form-item prop='model' label='Pre-trained Model' v-if='noModel == false'>
              <el-select v-model='form.model' placeholder='select Pre-trained Model' size='small'>
                <el-option v-for="(item,index) in modelList" :key='index' :value="index" :label='item.name'></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop='model' label='Pre-trained Model' v-if='noModel'>
              <div>The 'Architecture' is not 'Pre-trained Model'. Please re-select it.</div>
            </el-form-item>
            <el-form-item prop='training' label='ML Framework' v-if='noTraining == false'>
              <el-select v-model='form.training' placeholder='select ML Framework' size='small'>
                <el-option v-for="(item,index) in trainingList" :key='index' :value="index" :label='item.name'></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop='training' label='ML Framework' v-if='noTraining'>
              <router-link :to="{name: 'zoo_engine_list'}">No engine, try creating it.</router-link>
            </el-form-item>
            <!-- <el-form-item label='Train Now'>
              <el-switch v-model="form.isTrain" :disabled='isFace ? true : false' active-text="" inactive-text="" @change="isTrainFun($event)"></el-switch>
            </el-form-item> -->
            </el-col>
          </div>
          <!-- step Three -->
          <el-col :span="14">
          <div class='step-box' v-if='active == 2'>
            <el-form-item prop='dataset' label='dataset'>
              <el-select v-model='form.dataset' placeholder='select dataset' size='small'>
                <el-option v-for="(item,index) in datasetList" :key='index' :value="index" :label='item.name'></el-option>
              </el-select>
              <router-link :to="{name: 'zoo_data_create'}">No dataset you want? Go to upload</router-link>
            </el-form-item>
          </div>
          </el-col>
          <!-- step Four -->
          <div class="step-box" v-if='active == 3'>
            <el-col :span='24'>
              <!--<el-table :data='formTB' border size='small'>-->
                <!--<el-table-column prop="name" label='Name'></el-table-column>-->
                <!--<el-table-column prop="description" label='Description'></el-table-column>-->
                <!--<el-table-column label='Solution'>-->
                  <!--<template slot-scope='scope'>-->
                    <!--<div>{{solutionList[scope.row.solution].name}}</div>-->
                  <!--</template>-->
                <!--</el-table-column>-->
                <!--<el-table-column label='Attribute'>-->
                  <!--<template slot-scope='scope'>-->
                    <!--<div>{{attributeList[scope.row.attribute]}}</div>-->
                  <!--</template>-->
                <!--</el-table-column>-->
                <!--<el-table-column label='Model'>-->
                  <!--<template slot-scope='scope'>-->
                    <!--<div>{{modelList[scope.row.model].name}}</div>-->
                  <!--</template>-->
                <!--</el-table-column>-->
                <!--<el-table-column label='Training'>-->
                  <!--<template slot-scope='scope'>-->
                    <!--<div>{{trainingList[scope.row.training].name}}</div>-->
                  <!--</template>-->
                <!--</el-table-column>-->
                <!--<el-table-column label='Dataset'>-->
                  <!--<template slot-scope='scope'>-->
                    <!--<div>{{datasetList[scope.row.dataset].name}}</div>-->
                  <!--</template>-->
                <!--</el-table-column>-->
              <!--</el-table>-->

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
                    <span style='padding: 0px 6px;font-weight: bold;'>TrainStep:</span>
                    <span style='color: #444;'>{{form.training_step}}</span>
                  </label>
                </li>
                <li>
                  <label style='font-size: 15px;'>
                    <i class='icon-diamond4 info-icon'></i>
                    <span style='padding: 0px 6px;font-weight: bold;'>Solution:</span>
                    <span style='color: #444;'>{{solutionList[form.solution].name}}</span>
                  </label>
                </li>
                <li>
                  <label style='font-size: 15px;'>
                    <i class='icon-diamond4 info-icon'></i>
                    <span style='padding: 0px 6px;font-weight: bold;'>Attribute:</span>
                    <span style='color: #444;'>{{attributeList[form.attribute]}}</span>
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
                    <span style='padding: 0px 6px;font-weight: bold;'>Training:</span>
                    <span style='color: #444;'>{{trainingList[form.training].name}}</span>
                  </label>
                </li>
                <li>
                  <label style='font-size: 15px;'>
                    <i class='icon-diamond4 info-icon'></i>
                    <span style='padding: 0px 6px;font-weight: bold;'>Dataset:</span>
                    <span style='color: #444;'>{{datasetList[form.dataset].name}}</span>
                  </label>
                </li>
              </ul>
                </el-collapse-item>
              </el-collapse>

              <el-form-item v-if='active == 3'>
                <div v-if="trainStart && trainOK == false">
                  <!--<el-button type='info' :loading="true" size="small">IN Progress</el-button>-->
                </div>
                <!--<div v-if="trainStart && trainOK">-->
                  <!--<el-button type="success" size="small" @click="$router.push({name: 'zoo_detail', params: {id: params.id}})">Training completed! Go look</el-button>-->
                <!--</div>-->
                <div class="create-and-train" v-if="trainStart == false && trainOK == false">
                  <div class="pt15"></div>
                  <el-button class="fl" style="margin-left:22px" size='small' @click="active--" v-if="active != 1">
                    <!--<i class='icon-arrow-left13'></i>-->
                    &lt; back</el-button>
                  <el-button class="fl" size='small' type="primary" @click="submitForm('form', 'All')">Create and Train &gt;
                    <!--<i class='icon-arrow-right14'></i>-->
                  </el-button>
                </div>
              </el-form-item>
              </el-col>
            </el-col>
            <!--<el-col :span='6' v-if='trainStart' style="padding-left: 85px; padding-top: 45px;">-->
              <!--&lt;!&ndash;<div class="show-pro"><el-progress type='circle' :percentage="trainingRes.t_progress"></el-progress></div>&ndash;&gt;-->
              <!--<div>Progress</div><el-progress :text-inside="true" :stroke-width="18" :percentage="trainingRes.t_progress"></el-progress>-->
            <!--</el-col>-->
            <el-dialog width="80%" top="10vh" title="Training Statistics" :visible.sync="dialogTableVisible">
              <iframe :src="trainingRes.t_stats_url"></iframe>
            </el-dialog>
          </div>
          <!-- step Five -->
          <!--<el-form-item class='item-button' v-if='active != 3'>-->
            <!--<el-button class="fr" size='small' @click="cancel">cancel</el-button>-->
            <!--<el-button class="fl" size='small' @click="active&#45;&#45;" v-if="active != 1">-->
              <!--&lt;!&ndash;<i class='icon-arrow-left13'></i>&ndash;&gt;-->
              <!--backddd-->
            <!--</el-button>-->
            <!--<template v-if='form.isTrain'>-->
              <!--&lt;!&ndash; <el-button size='small' type="primary" @click="submitForm('form', 'All')" v-if="active == 2">Create  <i class='icon-arrow-right14'></i></el-button> &ndash;&gt;-->
              <!--<el-button class="fr" size='small mr10' type="primary" @click="next('form')" v-if='active <= 2'>next-->
                <!--&lt;!&ndash;<i class='icon-arrow-right14'></i>&ndash;&gt;-->
              <!--</el-button>-->
            <!--</template>-->
            <!--<template v-else>-->
              <!--<el-button size='small' type="primary" @click="submitForm('form', 'Part')">Create</el-button>-->
            <!--</template>-->
          <!--</el-form-item>-->

          <el-col :span="14">
          <el-form-item class='item-button' v-if='active != 3'>
            <div class="line-form pt15"></div>
            <el-button class="fl" size='small' @click="active--" v-if="active != 1">&lt; Back</el-button>
            <template v-if='form.isTrain'>
              <el-button class="fr" size='small' type="primary" @click="next('form')" v-if='active <= 2'>Next &gt;</el-button>
            </template>
            <template v-else>
              <el-button class="fr" size='small' type="primary" @click="submitForm('form', 'Part')">Create &gt;</el-button>
            </template>
            <!--<el-button class="fr mr10" size='small' @click="cancel">Cancel</el-button>-->
          </el-form-item>
          </el-col>
          <el-col class="training-container" :span='24' v-if='trainStart'>
            <el-collapse class="active-name-2" v-model='activeNames'>
              <el-collapse-item name='2'>
                <template slot='title'>
                  <span class='collapse-tit'>Training INFORMATION</span>
                </template>
                <div class="box">
                  <el-button class="train-sta" :disabled="trainOK ? false : true" size="small" @click="dialogTableVisible = true">Training Statistics</el-button>
                  <el-button class="train-down" size="small" :disabled="trainOK ? false : true" @click="download('https://eiq-cloud.s3.amazonaws.com/'+trainingRes.t_full_log_url)" type="primary">Download Full Log</el-button>
                  <div class="status-container" v-if="trainStart && trainOK == false">
                    <div v-if="state === 'queue'">
                      <span class="fl" style="line-height: 32px; margin-right: 10px">In the queue, There are <span style="color: red">{{ trainingRes.q_progress }}</span> models currently being trained, Please wait...</span>
                    </div>
                    <div v-else-if="state === 'ready'">
                      <el-button class="fl" style="width:400px; margin-right: 10px" type='info' :loading="true" size="small">Ready for training, please wait a moment...</el-button>
                    </div>
                    <div v-else-if="state === 'pack'">
                      <el-button class="fl" style="width:400px; margin-right: 10px" type='info' :loading="true" size="small">Packing in progress, please wait a moment...</el-button>
                    </div>
                    <div v-else>
                      <span class="fl" style="line-height: 32px; margin-right: 10px">Training progress: </span><el-progress class="progress-container" :text-inside="true" :stroke-width="18" :percentage="trainingRes.t_progress"></el-progress>
                    </div>
                    <el-button class="train-down" size="small" type="danger" @click="stopTrain">Stop training</el-button>
                    <div class="fr" style="color:red; font-size: 15px;">In training, please do not refresh the page!</div>
                  </div>
                  <div v-if="trainStart && trainOK">
                    <el-button type="success" size="small" @click="download('https://eiq-cloud.s3.amazonaws.com/'+trainingRes.model_url)">Training completed! To download</el-button>
                  </div>
                </div>
                <el-tabs class="tab-container" type="border-card">
                  <el-tab-pane label="Training log" v-html="trainingRes.t_cur_log_url"></el-tab-pane>
                </el-tabs>
              </el-collapse-item>
            </el-collapse>
          </el-col>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { eiqList, eiqDetail } from '@/api/api'

  let thisVue = null

  export default {
    data () {
      return {
        loading: false,
        form: {
          name: '',
          description: '',
          training_step: 4000,
          solution: null,
          attribute: null,
          model: null,
          dataset: null,
          training: null,
          isTrain: true
        },
        formTB: [],
        solutionList: '',
        attributeList: '',
        modelList: '',
        trainingList: '',
        datasetList: '',
        active: 1,
        rules: {
          name: [{required: true, trigger: 'blur', message: 'customer name is required'}, { min: 2, max: 60, message: 'Names should not exceed 60 words', trigger: 'blur' }],
          training_step: [{type: 'number', required: true, trigger: 'blur', message: 'training step must be a number', transform (value) { return Number(value) }}],
          solution: [{required: true, trigger: 'change', message: 'select solution is required'}],
          model: [{required: true, trigger: 'change', message: 'select Pre-trained Model is required'}],
          attribute: [{required: true, trigger: 'change', message: 'select attribute is required'}],
          training: [{required: true, trigger: 'change', message: 'select ML Framework is required'}],
          dataset: [{required: true, trigger: 'change', message: 'select dataset is required'}]
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
          attribute: ''
        },
        trainingRes: {
          t_cur_log_url: '',
          t_full_log_url: '',
          q_progress: 0,
          t_progress: 0,
          t_stats_url: null,
          model_url: ''
        },
        trainStart: false,
        trainOK: false,
        dialogTableVisible: false,
        noAttribute: true,
        noTraining: false,
        noModel: true,
        isFace: false,
        selectLevel: 0,
        activeNames: ['1', '2'],
        state: 'ready',
        inter: null
      }
    },
    created () {
      // 页面刚进入时开启长连接
      this.initWebSocket()
    },
    destroyed: function () {
      // 页面销毁时关闭长连接
      // this.websocketclose()
      console.log('关闭')
      this.$websocket.close()
      this.websocketclose()
      clearInterval(thisVue.inter)
    },
    methods: {
      submitForm (formName, type) {
        thisVue.$refs[formName].validate((valid) => {
          if (valid) {
            let params = {
              name: thisVue.form.name,
              description: thisVue.form.description,
              type: thisVue.solutionList[thisVue.form.solution].id,
              base_model: thisVue.modelList[thisVue.form.model].id,
              attribute: thisVue.attributeList[thisVue.form.attribute],
              engine: thisVue.trainingList[thisVue.form.training].id,
              training_step: thisVue.form.training_step
            }
            if (type === 'All') {
              params.dataset = thisVue.datasetList[thisVue.form.dataset].id
              // thisVue.initWebSocket()
              thisVue.trainStart = true
              thisVue.Create(params, 'All')
            } else {
              thisVue.Create(params, 'Part')
            }
          } else {
            return false
          }
        })
      },
      Create (params, type) {
        console.log(params)
        eiqDetail('post', 'model_zoo', params).then(json => {
          // console.log(json.data)
          if (json.data.status === 2) {
            thisVue.params.id = json.data.id
            if (type === 'Part') {
              thisVue.$notify.success({
                title: 'success',
                message: 'Model Creation Successful!'
              })
              thisVue.$router.push({name: 'zoo_list'})
            } else {
              thisVue.$notify.info({
                title: 'warning',
                message: 'Model creation is success and training begins!'
              })
              thisVue.websocketsend(json.data.id)
            }
          } else if (json.data.status === 0 || json.data.status === 1) {
            thisVue.params.id = json.data.id
          } else {
            thisVue.$notify.error({
              title: 'error',
              message: 'Error occurred. Please try again.'
            })
          }
        }).catch(_ => {
          return false
        })
      },
      getSolution () {
        thisVue.loading = true
        eiqList('get', 'solution', thisVue.params).then(json => {
          json.data.results.splice(1, 1)
          thisVue.solutionList = json.data.results
          // console.log(thisVue.solutionList)
          thisVue.loading = false
        }).catch(_ => {
          thisVue.loading = false
          return false
        })
      },
      getAttribute (e) {
        thisVue.loading = true
        thisVue.selectLevel = 1
        thisVue.form.attribute = null
        thisVue.noModel = true
        thisVue.params.attribute = ''
        thisVue.params.type = thisVue.solutionList[e].id
        // console.log(thisVue.params)
        eiqList('get', 'pre_trained_model', thisVue.params).then(json => {
          // console.log(json.data.results)
          thisVue.form.isTrain = true
          let attributeList = []
          json.data.results.forEach((item) => {
            if (item.attribute === '' || item.attribute === null) {
              return false
            } else {
              attributeList.push(item.attribute)
            }
          })
          attributeList = Array.from(new Set(attributeList))
          thisVue.attributeList = attributeList
          thisVue.loading = false
          // console.log(thisVue.attributeList)
          if (thisVue.attributeList.length === 0) {
            thisVue.noAttribute = true
          } else {
            thisVue.noAttribute = false
          }
        }).catch(_ => {
          thisVue.loading = false
          return false
        })
      },
      getPreModel (e) {
        thisVue.loading = true
        thisVue.selectLevel = 2
        thisVue.form.model = null
        thisVue.params.attribute = thisVue.attributeList[e]
        // console.log(thisVue.params)
        eiqList('get', 'pre_trained_model', thisVue.params).then(json => {
          // console.log(json.data.results)
          thisVue.modelList = json.data.results
          if (thisVue.modelList.length === 0) {
            thisVue.noModel = true
          } else {
            thisVue.noModel = false
          }
          thisVue.loading = false
        }).catch(_ => {
          thisVue.loading = false
          return false
        })
        thisVue.getDataset()
      },
      download (url) {
        thisVue.$confirm('Do you want to download', 'Download Item', {type: 'info'}).then(_ => {
          window.open(url, '_self')
        }).catch(_ => {
          return false
        })
      },
      getTraEngine () {
        thisVue.loading = true
        thisVue.selectLevel = 3
        eiqList('get', 'engine', thisVue.params).then(json => {
          // console.log(json.data.results)
          if (json.data.results.length === 0) {
            thisVue.noTraining = true
          } else {
            thisVue.noTraining = false
            thisVue.trainingList = json.data.results
            // thisVue.trainingList.push(json.data.results[1])
          }
          thisVue.loading = false
        }).catch(_ => {
          thisVue.loading = false
          return false
        })
      },
      getDataset () {
        eiqList('get', 'dataset', thisVue.params).then(json => {
          thisVue.datasetList = json.data.results
        }).catch(_ => {
          return false
        })
      },
      next (formName) {
        thisVue.$refs[formName].validate((valid) => {
          if (valid) {
            thisVue.active += 1
            if (thisVue.active === 3) {
              if (thisVue.formTB.length === 0) {
                thisVue.formTB.push(thisVue.form)
              } else {
                thisVue.formTB[0] = thisVue.form
              }
            }
            // console.log(thisVue.formTB)
          } else {
            return false
          }
        })
      },
      // isTrainFun (e) {
      //   if (e) {
      //     thisVue.rules.dataset[0].required = true
      //   } else {
      //     thisVue.rules.dataset[0].required = false
      //   }
      // },
      initWebSocket () {
        // const wsuri = 'ws://10.193.20.190:443'
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
        console.log(e.data)
        try {
          let data = JSON.parse(e.data)
          if (data.cmd === 'TRAIN_STATUS') {   // 开始
            thisVue.state = 'start'
            let datalog = data.log.replace(new RegExp('\\n', 'gm'), '<br/>')
            thisVue.trainingRes.t_cur_log_url += datalog
            thisVue.trainingRes.t_progress = data.progress
            if (data.progress === 100) {
              thisVue.state = 'pack'
            }
          } else if (data.cmd === 'TRAIN_SUCCESS') {   // 成功
            thisVue.$notify.success({
              title: 'success',
              message: 'Completion of model training!'
            })
            thisVue.trainingRes.t_full_log_url = data.log_url
            thisVue.trainingRes.t_stats_url = data.tensorboard_url
            thisVue.trainingRes.model_url = data.model_url
            thisVue.trainOK = true
          } else if (data.cmd === 'TRAIN_FAILED') {  // 失败
            thisVue.$notify.error({
              title: 'error',
              message: 'Train failed. Please try again!'
            })
            thisVue.trainStart = false
            clearInterval(thisVue.inter)
          } else if (data.cmd === 'TRAIN_INQUEUE') {   // 排队
            thisVue.state = 'queue'
            thisVue.trainingRes.q_progress = data.queue
            let webJson = {
              'cmd': 'GET_QUEUE_INDEX',
              'model_id': thisVue.params.id
            }
            thisVue.inter = setInterval(function () {
              if (thisVue.$websocket.readyState === 1) {
                console.log(webJson)
                thisVue.$websocket.send(JSON.stringify(webJson))
              }
            }, 600000)
          } else if (data.cmd === 'START_SERVICE_FAILED') {  // 失败
            thisVue.$notify.error({
              title: 'error',
              message: 'Start service failed. Please try again!'
            })
            thisVue.trainStart = false
            clearInterval(thisVue.inter)
          } else if (data.cmd === 'INVALID_PARAMETER') {   // 失败
            thisVue.$notify.error({
              title: 'error',
              message: 'Invalid parameter,please check your settings!'
            })
            thisVue.trainStart = false
            clearInterval(thisVue.inter)
          } else if (data.cmd === 'TRAIN_INIT') {   // 开始
            thisVue.state = 'ready'
            thisVue.trainingRes.t_cur_log_url += data.cmd + '<br/>'
            clearInterval(thisVue.inter)
          }
        } catch (e) {
          console.log(e)
        }
        return e.data
      },
      websocketsend (id) {
        // 数据发送
        let webJson = {
          'cmd': 'TRAIN_START',
          'model_id': id
        }
        if (thisVue.$websocket.readyState === 1) {
          console.log(webJson)
          thisVue.$websocket.send(JSON.stringify(webJson))
        }
      },
      websocketclose (e) {
        if (e) {
          if (e.code !== 25214) {
            thisVue.$notify.error({
              title: 'error',
              message: 'connection closed (' + e.code + ')'
            })
            thisVue.trainStart = false
          }
          console.log('connection closed (' + e.code + ')')
        } else {
          console.log('connection closed (Reconnect)')
        }
      },
      stopTrain () {
        thisVue.$notify.success({
          title: 'success',
          message: 'Model training has stopped!'
        })
        let webJson = {
          'cmd': 'TRAIN_STOP',
          'model_id': thisVue.params.id
        }
        console.log(webJson)
        thisVue.$websocket.send(JSON.stringify(webJson))
        thisVue.$websocket.close()
        thisVue.websocketclose()
        clearInterval(thisVue.inter)
        thisVue.$router.push({name: 'zoo_list'})
        // thisVue.trainStart = false
      }
    },
    mounted () {
      thisVue = this
      this.$nextTick(function () {
        let pageHeaderData = {
          'homeRouterName': 'home',
          'firstTitle': 'Marketplace',
          'firstRouterName': 'zoo_list',
          'secondTitle': 'Create'
        }
        thisVue.$store.dispatch('setPageHeaderData', pageHeaderData)
        thisVue.getSolution()
        thisVue.getTraEngine()
      })
    }
  }
</script>

<style scoped>
  .fl{ float:left;}
  .fr{ float:right;}
  .mr10{ margin-right:10px;}
  .line-form{ border-top: 1px solid #dcdfe6;}
  .pt15{ padding-top:15px;}
  .app-list{min-height: 600px;}
  .list-box{background-color: #fff; border: 1px solid #e4ebf0;}
  .list-tit{padding: 15px 20px; font-size: 2rem; border-bottom: 1px solid #ddd;}
  .create-form{padding: 30px 20px 10px;    float: none;
    overflow: hidden;}
  .el-steps{height: 70px;background-color: #fcfcfc;}
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
  .create-and-train{ margin-left:-139px;}
  .status-container{ margin-left:-94px;}
  .training-container{ padding:0;margin-top: -29px;}
  .training-container .box{ margin-bottom:15px;overflow: hidden;}
  .el-progress{ display:inline-block; width:165px;margin-top:5px;}
  .tab-container{ clear: both;}
  .training-container .train-sta,.training-container .train-down,.training-container .progress-container{ float: left;margin-right: 10px;border-radius: 3px;overflow: hidden;}
  .collapse-tit{border-left: 2px solid #0072ea;padding-left: 10px;}
</style>
<style>
  .steps-common.el-steps--simple{ margin: 0px;height:37px; border-radius:0;background: #f3f6f8;
    /*border-top:1px solid #cbe3ff;border-bottom:1px solid #cbe3ff;*/
  }
  .steps-common .icon-envelop:before,.steps-common .icon-lock:before,.steps-common .icon-checkmark:before{ display:inline-block; content: '1';border-radius:50%;width:20px;height:20px;text-align:center;color: #fff;position: absolute;left: 2px;top: -6px;z-index: 1;font-weight: bold;font-size: 12px;    text-shadow: 0px 0 1px #ffffff;}
  .steps-common .icon-envelop:after,.steps-common .icon-lock:after,.steps-common .icon-checkmark:after{ display: inline-block;content: '●';border-radius: 50%;width: 20px;height: 20px;text-align: center;font-size: 35px;position: absolute;left: 0px;top: -20px;}
  /*.steps-common .is-wait .icon-envelop:after, .steps-common .icon-lock:after, .steps-common .icon-checkmark:after{*/
    /*color:#d6dbde;*/
  /*}*/
  .steps-common .icon-lock:before{ content: '2';}
  .steps-common .icon-checkmark:before{ content: '3';}
  .steps-common .el-step__head.is-process{ color:#245682;}
  .steps-common .el-step__title.is-process{ color:#245682;}
  .steps-common .el-step__title.is-wait,.el-step__head.is-wait{ color:#c7cbce;}
  .steps-common .el-step.is-simple .el-step__title{ font-size:12px;}
  .steps-common .el-step.is-simple .el-step__arrow::after, .el-step.is-simple .el-step__arrow::before{ height:13px; background:#245682;}
  .radiogroup-container .el-radio-button__inner{ width:73px;}
  .training-container .el-progress-bar__outer{ height:20px !important;border-radius:50px;}
  /*.training-container .el-progress-bar__innerText{ color: #223c53;}*/
  .training-container .el-tabs--border-card>.el-tabs__content{ min-height: 300px;}
  .active-name-1 .el-collapse, .el-collapse-item__header, .el-collapse-item__wrap{ border-bottom:0;}
  .active-name-1 .el-collapse-item:last-child{ margin-bottom:0;}
  .active-name-1 .el-collapse,.active-name-2 .el-collapse{ padding:0;}
</style>
