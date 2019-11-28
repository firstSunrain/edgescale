<template>
  <div class=''>
    <div class='frame-banner'>
      <div class='dash-item dash-item1' :class="{'active': activeName=='dev'}" @click="activeName='dev'" style="z-index: 4;"><span>{{ $t('dash_dev_statistics') }}</span></div>
      <div class='dash-item dash-item2' :class="{'active': activeName=='app'}" @click="activeName='app'" style="z-index: 3;"><span>{{ $t('dash_app_statistics') }}</span></div>
      <div class='dash-item dash-item3' :class="{'active': activeName=='solution'}" @click="activeName='solution'" style="z-index: 2;"><span>{{ $t('dash_solution_statistics') }}</span></div>
    </div>

    <div class='frame-box frame-con'>
      <devDashboard v-if="activeName=='dev'"></devDashboard>
      <appSts v-if="activeName=='app'"></appSts>
      <solutionSts v-if="activeName=='solution'"></solutionSts>
    </div>
  </div>
</template>
<script>
  import devDashboard from './Dashboard'
  import appSts from './appSts'
  import solutionSts from './solutionSts'
  // let thisVue = null
  export default {
    components: { devDashboard, appSts, solutionSts },
    data () {
      return {
        activeName: 'dev'
      }
    },
    methods: {
      handleTabClick (val) {
        console.log(val)
      }
    },
    mounted () {
      // thisVue = this
    }
  }
</script>
<style scoped>
  
</style>
