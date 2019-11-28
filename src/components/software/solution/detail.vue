<template>
  <div name="list" class='app-list solution-detail-container pd20 detail-box'>
    <el-row class='list-box' v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading....">

      <div class="media stack-media-on-mobile text-left opr-box-container">
       <el-col :span='24' class='opr-box'>
         <el-col :span='18'>
           <div  style='font-size: 2rem;vertical-align: middle;'>
             {{solutionInfo.solution}}
           </div>
         </el-col>
         <div class="btn-group">
           <el-button class="common-btn together-btn" size='small' @click='getSolutionDetail(solutionId)'><i class="icon-rotate-cw3"></i>{{ $t('refresh') }}</el-button>
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
               <li>
                 <label style='font-size: 14px;'>
                   <i class='icon-diamond4 info-icon' style='color: #06bcbf;font-size: 10px;'></i>
                   <span style='padding: 0px 6px;font-weight: bold;'>{{ $t('solution_name') }}:</span>
                   <span style='color: #444;'>{{solutionInfo.solution}}</span>
                 </label>
               </li>
               <li>
                 <label style='font-size: 14px;'>
                   <i class='icon-diamond4 info-icon' style='color: #06bcbf;font-size: 10px;'></i>
                   <span style='padding: 0px 6px;font-weight: bold;'>{{ $t('model') }}:</span>
                   <span style='color: #444;'>{{solutionInfo.vendor}}-{{solutionInfo.platform}}-{{solutionInfo.type}}-{{solutionInfo.model}}</span>
                 </label>
               </li>
               <li>
                 <label style='font-size: 14px;'>
                   <i class='icon-diamond4 info-icon' style='color: #06bcbf;font-size: 10px;'></i>
                   <span style='padding: 0px 6px;font-weight: bold;'>{{ $t('version') }}:</span>
                   <span style='color: #444;'>{{solutionInfo.version}}</span>
                 </label>
               </li>
               <li>
                 <label style='font-size: 14px;'>
                   <i class='icon-diamond4 info-icon' style='color: #06bcbf;font-size: 10px;'></i>
                   <span style='padding: 0px 6px;font-weight: bold;'>{{ $t('permission') }}:</span>
                   <span  style='color: #444;' v-if="solutionInfo.is_public === true">{{ $t('upper_public') }}</span>
                   <span  style='color: #444;' v-else>{{ $t('upper_private') }}</span>
                 </label>
               </li>
               <li>
                 <label style='font-size: 14px;'>
                   <i class='icon-diamond4 info-icon' style='color: #06bcbf;font-size: 10px;'></i>
                   <span style='padding: 0px 6px;font-weight: bold;'>{{ $t('link') }}:</span>
                   <span  style='color: #444;'>{{solutionInfo.link}}</span>
                 </label>
               </li>
             </ul>
           </el-collapse-item>
           <!-- log -->
           <el-collapse-item title='Tags' name='2'>
             <template slot='title'>
               <span class='collapse-tit'>{{ $t('upper_tags') }}</span>
             </template>
             <div class="content-group-lg">
               <div class="row">
                 <div class="col-sm-12 ">
                   <el-tag :key="tag.id" v-for="(tag, index) in solutionTagsData" closable :type="tagTypes[index%5]" :disable-transitions="false" @close="handleClose(solutionId, tag.name)">{{tag.name}}</el-tag>
                   <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" :maxlength='16' @keyup.enter.native="handleInputConfirm(solutionId)" @blur="handleInputConfirm(solutionId)"></el-input>
                   <el-button v-else class="button-new-tag" size="small" @click="showInput">+ {{ $t('new_tag') }}</el-button>
                 </div>
               </div>
             </div>
           </el-collapse-item>
         </el-collapse>
       </el-col>
     <!--</div>-->
    </el-row>
  </div>
</template>

<script>
  import { solutionInfo, solutionTagDelete, solutionTagAdd } from '@/api'

  let thisVue = null

  export default {
    data () {
      let solutionId = this.$route.params.solutionId
      return {
        solutionId: solutionId,
        solutionInfo: {},
        solutionTagsData: [],
        inputVisible: false,
        inputValue: '',
        tagTypes: ['', 'success', 'warning', 'danger'],
        timertest: null,
        sourceInfo: {},
        imageInfo: {},
        basicInfo: {},
        logList: [],
        loading: true,
        status: '',
        activeNames: ['1', '2'],
        build_name: this.$route.params.buildName
      }
    },
    methods: {
      getSolutionDetail (solutionId) {
        thisVue.loading = true
        solutionInfo(solutionId).then(dat => {
          let res = dat.data
          thisVue.loading = false
          if (res) {
            let {solution, version, is_public, link} = res
            let {vendor, platform, type, model} = res.model
            thisVue.solutionInfo = {solution, version, is_public, link, vendor, platform, type, model}
            thisVue.solutionTagsData = res.tags
          }
        }).catch(_ => {
          thisVue.loading = false
          return false
        })
      },
      deleteTagToSolutionItem (solutionId, tagName) {
        let params = {'solution_id': solutionId, 'tag_name': tagName}
        thisVue.loading = true
        solutionTagDelete(params).then(dat => {
          let res = dat.data
          thisVue.loading = false
          if (res.status === 'fail') {
            thisVue.$message({type: 'error', message: thisVue.$t('remove_tag_fail')})
          } else {
            thisVue.$message({message: thisVue.$t('remove_tag_success'), type: 'success'})
            thisVue.getSolutionDetail(thisVue.solutionId)
          }
        }).catch(_ => {
          thisVue.loading = false
          return false
        })
      },
      addTagToSolution (solutionId, tagName) {
        let tagNames = []
        tagNames.push(tagName)
        thisVue.loading = true
        let params = {'solution_id': solutionId, 'tag_name': tagNames}
        solutionTagAdd(params).then(dat => {
          let res = dat.data
          thisVue.loading = false
          if (res.status === 'fail') {
            thisVue.$message({type: 'error', message: thisVue.$t('add_tag_fail')})
          } else {
            thisVue.$message({message: thisVue.$t('add_tag_success'), type: 'success'})
            thisVue.getSolutionDetail(thisVue.solutionId)
          }
        }).catch(_ => {
          thisVue.loading = false
          return false
        })
      },
      handleClose (solutionId, tagName) {
        thisVue.deleteTagToSolutionItem(solutionId, tagName)
      },
      showInput () {
        this.inputVisible = true
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
      },
      handleInputConfirm (solutionId) {
        let tagName = this.inputValue
        if (tagName && tagName.trim()) {
          thisVue.addTagToSolution(solutionId, tagName)
        }
        this.inputVisible = false
        this.inputValue = ''
      },
      toCreate () {
        thisVue.$router.push('/builder/edit/' + thisVue.build_name)
      }
    },
    mounted () {
      thisVue = this
      thisVue.getSolutionDetail(thisVue.solutionId)
    }
  }
</script>

<style scoped>
  .pd20{ padding:20px;}
  .app-list{min-height: 500px;background: #fff;}
  .list-box{background-color: #fff;}
  .opr-box-container{ overflow:hidden;}
  .info-icon{font-size: 10px; color: #7badff;}
  .list-tit{padding: 15px 20px; font-size: 2rem; border-bottom: 1px solid #ddd;}
  .el-collapse{ }
  .el-collapse li{list-style: none;}
  .cell .el-button--mini{width: 100px;}
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  .collapse-tit{border-left: 2px solid #245682;padding-left: 10px;}
</style>
