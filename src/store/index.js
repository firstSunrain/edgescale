import Vue from 'vue'
import Vuex from 'vuex'
import { getPermission, getSelfUser } from '@/api'

import {
  SET_PAGE_HEADER_DATA,
  SET_IS_HIDDEN_MENU
} from './pageHeader'

import {
  GET_USER_PERMISSION,
  GET_USER_INFO,
  GET_USER_TYPE,
  SET_WEB_LANGUAGE
} from './mutations'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    pageHeaderData: '',
    isHiddenMenu: true,
    userPermission: {},
    userInfo: {},
    account_type: '',
    language: 'en',
    env: 'public'  // public or private
  },
  actions: {
    setPageHeaderData ({ commit }, pageHeaderData) {
      commit(SET_PAGE_HEADER_DATA, { pageHeaderData })
    },
    setIsHiddenMenu ({ commit }, isHiddenMenu) {
      commit(SET_IS_HIDDEN_MENU, { isHiddenMenu })
    },
    getUserPermission ({commit, state}) {
      getPermission().then(dat => {
        let res = dat.data
        if (res) {
          commit(GET_USER_PERMISSION, res)
          commit(GET_USER_TYPE, res.account_type.name)
        }
      }).catch(_ => {
        return false
      })
    },
    getUserInfo ({commit, state}) {
      getSelfUser().then(dat => {
        let res = dat.data
        if (res) {
          commit(GET_USER_INFO, res)
        }
      }).catch(_ => {
        return false
      })
    },
    setWebLanguage ({commit, state}, webLanguage) {
      commit(SET_WEB_LANGUAGE, {webLanguage})
    }
  },
  mutations: {
    [SET_PAGE_HEADER_DATA] (state, {pageHeaderData}) {
      state.pageHeaderData = pageHeaderData
    },
    [SET_IS_HIDDEN_MENU] (state, {isHiddenMenu}) {
      state.isHiddenMenu = isHiddenMenu
    },
    [SET_WEB_LANGUAGE] (state, {webLanguage}) {
      state.language = webLanguage.lan
      webLanguage.curVue.$i18n.locale = state.language
    },
    [GET_USER_TYPE] (state, res) {
      state.account_type = res
    },
    [GET_USER_PERMISSION] (state, res) {
      state.userPermission = res
    },
    [GET_USER_INFO] (state, res) {
      state.userInfo = res
    }
  }
})
