<template>
  <div class="login-container login-covers">
    <div class="nav-container">
      <div class="account">
        <a href="javascript:void(0)" class="active">{{$t('signIn')}}</a>
        <router-link :to="{'name':'apply'}">{{$t('signUp')}}</router-link>
      </div>
      <div class="logo">
        <img src="../../static/img/es-logo-red.svg" alt="">
        <img src="../../static/img/edgescale-logo-white.svg" alt="">
      </div>
    </div>

    <!-- Page container -->
    <div class="page-container">

      <!-- Page content -->
      <div class="page-content">

        <!-- Main content -->
        <div class="content-wrapper">

          <!-- Content area -->
          <div class="content pb-20">
            <el-form  :model="formLogin" :rules="ruleLogin" ref="formLogin">

              <div class="line">
                <i class="lineL"></i>
                <i class="lineR"></i>
              </div>
              <div class="panel panel-body login-form">
                <img src="../../static/img/logo.png" class='hide' alt="Login logo"
                     style="width: 30%;height: 30%;">
                <div class="text-center">

                  <div class="icon-object border-slate-300 text-slate-300">
                    <i class="icon-reading"></i>
                  </div>

                  <h5 class="content-group">{{$t('login')}}
                  </h5>
                </div>

                <div class="form-group has-feedback has-feedback-left">
                  <el-form-item  prop="username">
                    <el-input v-model="formLogin.username"  :placeholder="$t('username')" id='username'></el-input>
                  </el-form-item>
                  <div class="form-control-feedback">
                    <i class="icon-user text-muted"></i>
                  </div>
                </div>

                <div class="form-group has-feedback has-feedback-left">
                  <el-form-item  prop="password">
                    <el-input v-model="formLogin.password" type='password' class='password-input' :placeholder="$t('password')" @keyup.13.native="loginSubmit('formLogin')"></el-input>
                  </el-form-item>
                  <div class="form-control-feedback">
                    <i class="icon-lock2 text-muted"></i>
                  </div>
                </div>

                <div class="form-group">
                  <el-button class="btn btn-primary btn-block" :loading="loading" @click="loginSubmit('formLogin')">
                    {{$t('signIn')}}
                    <i class="icon-circle-right2 position-right"></i>
                  </el-button>
                </div>

                <div class="text-left forget-bor">
                  <router-link :to="{'name': 'password'}"> {{$t('forgot')}} </router-link>
                </div>
                <div class="text-left">
                  <router-link :to="{'name': 'apply'}">{{$t('noAccount')}}</router-link>
                </div>
              </div>
            </el-form >

            <!-- Footer -->
            <div class="footer text-muted text-center" style="color:#fff">
              &copy; 2017-2019<a href="http://portal.edgescale.org" style="color:#ffec22"> {{$t('semiconductors')}}</a>. {{$t('rights')}}.
            </div>
            <!-- /footer -->

          </div>
          <!-- /content area -->

        </div>
        <!-- /main content -->

      </div>
      <!-- /page content -->

    </div>
    <!-- /page container -->

  </div>
</template>

<script>
  import { loginApi } from '@/api'

  let thisVue = null
  export default {
    data () {
      return {
        loading: false,
        formLogin: {
          username: '',
          password: ''
        },
        ruleLogin: {
          username: [
            {required: true, message: 'username is required', trigger: 'change'}
          ],
          password: [
            {required: true, message: 'password is required', trigger: 'change'}
          ]
        }
      }
    },
    methods: {
      loginSubmit (formName) {
        thisVue.$refs[formName].validate((valid) => {
          if (valid) {
            thisVue.loading = true
            loginApi(thisVue.formLogin).then(dat => {
              let res = dat.data
              thisVue.loading = false
              if (res.status === 'fail') {
                thisVue.$message({type: 'error', message: res.message})
              } else {
                thisVue.$cookie.set('token', res.token, { expires: '20h' })
                thisVue.$cookie.set('username', thisVue.formLogin.username, { expires: '20h' })
                thisVue.$message({message: thisVue.$t('login_success'), type: 'success'})
                thisVue.$router.push('/')
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
<style scoped="">
  .login-container .nav-container{ overflow:hidden; background:#000;border-bottom: 1px solid #545454}
  .login-container .logo{ height: 56px;float:left; line-height: 56px;margin-left:10px;}
  .login-container .logo img{ height: 32px;}
  .login-container .account{ float:right;margin-right:20px;padding-top:11px;}
  .login-container .account a{ display: block; color: #999; font-size: 14px; margin: 0 8px; float: left; padding: 5px 12px; border-radius: 4px; border: 1px solid rgba(0,0,0,0);}
  .login-container .account a:hover{color:#fff;}
  .login-container .account a.active{ color:#fff;border:1px solid #fff;}
  .login-container{
    width: 100%;
    height: 100%;
    background: url(../../static/img/login/background51.jpg) no-repeat;
    background-size: cover;
    color: #fff;
  }
  form {
    position: absolute;
    top: 104px;
    left: 50%;
    transform:translate(-50%,0);
  }
  form::before{ content: '';display:block;height:4px;width:100%;
    background-image:
    linear-gradient(
      to right,
      red,
      #f06d06,
      rgb(255, 255, 0),
      green
    );
    margin-bottom:-1px;
  }
  form h5{ margin:10px 0 29px 0 !important;}
  .hide {
    display: none;
  }
  .forget-bor{
    border-bottom: 1px solid #ddd;
    line-height: 36px;
    margin-bottom: 10px;
  }
  form .panel{background: rgba(33, 150, 243,0.1);border:1px solid rgba(255,255,255,0.16) !important;border-radius:0;box-shadow: 0px 0px 5px rgba(0,0,0,0.5);
    border-bottom-left-radius:6px;
    border-bottom-right-radius:6px;}
  .icon-object{ color: #fff !important;border-width:2px;}
  .border-slate-300{ border-color: #fff !important;}
  form .content-group{ font-size:21px;}
  .content-group,.content-group .display-block{ color:#fff;}
  .forget-bor a{ color:#fff;}
  .panel .text-left,.panel .text-left a{ color:#fff;font-size:14px;}
  form .btn{ font-size:14px;padding: 8px 0;}
  form .text-left a:hover{ text-decoration:underline;}
  form .panel-body{ padding:29px 47px 35px;}
  form .line{ position: relative;top: 153px;padding: 0 50px;}
  form .lineL,form .lineR{ display: block;width: 35%;border-top: 1px solid rgb(255, 255, 255);}
  form .lineR{ float: right;margin-top:-1px;}
  form input.el-input__inner{ background-color:rgba(255,255,255,0.2) !important;}

  .el-form .btn-primary{ color: #fff;background-color: #2196f3;border-color: #2196f3;}
  .el-form .btn-primary:focus, .el-form .btn-primary:hover{ color: #fff;background-color: #1f8ee7;border-color: #2196f3;}
</style>
