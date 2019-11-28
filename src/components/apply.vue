<template>
  <el-row class='forget apply-container'>
      <div class="nav-container">
          <div class="account">
            <router-link :to="{'name':'login'}">{{ $t('signIn') }}</router-link>
            <a class="active" href="javascript:void(0)">{{ $t('signUp') }}</a>
          </div>
          <div class="logo">
            <img src="../../static/img/es-logo-red.svg" alt="">
            <img src="../../static/img/edgescale-logo-white.svg" alt="">
          </div>
      </div>
      <el-col>
      <el-card class="box-card" v-loading='loading' element-loading-spinner="el-icon-loading">
        <div slot="header" class="clearfix forget-head">
          <span class="apply-account">{{ $t('apply_account') }}</span>
        </div>
        <div>
          <el-form :model='form' status-icon ref='form' :rules='rules' label-width="130px" v-if='!is_send'>
            <el-form-item :label="$t('first_name')" prop="first_name">
              <el-input size='small' type='text' v-model='form.first_name' auto-complete='off'></el-input>
            </el-form-item>

            <el-form-item :label="$t('last_name')" prop='last_name'>
              <el-input size='small' type='text' v-model='form.last_name' auto-complete='off'></el-input>
            </el-form-item>

            <el-form-item :label="$t('email')" prop='email'>
              <el-input size='small' type='email' v-model='form.email' auto-complete='off'></el-input>
            </el-form-item>

            <el-form-item :label="$t('account_type')" prop='account_type_id'>
              <el-select size='small' v-model='form.account_type_id'>
                <el-option value='4' label='USER'></el-option>
                <!-- <el-option value='3' label='ODM'></el-option> -->
                <el-option value='2' label='OEM'></el-option>
              </el-select>
            </el-form-item>

            <el-form-item :label="$t('company')" prop='company_name'>
              <el-input size='small' type='text' v-model='form.company_name' auto-complete='off'></el-input>
            </el-form-item>

            <el-form-item :label="$t('telephone')" prop='telephone'>
              <el-input size='small' type='text' v-model='form.telephone' auto-complete='off'></el-input>
            </el-form-item>

            <el-form-item :label="$t('job')" prop='job_title'>
              <el-input size='small' type='text' v-model='form.job_title' auto-complete='off'></el-input>
            </el-form-item>

            <div class='send-btn'>
              <el-button type='primary' @click="sendEmail('form')">{{ $t('apply_now') }}</el-button>
            </div>
          </el-form>

          <div class="form-box step-3" v-if='is_send'>
            <span class='success-icon'><i class='icon-checkmark4'></i></span>
            <span class="success_w">{{ $t('send_email_msg') }}</span>
          </div>

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
  import { applyAccount } from '@/api'
  let thisVue = null

  export default {
    data () {
      return {
        form: {
          email: '',
          company_name: '',
          telephone: '',
          job_title: '',
          first_name: '',
          last_name: '',
          account_type_id: '4'
        },
        timeNum: 3,
        is_send: false,
        loading: false,
        rules: {
          email: [
            { required: true, message: this.$t('rule_email_require'), trigger: 'blur' },
            { min: 2, max: 255, message: 'length between 2 and 255', trigger: 'blur' },
            {pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: 'the pattern of email is not right', trigger: 'blur'}
          ],
          first_name: [
            { required: true, message: this.$t('rule_name_require'), trigger: 'blur' }
          ],
          company_name: [
            { required: true, message: this.$t('rule_company_require'), trigger: 'blur' }
          ],
          telephone: [
            { required: true, message: this.$t('rule_phone_require'), trigger: 'blur' },
            { pattern: /^[0-9]{6,11}$/, message: this.$t('rule_phone_pattern'), trigger: 'blur,change' }
          ],
          last_name: [
            { required: true, message: this.$t('rule_name_require'), trigger: 'blur' }
          ],
          account_type_id: [
            { required: true, message: this.$t('rule_account_type_require'), trigger: 'change' },
            { required: true, message: this.$t('rule_account_type_require'), trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      sendEmail (form) {
        thisVue.$refs[form].validate((valid) => {
          if (valid) {
            thisVue.loading = true
            applyAccount(thisVue.form).then(dat => {
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
      }
    },
    mounted () {
      thisVue = this
    }
  }
</script>

<style scoped>
  /*.apply-container{ width: 100%;height:100%; background: url(../../static/img/sign-up2.jpg) #fff no-repeat;background-size: cover;}*/
  .forget .nav-container{ overflow:hidden;position: fixed;top: 0;width: 100%; background:#245682;border-bottom-color: rgba(255, 255, 255, 0.1);}
  .forget .logo{ height: 56px;float:left; line-height: 56px;margin-left:10px;}
  .forget .logo img{ height: 32px;}
  .forget .account{ float:right;margin-right:20px;padding-top:11px;}
  .forget .account a{ display: block; color: #999; font-size: 14px; margin: 0 8px; float: left; padding: 5px 12px; border-radius: 4px; border: 1px solid rgba(0,0,0,0);}
  .forget .account a:hover{ color:#fff;}
  .forget .account a.active{ color:#fff;border:1px solid #fff;}
  .forget .box-card{width:788px;margin: 24px auto 0;min-height: 500px;padding-bottom:56px;border-radius: 3px;border-color:#fff;}
  .forget .apply-account{ font-size: 30px;color:#999;}
  .forget .already-container{ font-size: 14px;}
  .forget .sign-in-now{ color:#0072ea;}
  .forget .sign-in-now:hover{ text-decoration:underline;}
  .forget .already-a-member{ color:#999;}
  .forget .forget-head{ text-align:center;}
  .forget-head{font-size: 24px;text-align: left;color: #409eff;}
  .forget-head i{font-size: 24px; padding-right: 5px;}
  .info{font-size: 16px; color: #b7460c; line-height: 60px;text-align: center;white-space: nowrap;}
  .form-box{width: 80%; margin: 20px auto;text-align: center;}
  .send-btn{text-align: center;}
  .el-button{width: 100%;margin-top:6px;}
  .el-select{width: 100%;}
  .success-icon i{color: #07ad5b; font-size: 30px;padding-right: 10px;}
  .success_w{font-size: 16px; color: #777;line-height: 30px;}
  .success_w strong{font-size: 20px;}
  .step-3{line-height: 250px;}
  .el-loading-spinner{left: 50% !important;}
  .forget .clear-b{ clear:both;}
  .forget .footer-container { margin:21px 0 64px; color:#999;}
</style>
<style>
  .forget.apply-container{ height:100%;overflow-y: auto;margin-top:56px;}
  .forget.apply-container .box-card .el-card__header{ padding:27px 0 10px; background:none;border-bottom:0;}
  .forget.apply-container .el-card__body{ padding:0 156px;}
  .forget.apply-container .el-form-item__label{float: none;margin-bottom: 5px;text-align: left;font-weight: bold;line-height: 20px;}
  .forget.apply-container .el-form-item__content{ margin-left:0 !important;}
  .forget.apply-container .el-input__inner{ border-radius:0;height:40px;}
  .forget.apply-container .el-input--small{ min-width:316px;}
</style>
