<template>
  <el-row class='list-box' v-loading='loadingDiv' element-loading-spinner="el-icon-loading" element-loading-text="loading....">
    <div class="sel-title" :label="$t('solution_name')" prop="solutionname">
      <b v-text="basicInfo.solution"></b>
    </div>
    <div name="list" class="sidebar-xs has-detached-left list-wrap" style="margin: 20px;">
      <devTable @getSelDev='getSelDev' :modelId='modelId' :type="'solution'">
        <div slot='btnOpr'>
          <el-button size='small' class='common-btn' type="primary" :disabled='deviceIds.length == 0' @click="createAppTask"><i class="iconfont icon-deployment"></i> {{ $t('deploy') }}</el-button>
        </div>
      </devTable>
    </div>
  </el-row>
</template>

<script>
  import { taskCreate, solutionInfo } from '@/api'
  import devTable from '../devtable'

  let thisVue = null

  export default {
    components: {devTable},
    data () {
      return {
        loadingDiv: false,
        modelId: '',
        basicInfo: {},
        solutionId: '',
        deviceIds: []
      }
    },
    filters: {
      languageType (val) {
        if (val && thisVue.$t(val)) {
          return thisVue.$t(val)
        } else {
          return val
        }
      }
    },
    methods: {
      cancel () {
        thisVue.$confirm(thisVue.$t('give_up_tip'), thisVue.$t('cancel'), { type: 'warning' }).then(() => {
          thisVue.$router.go(-1)
        }).catch(() => {
          return false
        })
      },
      createAppTask () {
        thisVue.loadingDiv = true
        let basicInfo = thisVue.basicInfo
        let payload = {
          'solution_id': basicInfo.id,
          'solution': basicInfo.solution,
          'model_id': basicInfo.model.id,
          'version': basicInfo.version,
          'url': basicInfo.link
        }
        let params = {
          'task': {
            'device_ids': thisVue.deviceIds,
            'type': 'deploy_solution',
            'payload': payload
          }
        }
        taskCreate(params).then(dat => {
          let res = dat.data
          thisVue.loadingDiv = false
          if (res.status === 'fail') {
            thisVue.loadingDiv = false
            thisVue.$message({type: 'error', message: thisVue.$t('create_task_fail')})
          } else if (res.status === 'success') {
            thisVue.$message({message: thisVue.$t('create_task_success'), type: 'success'})
            thisVue.$router.push({name: 'task_detail', params: { taskId: res.task.id }})
          }
        }).catch(_ => {
          thisVue.loadingDiv = false
          return false
        })
      },
      getSelDev (val) {
        thisVue.deviceIds = []
        val.map(item => {
          thisVue.deviceIds.push(item.id)
        })
      },
      getSolutionDetail () {
        thisVue.loadingDiv = true
        solutionInfo(thisVue.solutionId).then(dat => {
          let res = dat.data
          thisVue.loadingDiv = false
          if (res) {
            thisVue.basicInfo = res
            thisVue.modelId = res.model.id
          }
        }).catch(_ => {
          thisVue.loadingDiv = false
          return false
        })
      }
    },
    mounted () {
      thisVue = this
      thisVue.solutionId = thisVue.$route.params.id
      thisVue.getSolutionDetail()
    }
  }
</script>
<style scoped>
  .list-wrap{ margin-top:15px!important;}
  .next-step{text-align: right; margin-top: 20px;clear: both;}
  .list-box{background-color: #fff;padding: 20px 0px;}
  .sel-title{ margin: 0 20px 0;padding-bottom: 10px;font-size: 16px;color: #245682;}
</style>
