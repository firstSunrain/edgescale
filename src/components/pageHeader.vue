<template>
  <div class="page-header page-header-default">
    <div class="breadcrumb-line">
      <ul class="breadcrumb">
        <li>
          <router-link :to="{name:'dashboard'}"><i class="icon-home2 position-left"></i> {{$t('nav_home')}}</router-link>
        </li>
        <li>
          <router-link :to="{path: routeName}">{{ firstTit }}</router-link>
        </li>
        <li class="active" v-if='secondTit'>{{ secondTit }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
let thisVue = null
export default {
  data () {
    return {
      firstTit: '',
      secondTit: '',
      routeName: ''
    }
  },
  methods: {
    getTitCon (rot) {
      let curPath = rot.path.split('/')[1]
      let pathName = rot.path.split('/')[2]
      thisVue.routeName = '/' + curPath
      if (curPath === '') {
        thisVue.firstTit = thisVue.$t('all_view')
      } else {
        thisVue.firstTit = thisVue.$t(curPath)
      }
      if (pathName) {
        thisVue.secondTit = thisVue.$t(pathName)
      } else if (curPath !== '') {
        thisVue.secondTit = thisVue.$t('list')
      } else {
        thisVue.secondTit = ''
      }
    }
  },
  computed: {
    pageHeaderData () {
      return this.$store.state.pageHeaderData
    }
  },
  mounted () {
    thisVue = this
    thisVue.getTitCon(thisVue.$route)
  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        thisVue.getTitCon(val)
      },
      deep: true
    }
  }
}
</script>
<style scoped>
  .breadcrumb-line:first-child{
    border-bottom: 0px !important;
  }
  .breadcrumb{
    line-height: 30px;
  }
</style>
