import Vue from 'vue'
import $ from 'jquery'
import Cookie from './cookie'

var config = require('../../config')

const vm = new Vue()
const Common = {
  buildBasePath: config.build.assetsPublicPath,
  // apiV1Prefix: 'https://dev.api.edgescale.org/v1', //dev
  apiV1Prefix: 'https://test.api.edgescale.org/v1',  //test
  // apiV1Prefix: 'https://api.edgescale.org/v1',  //console
  apiSignPrefix: 'https://s3.edgescale.org/sign',
  wrapperAjax: function (a, b) {
    $.ajaxSetup({
      beforeSend: function (xhr) {
      }
    })
    $.ajax(a, b)
  },
  wrapperTokenAjax: function (a, isLoading) {
    isLoading = isLoading || false
    var token = Cookie.getCookie('token')
    if (token) {
      $.ajaxSetup({
        beforeSend: function (xhr) {
          if (isLoading) {
            $('#loadingdiv').show()
          }
          xhr.setRequestHeader('Accept', 'application/json')
          xhr.setRequestHeader('dcca_token', token)
        },
        complete: function () {
          if (isLoading) {
            $('#loadingdiv').hide()
          }
        },
        error: function (jqXHR, textStatus, errorMsg) {
          if (jqXHR.status === 504) return
          vm.$notify.error({
            title: 'Error',
            message: jqXHR.responseJSON.message
          })
        }
      })
      $.ajax(a, isLoading)
    }
  },
  setPageHeaderData: function (thisVue, pageHeaderData) {
    thisVue.$store.dispatch('setPageHeaderData', pageHeaderData)
  },
  setIsHiddenMenu: function (thisVue, isHiddenMenu) {
    thisVue.$store.dispatch('setIsHiddenMenu', isHiddenMenu)
  },
  getIsHiddenMenu: function (thisVue) {
    return thisVue.$store.state.isHiddenMenu
  },
  // deploy apps
  setAppsDeployDevicesData: function (thisVue, appsDeployDevicesData) {
    thisVue.$store.dispatch('setAppsDeployDevicesData', appsDeployDevicesData)
  },
  getAppsDeployDevicesData: function (thisVue) {
    return thisVue.$store.state.appsDeployDevicesData
  },
  setAppsDeployAppsData: function (thisVue, appsDeployAppsData) {
    thisVue.$store.dispatch('setAppsDeployAppsData', appsDeployAppsData)
  },
  getAppsDeployAppsData: function (thisVue) {
    return thisVue.$store.state.appsDeployAppsData
  },
  setAppsDeployConfigData: function (thisVue, appsDeployConfigData) {
    thisVue.$store.dispatch('setAppsDeployConfigData', appsDeployConfigData)
  },
  getAppsDeployConfigData: function (thisVue) {
    return thisVue.$store.state.appsDeployConfigData
  },
  setAppsDeployContainersData: function (thisVue, appsDeployContainersData) {
    thisVue.$store.dispatch('setAppsDeployContainersData', appsDeployContainersData)
  },
  getAppsDeployContainersData: function (thisVue) {
    return thisVue.$store.state.appsDeployContainersData
  },
  setAppsDeployStepActiveNumber: function (thisVue, appsDeployStepActiveNumber) {
    thisVue.$store.dispatch('setAppsDeployStepActiveNumber', appsDeployStepActiveNumber)
  },
  getAppsDeployStepActiveNumber: function (thisVue) {
    return thisVue.$store.state.appsDeployStepActiveNumber
  },
  // deploy apps
  setSolutionsDeployDevicesData: function (thisVue, solutionsDeployDevicesData) {
    thisVue.$store.dispatch('setSolutionsDeployDevicesData', solutionsDeployDevicesData)
  },
  getSolutionsDeployDevicesData: function (thisVue) {
    return thisVue.$store.state.solutionsDeployDevicesData
  },
  setSolutionsDeployMidArr: function (thisVue, solutionsDeployMidArr) {
    thisVue.$store.dispatch('setSolutionsDeployMidArr', solutionsDeployMidArr)
  },
  getSolutionsDeployMidArr: function (thisVue) {
    return thisVue.$store.state.solutionsDeployMidArr
  },
  setSolutionsDeployStepActiveNumber: function (thisVue, solutionsDeployStepActiveNumber) {
    // set
    thisVue.$store.dispatch('setSolutionsDeployStepActiveNumber', solutionsDeployStepActiveNumber)
  },
  getSolutionsDeployStepActiveNumber: function (thisVue) {
    return thisVue.$store.state.solutionsDeployStepActiveNumber
  },
  myAlert: function (info, type, title, timeout) {
    vm.$notify({
      title: title,
      message: info,
      type: type
    })
  },
  jsonClone: function (x) {
    return JSON.parse(JSON.stringify(x))
  },
  formatCurrency: function(num) {
    num = num.toString().replace(/\$|\,/g, '');
    if(isNaN(num)){
      num = "0";
    }
    let sign = (num == (num = Math.abs(num)));
    num = Math.floor(num * 100 + 0.50000000001);
    let cents = num % 100;
    num = Math.floor(num / 100).toString();
    if(cents < 10){
      cents = "0" + cents;
    }
    for(var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++){
      num = num.substring(0, num.length - (4 * i + 3)) + ',' +
      num.substring(num.length - (4 * i + 3));
    }
    return('$' + ((sign) ? '' : '-') + num + '.' + cents);
  }
}

export default Common

