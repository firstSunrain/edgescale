<template>
  <!-- Main navbar -->
  <el-row class='list-box'>
    <div class="navbar navbar-inverse">
      <el-col :span='24' class='opr-box'>
        <el-col :span='4'>
          <div class="navbar-header">
            <router-link :to="{name: 'dashboard'}" class="navbar-brand"><img src="../../static/img/es-logo-red.svg" alt=""></router-link>
            <router-link :to="{name: 'dashboard'}" class="navbar-brand"><img src="../../static/img/edgescale-logo-white.svg" alt=""></router-link>
          </div>
        </el-col>
        <el-col :span='14'>
          <slot name='top-head'></slot>
        </el-col>
        <el-col :span='6'>
          <div class="navbar-collapse collapse" id="navbar-mobile" >
            <div class="nav navbar-nav" style="float: none; text-align: right;margin-top: 10px;">
              <el-col class="dropdown dropdown-user">
                <div class="language-box">
                  <el-dropdown trigger='hover' @command="setLanguage">
                      <span class="el-dropdown-link">
                        <i class="icon-earth"></i> {{ $t('language') }}<i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command='zh'>中文</el-dropdown-item>
                      <el-dropdown-item command='en'>English</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>

                <el-tooltip class="item-help" effect="dark" :content="$t('helpDocument')" placement="top-start">
                  <router-link :to="{name: 'start_page'}" style='margin-right: 20px;'>
                    <i class="icon-question7"></i><span class="label">{{$t('help')}}</span>
                  </router-link>
                </el-tooltip>

                <a class="dropdown-toggle" data-toggle="dropdown">
                  <router-link :to="{name: 'user_profile_overview'}" >
                    <img v-if='navHeadImg' :src="navHeadImg" width='30px' height="30px" alt="">
                    <i v-else class="iconfont icon-user1 head-icon"></i>
                  </router-link>
                  <el-dropdown trigger="hover" @command="handleCommand" style="color:#ffffff" >
                    <span class="el-dropdown-link">
                      <span>{{username}}</span>
                      <i class="caret"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="startGuide" class="hide">
                        <a class="text-default dropdown-toggle">
                          <i class="glyphicon glyphicon-log-out"></i> Start Guide
                        </a>
                      </el-dropdown-item>
                      <el-dropdown-item command="changePwd">
                        <a class="text-default dropdown-toggle">
                          <i class="icon-key"></i> {{ $t('changePassword') }}
                        </a>
                      </el-dropdown-item>
                      <el-dropdown-item  command="changeHeadImg">
                        <a class="text-default dropdown-toggle">
                          <i class="icon-image2"></i> {{ $t('headPortrait') }}
                        </a>
                      </el-dropdown-item>
                      <el-dropdown-item command="logout">
                        <a class="text-default dropdown-toggle">
                          <i class="icon-switch2"></i> {{ $t('logout') }}
                        </a>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </a>
              </el-col>
            </div>
          </div>
        </el-col>
      </el-col>
      <!-- change password dialog -->
      <el-dialog :show-close='false' :title="$t('changePassword')" :visible.sync='isPwdDialog' width='50%' :close-on-click-modal='false'>
        <el-form status-icon :model='pwdForm' ref='pwdForm' :rules='rules' label-width="140px" class="demo-ruleForm">

          <el-form-item :label="$t('name')" prop="username">
            <el-input size='small' v-model='username' disabled></el-input>
          </el-form-item>

          <div v-if="changeType == 'password'">
            <el-form-item :label="$t('old_pwd')" prop="old_password">
              <el-input size='small' type='text' v-model='pwdForm.old_password' @focus="pwdFocus"></el-input>
            </el-form-item>

            <el-form-item :label="$t('password')" prop="new_password">
              <el-input size='small' type='text' v-model='pwdForm.new_password' @focus="pwdFocus"></el-input>
            </el-form-item>

            <el-form-item :label="$t('confirm_pwd')" prop='enterPwd'>
              <el-input size='small' type='text' v-model='pwdForm.enterPwd' @focus="pwdFocus"></el-input>
            </el-form-item>
          </div>

          <el-form-item :label="$t('head_pic')" v-if="changeType == 'head_pic'">
            <comUpload :uploadParams="{type: 'eiq', username}" @fileUrl='getFileUrl'></comUpload>
          </el-form-item>

        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size='small' @click="cancle('pwdForm')">{{ $t('cancel') }}</el-button>
          <el-button size='small' type="primary" v-if="changeType == 'password'" @click="changePwd('pwdForm')">{{ $t('submit') }}</el-button>
          <el-button size='small' type="primary" v-if="changeType == 'head_pic'" :disabled='hasHeadImg' @click="changeHeadImg('pwdForm')">{{ $t('submit') }}</el-button>
        </span>
      </el-dialog>
    </div>
  </el-row>
</template>


<script>
  import { changeUserPwd, editSelfUser } from '@/api'
  import comUpload from '../components/commonUpload'
  import { mapActions } from 'vuex'

  let thisVue = null

  export default {
    components: { comUpload },
    data () {
      let validatePass = (rule, value, callback) => {
        if (value !== this.pwdForm.new_password) {
          callback(new Error(this.$t('rule_pwd_match')))
        } else {
          callback()
        }
      }
      return {
        searchInput: false,
        filter_text: '',
        username: '',
        imageUrl: '',
        changeType: '',
        hasHeadImg: true,
        pwdForm: {
          token: this.$cookie.get('token'),
          old_password: '',
          new_password: '',
          enterPwd: ''
        },
        isPwdDialog: false,
        rules: {
          'new_password': [
            { required: true, message: this.$t('rule_password_require'), trigger: 'blur' },
            { min: 8, max: 32, message: this.$t('rule_len8_len32'), trigger: 'blur' }
          ],
          'enterPwd': [
            { required: true, message: this.$t('rule_password_require'), trigger: 'blur' },
            { required: true, validator: validatePass, trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      navHeadImg () {
        return this.$store.state.userInfo.image
      }
    },
    methods: {
      ...mapActions(['setWebLanguage']),
      setLanguage (val) {
        sessionStorage.setItem('language', val)
        thisVue.$router.go(0)
      },
      handleCommand (command) {
        if (command === 'logout') {
          thisVue.logout()
        } else if (command === 'myTasks') {
          thisVue.$router.push({name: 'task_list'})
        } else if (command === 'myProfile') {
          thisVue.$router.push({name: 'user_profile_overview'})
        } else if (command === 'accountSettings') {
          thisVue.$router.push({name: 'user_profile_account'})
        } else if (command === 'startGuide') {
          thisVue.$router.push({name: 'start_page'})
        } else if (command === 'changePwd') {
          thisVue.isPwdDialog = true
          thisVue.changeType = 'password'
        } else if (command === 'changeHeadImg') {
          thisVue.isPwdDialog = true
          thisVue.changeType = 'head_pic'
        }
      },
      changePwd (pwdForm) {
        let {old_password, new_password} = thisVue.pwdForm
        let params = {old_password, new_password}
        thisVue.$refs[pwdForm].validate((valid) => {
          if (valid) {
            changeUserPwd(params).then(dat => {
              let res = dat.data
              if (res.status === 'success') {
                thisVue.$message({type: 'success', message: thisVue.$t('operation_success')})
                thisVue.$refs[pwdForm].resetFields()
                thisVue.isPwdDialog = false
              } else if (res.status === 'fail') {
                thisVue.$message({type: 'error', message: res.message})
              }
            }).catch(_ => {
              return false
            })
          }
        })
      },
      changeHeadImg () {
        if (thisVue.imageUrl) {
          let params = {image: thisVue.imageUrl}
          editSelfUser(params).then(dat => {
            let res = dat.data
            if (res.status === 'success') {
              thisVue.$message({type: 'success', message: res.message})
              thisVue.$refs.pwdForm.resetFields()
              thisVue.isPwdDialog = false
              thisVue.$refs.upload.clearFiles()
            } else if (res.status === 'fail') {
              thisVue.$message({type: 'error', message: res.message})
            }
          }).catch(_ => {
            return false
          })
        } else {
          thisVue.$message({type: 'error', message: 'please select head portrait'})
        }
      },
      cancle (pwdForm) {
        thisVue.$refs[pwdForm].resetFields()
        thisVue.isPwdDialog = false
      },
      logout () {
        thisVue.$cookie.delete('username')
        thisVue.$cookie.delete('token')
        if (!thisVue.$cookie.get('username')) {
          thisVue.$message({message: thisVue.$t('login_out_success'), type: 'success'})
          thisVue.$router.push('/login')
        }
      },
      getFileUrl (data) {
        thisVue.imageUrl = data
      },
      pwdFocus (event) {
        event.target.type = 'password'
      }
    },
    mounted: function () {
      thisVue = this
      thisVue.username = thisVue.$cookie.get('username')
      thisVue.$store.dispatch('getUserInfo')
      thisVue.$store.dispatch('getUserPermission')
      let sessionLan = sessionStorage.getItem('language')
      if (sessionLan) {
        this.setWebLanguage({curVue: thisVue, lan: sessionLan})
      } else {
        this.setWebLanguage({curVue: thisVue, lan: 'en'})
      }
    },
    watch: {
      imageUrl: function (oldVal, newVal) {
        thisVue.hasHeadImg = false
      }
    }
  }
</script>
<style scoped>
  .opr-box{ min-width:1285px;}
  .navbar-inverse {
    background-color: #245682;
  }
  .navbar-brand:first-child{
    margin-bottom: 8px;
    padding:10px 0px 2px 30px!important;
  }
  .navbar-brand{
    padding:9px 0px 0px 2px!important;
  }
  .navbar-brand > img{
    height: 30px!important;
  }
  .navbar-header {
     min-width: 200px;
  }
  .xs-logo{
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    margin: 0;
    padding: 0;
    float: none;
    text-align: center;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 178px;
  }
  .avatar-uploader .el-upload input[type='file'] {
    display: none;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .msg-notify{
    font-size: 20px;
    color: #f7d04b;
  }
  .notify-a{margin: 0px 20px;}
  .item-help{ margin-right:10px !important;}
  .item-help .icon-question7{ padding: 1px;font-size: 12px;color:#fff;border:1px solid #fff;border-radius:50px;}
  .item-help .label{ color:#fff;}
  .language-box{ display:inline-block;margin-right:16px;}
  .language-box .el-dropdown{ color:#fff;}
  .head-icon{color: #fff;font-size: 20px;}
</style>
<style>
  .el-badge__content{border: none;}
</style>
<style scoped>
  .navbar-nav > .dropdown-user > a > span{ padding-left:2px;font-size:14px;font-weight: normal;}
</style>
