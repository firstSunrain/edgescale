<template>
  <el-row class='forget forget-container'>
    <div class="nav-container">
      <div class="account">
        <router-link :to="{'name':'login'}">{{ $t('signIn') }}</router-link>
        <router-link :to="{'name':'apply'}">{{ $t('signUp') }}</router-link>
      </div>
      <div class="logo">
        <img src="../../static/img/es-logo-red.svg" alt="">
        <img src="../../static/img/edgescale-logo-white.svg" alt="">
      </div>
    </div>
    <el-col>

      <el-card class="box-card" v-loading='loading' element-loading-spinner="el-icon-loading">
        <div slot="header" class="clearfix forget-head">
          <span>{{ $t('reset') }}</span>
        </div>
        <div>
          <el-steps :active='active-1' finish-status="process" simple>
            <el-step title='Send Email' icon='icon-envelop'></el-step>
            <el-step title='Reset Password' icon='icon-lock'></el-step>
            <el-step title='Success' icon='icon-checkmark'></el-step>
          </el-steps>

          <el-form :model='form' status-icon ref='form' :rules='rules' label-width="150px">
            <!-- step one -->
            <div class='form-box' v-if='active == 1'>
              <div class='info'>
                <span>{{ $t('input_email') }}</span>
                {{ $t('email_send') }}
              </div>
              <el-form-item :label="$t('username_email')" prop='account'>
                <el-input size='small' type='text' v-model='form.account' :placeholder="$t('username_email')"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type='primary' @click="sendEmail('form')" :disabled='is_send'>{{ $t('send_email') }}</el-button>
              </el-form-item>
            </div>
            <!-- step two -->
            <div class='form-box form-box2' v-if='active == 2'>

              <el-form-item :label="$t('password')" prop="password">
                <el-input size='small' type='password' v-model='form.password' auto-complete='off' :placeholder="$t('password')"></el-input>
              </el-form-item>

              <el-form-item :label="$t('confirm_pwd')" prop='enter_pwd'>
                <el-input size='small' type='password' v-model='form.enter_pwd' auto-complete='off' :placeholder="$t('confirm_pwd')"></el-input>
              </el-form-item>

              <el-form-item>
                <el-button type='primary' @click="submitForm('form')">{{ $t('submit') }}</el-button>
              </el-form-item>
            </div>
            <!-- step three -->
            <div class="form-box step-3" v-if='active == 3'>
              <span class='success-icon'>
                <i class='icon-checkmark4'></i>
              </span>
              <span class="success_w">
                {{ $t('reset_success') }}
                <span class="reloadTip">{{ $t('system_login_in') }} <strong>{{timeNum}}</strong> s</span>
              </span>
            </div>
          </el-form>

        </div>
      </el-card>
    </el-col>
    <div class="clear-b"></div>
    <!-- Footer -->
    <div class="footer-container text-center">
      &copy; 2017-2019<a href="http://portal.edgescale.org" style="color:#0072ea"> NXP Semiconductors</a>. All rights reserved.
    </div>
    <!-- /footer -->
  </el-row>
</template>

<script>
  import { forgetPwd, forgetPwdEmail } from '@/api'
  let thisVue = null

  export default {
    data () {
      let validatePass = (rule, value, callback) => {
        if (value !== this.form.password) {
          callback(new Error(this.$t('rule_pwd_match')))
        } else {
          callback()
        }
      }
      return {
        form: {
          email: '',
          username: '',
          password: '',
          account: '',
          enter_pwd: '',
          token: ''
        },
        active: 1,
        timeNum: 3,
        is_send: false,
        loading: false,
        rules: {
          email: [
            { required: true, message: this.$t('rule_email_require'), trigger: 'blur' }
          ],
          username: [
            { required: true, message: this.$t('rule_username_require'), trigger: 'blur' }
          ],
          account: [
            { required: true, message: this.$t('rule_account_require'), trigger: 'blur' }
          ],
          password: [
            { required: true, message: this.$t('rule_password_require'), trigger: 'blur' },
            { min: 8, max: 32, message: this.$t('rule_pwd_length'), trigger: 'blur' }
          ],
          enter_pwd: [
            { required: true, validator: validatePass, trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      submitForm (form) {
        let {token, password} = thisVue.form
        let params = {token, password}
        thisVue.$refs[form].validate(valid => {
          if (valid) {
            thisVue.loading = true
            forgetPwd(params).then(dat => {
              let res = dat.data
              thisVue.loading = false
              if (res.status === 'success') {
                thisVue.$message({type: 'success', message: res.message})
                thisVue.active = 3
              } else if (res.status === 'fail') {
                thisVue.$message({type: 'error', message: res.message})
              }
            }).catch(_ => {
              thisVue.loading = false
            })
          }
        })
      },
      sendEmail (form) {
        let params = {account: thisVue.form.account}
        thisVue.$refs[form].validate(valid => {
          if (valid) {
            thisVue.loading = true
            forgetPwdEmail(params).then(dat => {
              let res = dat.data
              thisVue.loading = false
              if (res.status === 'success') {
                thisVue.$message({type: 'success', message: res.message})
                thisVue.is_send = true
              } else if (res.status === 'fail') {
                thisVue.$message({type: 'error', message: res.message})
              }
            }).catch(_ => {
              thisVue.loading = false
            })
          }
        })
      },
      countGo () {
        let timeInter = setInterval(() => {
          if (thisVue.timeNum === 0) {
            clearInterval(timeInter)
            thisVue.$router.push('/login')
          } else {
            thisVue.timeNum--
          }
        }, 1000)
      }
    },
    mounted () {
      thisVue = this
      thisVue.form.token = thisVue.$route.query.token
      if (thisVue.form.token) {
        thisVue.active = 2
      }
    },
    watch: {
      active: {
        handler (curVal, oldVal) {
          if (curVal === 3) {
            thisVue.countGo()
          }
        }
      }
    }
  }
</script>

<style scoped>
  .forget .nav-container{ overflow:hidden; background:#292929;border-bottom-color: rgba(255, 255, 255, 0.1);}
  .forget .logo{ height: 56px;float:left; line-height: 56px;margin-left:10px;}
  .forget .logo img{ height: 32px;}
  .forget .account{ float:right;margin-right:20px;padding-top:11px;}
  .forget .account a{ display: block; color: #999; font-size: 14px; margin: 0 8px; float: left; padding: 5px 12px; border-radius: 4px; border: 1px solid rgba(0,0,0,0);}
  .forget .account a:hover{ color:#fff;}
  .forget .account a.active{ color:#fff;border:1px solid #fff;}
  .box-card{width:788px;margin: 24px auto 0;min-height: 500px;padding-bottom:56px;border-radius: 3px;border:none;}
  .forget-head{font-size: 30px;text-align: center;color: #409eff;}
  .forget-head i{font-size: 24px; padding-right: 5px;}
  .forget-head span{ font-size: 30px;color:#999;}
  .forget .info{margin-bottom:24px; font-size: 14px; color: #999; line-height: 28px;text-align:left;}
  .forget .info span{ display:block;color:#333;font-size: 18px;}
  .form-box{width: 100%; margin: 36px 0px 20px 0px;padding: 0 215px;text-align: center;}
  .form-box .el-button{width: 100%;}
  .form-box2{ margin-top:36px;}
  .success-icon i{padding-bottom:15px;color: #07ad5b; font-size: 40px;padding-right: 10px;}
  .success_w{font-size: 26px; color: #777;line-height: 30px;color:#333;}
  .success_w strong{font-size: 16px;color:#0072ea;font-weight: normal;}
  .step-3{margin-top:98px;line-height: 20px;}
  .step-3 .reloadTip{ display:block;margin: 7px 0 0 98px;font-size:16px;color:#333;}
  .el-loading-spinner{left: 50% !important;}
  .forget .clear-b{ clear:both;}
  .forget .footer-container { margin:21px 0 64px; color:#999;}

</style>
<style>
  .forget .box-card .el-card__header{ padding:6px 0 6px; background:none;}
  .forget .el-input--small .el-input__inner{ height:40px;}
  .forget.forget-container .el-form-item__content{ text-align:left;margin-left:0 !important;}
  .forget.forget-container .el-form-item__label{ display: none;}
  .forget.forget-container .el-card__body{ padding:0;}
  .forget.forget-container .el-steps--simple{ border-radius:0;background: #f0f6fd;border-top:1px solid #cbe3ff;border-bottom:1px solid #fff;}
  .el-step__icon{ }
  .icon-envelop:before,.icon-lock:before,.icon-checkmark:before{ display:inline-block; content: '1';border-radius:50%;width:20px;height:20px;text-align:center;color: #fff;position: absolute;left: -1px;top: -9px;z-index: 1;font-weight: bold;}
  .icon-envelop:after{ display: inline-block;content: '●';border-radius: 50%;width: 20px;height: 20px;text-align: center;font-size: 47px;position: absolute;left: -6px;top: -30px;}
  .icon-lock:before{ content: '2';}
  .icon-lock:after{ display: inline-block;content: '●';border-radius: 50%;width: 20px;height: 20px;text-align: center;font-size: 47px;position: absolute;left: -6px;top: -30px;}
  .icon-checkmark:before{ content: '3';}
  .icon-checkmark:after{ display: inline-block;content: '●';border-radius: 50%;width: 20px;height: 20px;text-align: center;font-size: 47px;position: absolute;left: -6px;top: -30px;}
  .forget.forget-container .el-step__head.is-process{ color:#2974cc;}
  .forget.forget-container .el-step__title.is-process{ color:#2974cc;}
</style>
