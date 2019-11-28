// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueI18n from 'vue-i18n'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en'
import VCharts from 'v-charts'
import VueCookie from 'vue-cookie'

// default template css
import '../static/default/font.css'
import '../static/default/assets/css/icons/icomoon/styles.css'
import '../static/default/assets/css/bootstrap.css'
import '../static/default/assets/css/core.css'
import '../static/default/assets/css/components.css'
import '../static/default/assets/css/colors.css'
import '../static/default/assets/css/extras/animate.min.css'
import '../static/css/common.less'
import '../static/font/iconfont.css'
import '../static/font/iconfont.js'
import 'font-awesome/css/font-awesome.css'
// iconfontd Symbol
import '../static/symbolFont/iconfont.js'
import '../static/symbolFont/icon.css'
// lang
import langZh from '../static/langpack/zh'
import langEn from '../static/langpack/en'

let sessionLan = store.state.language
if (sessionStorage.getItem('language')) {
  sessionLan = sessionStorage.getItem('language')
}

// Vue.use(iView)
if (sessionLan === 'en') {
  Vue.use(ElementUI, {locale})
} else {
  Vue.use(ElementUI)
}
Vue.use(VueI18n)

// vue-charts
Vue.use(VCharts)
// vue-cookies
Vue.use(VueCookie)

Vue.config.productionTip = false

const i18n = new VueI18n({
  locale: sessionLan,
  messages: {
    'en': langEn,
    'zh': langZh
  }
})

router.beforeEach((to, from, next) => {
  let token = VueCookie.get('token')
  if (!token && to.path !== '/login' && to.path !== '/password' && to.path !== '/apply') {
    next({path: '/login'})
  } else {
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  i18n,
  router,
  store,
  template: '<App/>',
  components: { App }
})
