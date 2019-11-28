<template name="startPage">
  <div ref='startPage' style='overflow-y: auto;overflow-x: hidden;'>
    <o-navbar>
      <div class="top-nav" slot='top-head'>
        &nbsp; 
      </div>
    </o-navbar>
    <div class="start-box">
      <div class="row guide-box">
        <div class='banner-guide'>
          <h1 class="service-title ng-scope" style="border-bottom: none;" translate="FIRST_RUN.API_GATEWAY_TITLE">
            {{ $t('start_p1') }}
          </h1>
          <h2 translate="FIRST_RUN.API_GATEWAY_SUBTITLE_DESCRIPTION" class="ng-scope">{{ $t('start_p2') }}</h2>
          <router-link :to="{ name: 'device_list'}" class="banner-btn-link">{{ $t('get_start') }} >></router-link>
          <a href="https://doc.edgescale.org" target="_blank" class="banner-btn-link">{{ $t('see_more') }} >></a>
        </div>
      </div>
      <div class="user-flow">
        <div class="step-box">
          <div class='icon-step-box'><div class='icon-step'><svg class="icon svg-icon" aria-hidden="true"><use xlink:href="#icon-icon_fuzaguanxiwangluo"></use></svg></div></div>
          <div class="step-con">
            <router-link :to="{ name: 'model_list'}"><div class='step-con-tit'>{{ $t('model') }}</div></router-link>
            <p>{{ $t('start_model') }}</p>
          </div>
        </div>
        <span class='step-arrow'><i class="icon-arrow-right7"></i></span>
        <div class="step-box">
          <div class='icon-step-box'><div class='icon-step'><svg class="icon svg-icon" aria-hidden="true"><use xlink:href="#icon-icon_shebeizhiwen"></use></svg></div></div>
          <div class="step-con">
            <router-link :to="{ name: 'device_list'}"><div class='step-con-tit'>{{ $t('device') }}</div></router-link>
            <p>{{ $t('start_dev') }}</p>
          </div>
        </div>
        <span class='step-arrow'><i class="icon-arrow-up-right3 two"></i><br/><i class="icon-arrow-down-right3 two"></i></span>
        <div class="user-flow-2">
          <div>
            <div class="step-box">
              <div class='icon-step-box'><div class='icon-step'><svg class="icon svg-icon" aria-hidden="true"><use xlink:href="#icon-icon_shanghupingji"></use></svg></div></div>
              <div class="step-con">
                <router-link :to="{ name: 'solution_list'}"><div class='step-con-tit'>{{ $t('solution') }}</div></router-link>
                <p>{{ $t('start_solution') }}</p>
              </div>
            </div>
            <div class='step-arrow'><i class="icon-arrow-right7"></i></div>
            <div class="step-box">
              <div class='icon-step-box'><div class='icon-step'><svg class="icon svg-icon" aria-hidden="true"><use xlink:href="#icon-icon_renzhengfuwu"></use></svg></div></div>
              <div class="step-con">
                <router-link :to="{ name: 'solution_list'}"><div class='step-con-tit'>{{ $t('deploy_solution') }}</div></router-link>
                <p>{{ $t('start_solution_deploy') }}</p>
              </div>
            </div>
          </div>
          <div>
            <div class="step-box">
              <div class='icon-step-box'><div class='icon-step'><svg class="icon svg-icon" aria-hidden="true"><use xlink:href="#icon-icon_LBSjiankong"></use></svg></div></div>
              <div class="step-con">
                <router-link :to="{ name: 'app_list'}"><div class='step-con-tit'>{{ $t('app') }}</div></router-link>
                <p>{{ $t('start_app') }}</p>
              </div>
            </div>
            <div class='step-arrow'><i class="icon-arrow-right7"></i></div>
            <div class="step-box">
              <div class='icon-step-box'><div class='icon-step'><svg class="icon svg-icon" aria-hidden="true"><use xlink:href="#icon-icon_jingzhungaoxiaoshibie"></use></svg></div></div>
              <div class="step-con">
                <router-link :to="{ name: 'app_list'}"><div class='step-con-tit'>{{ $t('deploy_app') }}</div></router-link>
                <p>{{ $t('start_app_deploy') }}</p>
              </div>
            </div>
          </div>
        </div>
        <span class='step-arrow'><i class="icon-arrow-down-right3 two"></i><br/><i class="icon-arrow-up-right3 two"></i></span>
        <div class="step-box">
          <div class='icon-step-box'><div class='icon-step'><svg class="icon svg-icon" aria-hidden="true"><use xlink:href="#icon-icon_jianquanfuwu"></use></svg></div></div>
          <div class="step-con">
            <router-link :to="{ name: 'task_list'}"><div class='step-con-tit'>{{ $t('task') }}</div></router-link>
            <p>{{ $t('start_task') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import oNavbar from './navbar.vue'
  export default {
    components: { oNavbar },
    data () {
      return {
      }
    },
    methods: {
    },
    mounted: function () {
      this.$refs.startPage.style.height = document.documentElement.offsetHeight + 'px'
    }
  }
</script>
<style scoped>
  .fl{float: left;width: 50%;}
  .user-flow-2{display: inline-block;vertical-align: middle;}
  .step-box{margin: 20px 0px; display: inline-block; height: 200px; padding: 10px 5px; vertical-align: middle; border: 1px dashed #48bff9;}
  .step-box .icon{width: 3rem; height: 3rem;}
  .icon-step{border: 1px dashed #46aaff;padding: 6px;border-radius: 50%;}
  .icon-step-box{border: 1px solid #46aaff;padding: 6px;border-radius: 50%;position: relative;}
  .step-con{padding-left: 10px;}
  .step-con-tit{font-size: 1.6rem;padding: 10px 0px;}
  .step-con p{color: #5d82a2; font-size: 1.5rem;width: 160px;display: inline-block;}
  .step-arrow{vertical-align: middle;display: inline-block;}
  .step-arrow i{color: #1e88e5;padding: 0px 20px;}
  .step-arrow i.two{padding: 60px 20px;}
  .guide-box{
    padding: 20px 0;
    text-align: center;
    background: -webkit-linear-gradient(#e8e8e8, #fff); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(#e8e8e8, #fff); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(#e8e8e8, #fff); /* Firefox 3.6 - 15 */
    background: linear-gradient(#e8e8e8, #fff); /* 标准的语法 */
  }
  .banner-btn-link{
    font-size: 1.4rem;
    color: #245682;
    margin: 0px 10px;
    padding: 5px 10px;
    border: 1px dashed rgba(36, 86, 130, 0.5);
  }
  .banner-btn-link:hover{
    background-color: #245682;
    color: #fff;
  }
  .user-flow{
    text-align: center;
    clear: both;
  }
  .banner-guide{
    width: 60%;
    margin: 20px auto;
  }
  .guide-box h1 {
    font-size: 3rem;
    font-weight: 500;
    color: #444;
  }
  .guide-box h2 {
    width: 80%;
    margin: 20px auto;
    font-size: 1.6rem;
    padding-bottom: 20px;
    color: #2e5475;
    line-height: 24px;
  }
  .start-box{
    width: 70%;
    min-width: 1190px;
    margin: 0 auto;
    background-color: #fff;
    min-height: 100%;
    height: auto;
    overflow: hidden;
  }
</style>


