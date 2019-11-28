<template>
  <div>
    <o-navbar>
      <div class="top-nav" slot='top-head'>
        <span :class="{'active': service_type=='smart'}" @click="serviceNavChange('smart', 'dashboard')">{{ $t('smartConnect') }}</span>
        <span :class="{'active': service_type=='software'}" @click="serviceNavChange('software', 'software_app')">{{ $t('edgeSoftwareStore') }}</span>
        <!-- <span v-if='is_public' :class="{'active': service_type=='ai'}" @click="serviceNavChange('ai', 'zoo_model_list')">{{ $t('eIqCloud') }}</span> -->
        <span v-if='is_oem || is_admin' :class="{'active': service_type=='admin'}" @click="serviceNavChange('admin', 'manage_mirror_list')">{{ $t('admin') }}</span>
      </div>
    </o-navbar>
    <el-container class="home-container">
      <el-aside width='auto'>
        <el-menu router :default-active="defaultVal" :collapse="isCollapse" class="el-menu-vertical-demo" ref='sideBar' text-color="#aaa" active-text-color="#fff" unique-opened>
          <div class="icon-toggle-wrap">
            <i class='iconfont icon-zhankai icon-toggle' @click='collapseChange'></i>
          </div>
          <template v-if="service_type == 'smart'">
            <el-menu-item index="/">
              <i class="icon-home2"></i>
              <span slot="title" class='menu-tit'>{{ $t('dashboard') }}</span>
            </el-menu-item>
            <el-menu-item index="/customer">
              <i class="icon-users"></i>
              <span slot="title" class='menu-tit'>{{ $t('customer') }}</span>
            </el-menu-item>
            <el-submenu index="1">
              <template slot="title">
                <i class="icon-radio"></i>
                <span class='sub-tit'>{{ $t('device') }}</span>
              </template>
              <el-menu-item index="/model">{{ $t('deviceModel') }}</el-menu-item>
              <el-menu-item index="/device">{{ $t('deviceList') }}</el-menu-item>
              <el-menu-item index="/devgroup">{{ $t('deviceGroup') }}</el-menu-item>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">
                <i class="icon-inbox-alt"></i>
                <span class='sub-tit'>{{ $t('software') }}</span>
              </template>
              <el-menu-item index="/solution">{{ $t('my_solution') }}</el-menu-item>
              <el-menu-item index="/app">{{ $t('my_app') }}</el-menu-item>
              <el-menu-item index="/app_deploy">{{ $t('my_deploy') }}</el-menu-item>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title">
                <i class="icon-task"></i>
                <span class='sub-tit'>{{ $t('task') }}</span>
              </template>
              <el-menu-item index="/task">{{ $t('taskList') }}</el-menu-item>
              <el-menu-item index="/task_template">{{ $t('taskTemplate') }}</el-menu-item>
            </el-submenu>
            <el-submenu index="4" v-if='is_public'>
              <template slot="title">
                <i class="icon-cog2"></i>
                <span class='sub-tit'>{{ $t('manufacture') }}</span>
              </template>
              <el-menu-item index="/keyman">{{ $t('key_management') }}</el-menu-item>
              <el-menu-item index="/fuse">{{ $t('fuse_management') }}</el-menu-item>
              <el-menu-item index="/mft">{{ $t('device_prevision') }}</el-menu-item>
            </el-submenu>
          </template>

          <template  v-if="service_type == 'software'">
            <el-menu-item index="/software_app">
              <i class="icon-store"></i>
              <span slot="title" class='menu-tit'>{{ $t('appStore') }}</span>
            </el-menu-item>
            <el-menu-item index="/software_solution">
              <i class="icon-store2"></i>
              <span slot="title" class='menu-tit'>{{ $t('solutionStore') }}</span>
            </el-menu-item>
            <el-menu-item index="/builder" v-if='is_public'>
              <i class="iconfont icon-deployment"></i>
              <span slot="title" class='menu-tit'>{{ $t('builder') }}</span>
            </el-menu-item>
          </template>

          <template  v-if="service_type == 'ai'">
            <el-menu-item index="/zoo_model"><i class="icon-home5"></i><span slot="title" class='sub-tit'> {{ $t('marketplace') }}</span></el-menu-item>
            <el-menu-item index="/zoo_data"><i class="icon-database-menu"></i><span slot="title" class='sub-tit'> {{ $t('my_dataset') }}</span></el-menu-item>
            <el-menu-item index="/zoo"><i class="icon-home5"></i><span slot="title" class='sub-tit'> {{ $t('my_model') }}</span></el-menu-item>
            <el-menu-item index="/zooApp"><i class="icon-floppy-disks"></i><span slot="title" class='sub-tit'> {{ $t('my_app') }}</span></el-menu-item>
            <el-menu-item index="/zoo_solution" v-if="is_admin"><i class="icon-alarm"></i><span slot="title" class='sub-tit'> {{ $t('solution') }}</span></el-menu-item>
            <el-menu-item index="/zoo_engine" v-if="is_admin"><i class="icon-steering-wheel"></i><span slot="title" class='sub-tit'> {{ $t('engine') }}</span></el-menu-item>
            <el-menu-item index="/zoo_device" v-if="is_admin"><i class="icon-steering-wheel"></i><span slot="title" class='sub-tit'> {{ $t('device') }}</span></el-menu-item>
            <el-menu-item index="/zoo_distro" v-if="is_admin"><i class="icon-steering-wheel"></i><span slot="title" class='sub-tit'> {{ $t('distro') }}</span></el-menu-item>
            <el-menu-item index=''><a href="http://devops.nxp.com/eIQ/html/index.html" target='_blank'><i class="icon-file-text2"></i><span slot="title" class='sub-tit'> {{ $t('document') }}</span></a></el-menu-item>
          </template>

          <template  v-if="service_type == 'admin'">
            <el-menu-item index="/manage_mirror" v-if="is_oem || is_admin"><i class="icon-puzzle"></i><span slot='title' class='menu-tit'> {{ $t('dockerRegistry') }}</span></el-menu-item>

            <el-submenu index="5" v-if="is_admin">
              <template slot="title">
                <i class="icon-user"></i>
                <span class='sub-tit'>{{ $t('account') }}</span>
              </template>
              <el-menu-item index="/manage_user">{{ $t('account_list') }}</el-menu-item>
              <el-menu-item index="/auth">{{ $t('accountAudit') }}</el-menu-item>
            </el-submenu>

            <el-menu-item index="/manage_vendor" v-if="is_admin"><i class="icon-users2"></i><span slot='title' class='menu-tit'> {{ $t('vendor') }}</span></el-menu-item>

            <el-menu-item index="/common_audit" v-if="is_admin"><i class="icon-cart"></i><span slot='title' class='menu-tit'> {{ $t('audit') }}</span></el-menu-item>
            
            <el-menu-item index="/manage_user/config" v-if="(is_oem || is_admin) && is_public"><i class="icon-cog52"></i><span slot='title' class='menu-tit'> {{ $t('endpointConfig') }}</span></el-menu-item>

            <el-menu-item index="/api_usage" v-if="is_admin && is_public"><i class="icon-stats-growth"></i><span slot='title' class='menu-tit'> {{ $t('apiStatistics') }}</span></el-menu-item>
          </template>
        </el-menu>
      </el-aside>
      <el-main ref='comHeight' class='main-box'>
        <o-page-header></o-page-header>
        <div class="content-box">
          <router-view></router-view>
          <div class="footer-bar">
            &copy; 2017-2019<a href="/"> {{ $t('semiconductors') }}</a>. {{ $t('rights') }}.
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>


<script>
  import oPageHeader from './pageHeader.vue'
  import oNavbar from './navbar.vue'
  import startPage from './startPage.vue'

  let thisVue = null

  export default {
    components: { oPageHeader, oNavbar, startPage },
    data: function () {
      return {
        defaultVal: '/',
        isCollapse: false,
        service_type: 'smart'
      }
    },
    computed: {
      is_admin () {
        return this.$store.state.userPermission.is_admin
      },
      is_oem () {
        if (this.$store.state.account_type === 'OEM') {
          return true
        } else {
          return false
        }
      },
      is_public () {
        if (this.$store.state.env === 'public') {
          return true
        } else {
          return false
        }
      }
    },
    methods: {
      serviceNavChange (type, url) {
        thisVue.service_type = type
        thisVue.$router.push({name: url})
        sessionStorage.setItem('service_type', type)
      },
      collapseChange () {
        thisVue.isCollapse = !thisVue.isCollapse
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        thisVue = this
        let screenHeight = document.documentElement.clientHeight
        thisVue.$refs.sideBar.$el.style.height = screenHeight + 'px'
        thisVue.$refs.comHeight.$el.style.height = screenHeight + 'px'
        window.onresize = () => {
          screenHeight = document.documentElement.clientHeight
          thisVue.$refs.sideBar.$el.style.height = screenHeight + 'px'
          thisVue.$refs.comHeight.$el.style.height = screenHeight + 'px'
        }
        if (sessionStorage.getItem('service_type')) {
          thisVue.service_type = sessionStorage.getItem('service_type')
        }
      })
    }
  }
</script>