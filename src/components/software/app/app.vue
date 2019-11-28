<template>
  <div name="app_list" class="sidebar-xs">
    <!-- Detached content -->
    <div class="app-store-box" v-loading="loading" element-loading-text="loading..." element-loading-spinner="el-icon-loading">
      <div class='frame-banner'>
        <div class='dash-item dash-item1' :class="{'active': showAppFilterBySort=='public'}" @click="getAppStore('public')" style="z-index: 4;"><span>{{ $t('app_market') }}</span></div>
        <div class='dash-item dash-item3' :class="{'active': showAppFilterBySort=='my'}" @click="getAppStore('my')" style="z-index: 2;"><span>{{ $t('my_app') }}</span></div>
        <!-- search tag -->
        <div class="top-bar">
          <el-input size='small' :placeholder="$t('filter_by_tags')" v-model="searchApplicationTags" clearable suffix-icon="el-icon-search" class="input-with-select" @keyup.enter.native='getApplicationsByConditions'>
          </el-input>
        </div>
      </div>
      <div style='padding: 0px 30px;min-height: 500px;'>
        <el-row :gutter='20' class="app-container">
          <div class='addBox' v-if="showAppFilterBySort==='my'">
            <div class="panel card-add" @click="$router.push({name: 'software_app_create'})">
              <div class="panel-body text-center"><span><i class='el-icon-plus'></i></span></div>
            </div>
          </div>
          <el-col class="item-container" :span='6' v-for="(item, indexall) in appList" :value="item.id" :key="item.id">
            <div class='panel-body-myapp'>
              <router-link class="app-info-container" :to="{name:'software_app_detail',params: { appId: item.id, info: item, appPermission: showAppFilterBySort }}">
                <div class="app-img">
                  <img src="../../../../static/img/SMBRouterF.png" v-if="!item.image" class="bounce list-block">
                  <img :src="item.image" v-else class="bounce list-block">
                </div>
                <h6 class="text-semibold app-desc ellipsis" style="">
                  {{item.name}}
                  <small :title="item.description" class="display-block">{{item.description}}</small>
                </h6>
              </router-link>
              <!--new tag-->
              <div class="tag-box" ref="tagBox">
                <div class="heading-elements">
                  <el-input class="input-new-tag f-r" v-if="inputVisible[item.id]" v-model="inputValue[item.id]" :ref="'saveTagInput'+item.id" size="small" :maxlength='16' @keyup.enter.native="handleInputConfirm(item.id)" @blur="handleInputConfirm(item.id)" >
                  </el-input>
                  <el-button class="button-new-tag f-r" size="mini" closable @click="showInput('saveTagInput'+item.id, item.id, indexall)" v-else>
                    + {{ $t('new_tag') }}
                  </el-button>
                </div>
                <span v-for="(tagName, index) in item.tags" :key='index'>
                  <span v-if="tagName.name">
                    <el-tag v-if="index<1" closable :key="tagName.id" :disable-transitions="false" :type="tagTypes[index%4]" style="margin-top: 10px;" @close="handleClose(item.id, tagName.name)">
                      <el-tooltip class="item" effect="dark" :content="tagName.name" placement="top-start">
                        <span class="text-overflow">{{tagName.name}}</span>
                      </el-tooltip>
                    </el-tag>
                  </span>
                </span>
                <router-link class="tag-more" :to="{name:'software_app_detail',params: { appId: item.id, info: item, appPermission: showAppFilterBySort }}" v-if="item.tags && item.tags.length>1" style="">
                  <h6 class="text-primary text-semibold media-right no-margin-bottom" style="">{{ $t('more') }} >></h6>
                </router-link>
              </div>
              <!--new tag-->

              <p class="permission-container" v-if="showAppFilterBySort==='my'">
                <span class="label bg-success-400 dropdown-toggle" data-toggle="dropdown" v-if="item.is_public">{{ $t('upper_public') }}</span>
                <span class="label bg-danger-400 dropdown-toggle" data-toggle="dropdown" v-else>{{ $t('upper_private') }}</span>
              </p>
              <div class="opr-wrap" v-if="showAppFilterBySort==='my'">
                <el-tooltip effect="dark" :content="$t('deploy')" placement="top">
                  <i class="table-btn iconfont icon-deployment" @click="$router.push({name: 'software_app_deploy_device_list', query: {name: item.name, applicaion_id: item.id}})"></i>
                </el-tooltip>
                <el-tooltip effect="dark" :content="$t('document')" placement="top">
                  <i class="table-btn icon-menu6" @click="$router.push({name: 'software_app_document', params: {appId: item.id, appName: item.name} })"></i>
                </el-tooltip>
                <el-tooltip effect="dark" :content="$t('edit')" placement="top">
                  <i class="table-btn icon-pencil5" @click="showDialog(item.id)"></i>
                </el-tooltip>
                <el-tooltip effect="dark" :content="$t('delete')" placement="top">
                  <i class="table-btn icon-trash" @click="deleteApp(item.id)"></i>
                </el-tooltip>
                <el-tooltip effect="dark" :content="$t('share')" placement="top">
                  <i v-if="!item.is_public" class="table-btn icon-hammer-wrench" @click="changePermission(item.id)"></i>
                </el-tooltip>
              </div>
              <el-badge class="item add-to-myapp" style="margin-top:10px" v-if="showAppFilterBySort==='public'">
                <el-button size="small" class="pay">$ <span>0</span></el-button>
                <el-button size="small" class="atma" icon='el-icon-plus' @click='addToMyApp(item.id)'>{{ $t('add_to_my_app') }}</el-button>
              </el-badge>
            </div>
          </el-col>
        </el-row>
      </div>

      <div :span='24' class='common-page'>
        <el-pagination background @current-change="handleCurrentChange"  @size-change="handleSizeChange" :current-page="page.number" :page-sizes="[10, 20, 30, 40]" :page-size="page.size" popper-class='page-pop' layout="total, slot, sizes, prev, pager, next" :total="page.total">
        </el-pagination>
      </div>
      <!-- edit dialog -->
      <el-dialog :visible.sync='editDialog' :title="$t('edit')" :show-close='true' :close-on-click-modal='false'>
        <editApp @closeDialog='closeDialog' :appId='cur_id'></editApp>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import editApp from './edit'
  import { applicationList, appStoreList, createAudit, appAddTags, appDeleteTags, applicationCopy, appDelete, applicationFilter } from '@/api'

  let thisVue = null
  export default {
    components: {editApp},
    data () {
      return {
        loading: true,
        editDialog: false,
        aiwebappScore: 5,
        cur_id: '',
        model10: [],
        appList: [],
        applicationTagsDict: {},
        tagTypes: ['', 'success', 'warning', 'danger'],
        searchApplicationTags: '',
        inputVisible: {},
        inputValue: { },
        is_public: true,
        showAppFilterBySort: 'public',
        page: {
          size: 10,
          total: 0,
          number: 1
        }
      }
    },
    methods: {
      closeDialog () {
        thisVue.editDialog = false
        thisVue.getAppStore('my')
      },
      showDialog (id) {
        thisVue.editDialog = true
        thisVue.cur_id = id
      },
      getAppStore (param) {
        thisVue.showAppFilterBySort = param
        thisVue.getAPPList()
      },
      getAPPList () {
        let {size, number} = thisVue.page
        let offset = size * (number - 1)
        let limit = size
        let params = {limit, offset}
        let curAction = null
        if (thisVue.showAppFilterBySort === 'my') {
          curAction = applicationList
        } else {
          curAction = appStoreList
        }
        thisVue.loading = true
        curAction(params).then(dat => {
          let res = dat.data
          thisVue.loading = false
          thisVue.page.total = res.total
          if (res && res.applications.length > 0) {
            thisVue.appList = res.applications
            let applicationIds = []
            for (let i in thisVue.appList) {
              let appId = thisVue.appList[i].id
              applicationIds.push(appId)
            }
          } else if (res.applications.length === 0) {
            thisVue.appList = res.applications
          }
        }).catch(_ => {
          thisVue.loading = false
        })
      },
      handleCurrentChange (val) {
        thisVue.page.number = val
        thisVue.getAppStore(thisVue.showAppFilterBySort)
      },
      handleSizeChange (val) {
        thisVue.page.size = val
        thisVue.getAppStore(thisVue.showAppFilterBySort)
      },
      changePermission (id) {
        thisVue.$confirm(thisVue.$t('app_permission_setting'), thisVue.$t('permission_setting'), {type: 'warning'}).then(_ => {
          thisVue.loading = true
          let params = {description: 'apply for public', approve_type: 'app', permission: 'public', approve_item: id}
          createAudit(params).then(dat => {
            let res = dat.data
            thisVue.loading = false
            if (res.status === 'success') {
              thisVue.$message({message: thisVue.$t('app_permission_result'), type: 'success'})
              thisVue.getAPPList()
            } else if (res.status === 'fail') {
              thisVue.$message({type: 'error', message: thisVue.$t('operation_fail')})
            }
          }).catch(_ => {
            thisVue.loading = false
          })
        }).catch(_ => {
          return false
        })
      },
      handleClose (applicationId, tagName) {
        thisVue.deleteTagFromApplication(applicationId, tagName)
      },
      showInput (applicationNameClass, applicationId) {
        Vue.set(this.inputVisible, applicationId, true)
        this.$nextTick(_ => {
          thisVue.$refs[applicationNameClass][0].$refs.input.focus()
        })
      },
      handleInputConfirm (applicationId) {
        let tagName = this.inputValue[applicationId]
        if (tagName && tagName.trim()) {
          thisVue.addTagToApplications([applicationId], tagName)
        }
        Vue.set(thisVue.inputVisible, applicationId, false)
        this.inputValue[applicationId] = ''
      },
      addTagToApplications (applicationIds, tagName) {
        thisVue.loading = true
        appAddTags(applicationIds, {name: tagName}).then(dat => {
          let res = dat.data
          thisVue.loading = false
          if (res.status === 'success') {
            thisVue.$message({message: thisVue.$t('add_tag_success'), type: 'success'})
            thisVue.getApplicationsByConditions()
          } else if (res.status === 'fail') {
            thisVue.$message({type: 'error', message: thisVue.$t('add_tag_fail')})
          }
        }).catch(_ => {
          thisVue.loading = false
        })
      },
      deleteTagFromApplication (applicationId, tagName) {
        thisVue.loading = true
        appDeleteTags(applicationId, {name: tagName}).then(dat => {
          let res = dat.data
          thisVue.loading = false
          if (res.status === 'success') {
            thisVue.$message({message: thisVue.$t('remove_tag_success'), type: 'success'})
            thisVue.getApplicationsByConditions()
          } else if (res.status === 'fail') {
            thisVue.$message({type: 'error', message: thisVue.$t('remove_tag_fail')})
          }
        }).catch(_ => {
          thisVue.loading = false
        })
      },
      getApplicationsByConditions () {
        if (thisVue.searchApplicationTags !== '') {
          thisVue.getApplicationsByTagNames(thisVue.searchApplicationTags)
        } else {
          thisVue.getAPPList()
        }
      },
      getApplicationsByTagNames (tagNames) {
        thisVue.loading = true
        applicationFilter({tag_names: tagNames}).then(dat => {
          let res = dat.data
          thisVue.loading = false
          thisVue.appList = res.applications
        }).catch(_ => {
          thisVue.loading = false
        })
      },
      addToMyApp (id) {
        thisVue.$confirm(thisVue.$t('add_to_my_app_tip'), thisVue.$t('add_to_my_app'), {type: 'warning'}).then(_ => {
          thisVue.loading = true
          applicationCopy({app_id: id}).then(dat => {
            let res = dat.data
            thisVue.loading = false
            if (res.status === 'success') {
              thisVue.$message({type: res.status, message: thisVue.$t('add_my_app_success')})
            } else {
              thisVue.$message({type: 'error', message: thisVue.$t('add_my_app_fail')})
            }
          }).catch(_ => {
            thisVue.loading = false
          })
        }).catch(_ => {
          return false
        })
      },
      deleteApp (appId) {
        thisVue.$confirm(thisVue.$t('del_app_msg'), thisVue.$t('delete'), {type: 'error'}).then(_ => {
          thisVue.loading = true
          appDelete(appId).then(dat => {
            let res = dat.data
            thisVue.loading = false
            if (res.status === 'success') {
              thisVue.$message({type: res.status, message: thisVue.$t('del_success')})
              thisVue.getApplicationsByConditions()
            } else {
              thisVue.$message({type: 'error', message: thisVue.$t('del_fail')})
            }
          }).catch(_ => {
            thisVue.loading = false
          })
        }).catch(_ => {
          return false
        })
      }
    },
    mounted: function () {
      thisVue = this
      if (thisVue.$route.params.param && thisVue.$route.params.param === 'my') {
        thisVue.getAppStore('my')
      } else {
        thisVue.getAppStore('public')
      }
    }
  }
</script>
<style scoped>
  ul, ol {
    padding-left: 0px;
  }
  .el-button--small{
    padding: 9px 12px;
    height: 32px;
  }
  .app-container{background: #f8f8f8;padding: 20px 10px;padding-bottom: 0;}
  .ivu-dropdown-rel > a {
    color: #555;
  }
  .panel{ border-radius:6px;}
  .panel-body {
    padding: 10px;
  }
  .panel-body-myapp{
  position:relative;
  background-color: #fff;
  margin-bottom: 10px;
    overflow: hidden;
    border-radius: 10px;
  }
  img{
    width: 140px;
    height: 80px;
  }
  .el-tag{
    margin-left: 6px;
  }
  .button-new-tag {
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
    padding: 0px 9px;
  }
  .input-new-tag {
    width: 70px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  .app-desc{
    min-height: 40px;
    color: #333333;width: 100%;text-align:center;
  }
  .img-box{
    width: 140px;
    height: 140px;
  }
  img.list-block{
    max-width: 100%;
    height: auto;
  }
  .cursor{
    cursor: pointer;
  }
  .text-overflow{
    overflow: hidden;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    white-space:nowrap;
    width: 50px;
    max-width:50px;
    height:20px;
    display:inline-block;
    text-align: center;
  }
  .f-r{float: right;}
  @media screen and (min-width : 768px) and (max-width : 1024px) {
    .text-overflow{
      width: 40px;
      max-width:40px;
    }
  }
  @media screen and (min-width: 1025px) and (max-width : 1199px) {
    .text-overflow{
      width: 30px;
      max-width:30px;
    }
  }
  @media screen and (min-width: 1200px){
    .text-overflow{
      width: 40px;
      max-width:40px;
    }
  }
  .item-container{ margin-bottom: 12px;}
  .app-img{text-align: center; margin: 20px 0px 3px;}
  .app-img img{width: 100px;height: 100px;border-radius: 50%;transition: all 0.6s;}
  .app-info-container:hover .app-img img{ transform: scale(1.1);}
  .app-store-box{background-color: #fff;padding-bottom: 20px;}
  .top-bar{float: right;margin: 15px 20px;}
  .top-bar .input-with-select{width: 300px;}
  .tab-btn{width: 50%; display: block; float: left; box-sizing: border-box;}
  .card-add{ margin-bottom:0; text-align: center; background-color: rgba(255,255,255,0.3);border: 1px dashed #aaa !important;line-height: 370px;color: #aaa;cursor: pointer;height:276px;overflow: hidden;}
  .card-add span{ position:relative;top:-55px; font-size: 30px;background-color: #e8e8e8;padding: 23px 25px;border-radius: 50%;}
  .heading-elements {overflow: hidden;
    position: initial;
    height: 36px;
    float: left;
    margin-top: 10px;}
  .add-to-myapp{ width:100%;margin-top:0 !important;}
  .add-to-myapp button{width:70%;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    height: 40px;  background-color: #26C6DA;
    border-color: #26C6DA;
    color: #fff;    float: left;
    margin: 0;border-bottom-left-radius:0;
  }
  .add-to-myapp button.pay{  position:relative;width:30%;background-color: #5f5f5f;border-color: #5f5f5f;border-bottom-right-radius:0;font-size:16px;color:#ffd04b;}
  .add-to-myapp button.pay:hover,.add-to-myapp button.pay:active{ background-color: #5f5f5f;border-color: #5f5f5f;cursor: inherit;}
  .add-to-myapp button.pay span{  width:30%;border-color: #797979;border-bottom-right-radius:0;font-size:16px;text-decoration: underline;}
  .add-to-myapp button.atma:hover,.add-to-myapp button.atma:active{ background-color: #1abace;color:#fff;border-color: #1abace;}
  .add-to-myapp .pay:before{
    display: block;content:'';
    width: 0;
    height: 0;
    border-left: 22px solid transparent;
    border-right: 22px solid transparent;

    border-top: 22px solid #5f5f5f;    position: absolute;
    right: -42px;
    top: -1px;}
  .add-to-myapp .pay:after{
    display: block;content:'';width: 0;
    height: 0;
    border-top: 20px solid transparent;
    border-bottom: 20px solid transparent;
    border-left: 20px solid #5f5f5f;    position: absolute;
    right: -21px;
    top: 0px}
  .tag-more{ display: inline-block;
    vertical-align: middle;
    width: 50px;
    height: 26px;
    overflow: hidden;
    margin-left: 5px;
    position: relative;
  }
  .tag-more h6{    font-size: 14px;
    font-weight: normal;
    padding-left: 0;
    position: absolute;
    left: 0;
    top: -9px;
    color: #2196F3 !important;
  }
  .tag-more h6:hover{ color: #1565C0 !important;}
  .ellipsis{ height: 44px; font-size:18px;margin-bottom:0;}
  .ellipsis:hover{ text-decoration: underline;}
  .ellipsis small{ font-size: 14px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;}
  .atma{ font-size:14px;}
  .tag-box{ overflow: hidden;
    height: 43px;margin-bottom:10px;padding:0 10px;}
  .card-opr {
    position: absolute;
    bottom: 10px;
    left: 20px;display: inline-block;
    color: #606266;
    font-size: 14px;margin-left:0;background:none;border-top:0;width: 26px;height:26px;padding-left: 0;}
  .card-opr .icon-deployment{ }
  .permission-container{ display: inline-block;
    position: absolute;
    right: 0px;
    top: 0px;
    border-bottom-left-radius: 12px;
    overflow: hidden;}
  .ribbon-container{ z-index:1;}
  .app-info-container{     position: relative;
    z-index: 2;
    overflow: hidden;
    display: block;padding:0 10px;}
  .addBox{float:left;width:25%;display:inline-block;padding: 0 10px;position:relative;z-index: 9;}
  .card-opr li{    margin: 5px 4px 4px 9px;
    color: #fff;
    height: 30px;
    line-height: 30px;}
  .permission-container .label{ padding: 2px 7px;}
  .frame-banner{ margin-bottom:1px;padding-left:10px;background: #fff;box-shadow:0 1px 0 0 #cbd7e2;margin-bottom: 20px;}
  .frame-banner .dash-item{ display:inline-block; margin: 0 15px -1px; padding: 17px 2px; cursor: pointer; border-bottom: 2px solid rgba(0,0,0,0);font-size:14px;color: #223c53;}
  .frame-banner .dash-item.active{ border-bottom: 2px solid #223c53;font-weight: bold;}
  .frame-banner .dash-item:hover{ border-bottom: 2px solid #223c53;}
  .opr-wrap{ padding: 11px 10px; background: #efefef;}
  .opr-wrap i{ margin-right:7px;cursor: pointer;color:#223c53;}
  .opr-wrap i:hover{ color:#5ca3e2;}
</style>
