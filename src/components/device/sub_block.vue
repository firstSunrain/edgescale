<template>
  <div class='block-card block-card-container'>
    <el-row :gutter='20'>
      <el-col :span='24' class='box-card-container col-bottom' v-for="(value, key) in list" :key='key'>
        <el-form :model='form' ref='form' size='mini' label-width='100px'>
          <el-card class="box-card">
          <div slot="header" class="header-link">
            <a>{{value.name}}</a>
          </div>
          <ul class='card-ota'>
            <div class="card-ul-box">
              <ul class="card-ul-inner card-ul-input card-ul-tit">
                <li class="action-box-tit">{{ $t('basic_info') }}</li>
              </ul>
              <ul class="card-ul-inner card-ul-input">
                <li>
                  <div class="block-type">{{ $t('name') }}</div>
                  <div class="block-w con-wrap">{{value.name}}</div>
                </li>
                <li>
                  <div class="block-type">{{ $t('model') }}</div>
                  <div class="block-w con-wrap">{{value.model}}</div>
                </li>
              </ul>
              <ul class="card-ul-inner card-ul-input">
                <li>
                  <div class="block-type">{{ $t('upper_create_time') }}</div>
                  <div class="block-w">{{value.update_time | dateFormat}}</div>
                </li>
                <li>
                  <div class="block-type">{{ $t('upper_update_time') }}</div>
                  <div class="block-w">{{value.create_time | dateFormat}}</div>
                </li>
              </ul>
            </div>
            <div class="card-ul-box" v-if='moreAttr == key'>
              <ul class="card-ul-inner card-ul-input card-ul-tit">
                <li class="action-box-tit">{{ $t('attribute') }}</li>
              </ul>
              <ul class="card-ul-inner card-ul-input dashed">
                <li class="action-box-power" v-for="(item, index) in attributes" :key='index'>
                  <div class="block-type">
                    <span>{{ item.name }}</span>
                    <span class='attr-edit'>
                      <i class="icon-pencil4" v-if='!isEdit[index]' @click="canEdit('attr', index)"></i>
                      <i class="icon-exit" v-else @click="updateAttr(value.id, index)"></i>
                    </span>
                  </div>
                  <div class="block-w con-wrap">
                    <template v-if='item.value_list && item.value_list.length'>
                      <el-select size='small' v-if='isEdit[index]' v-model="form[item.name]">
                        <el-option v-for="(item, index) in item.value_list" :value="item" :label="`${item}`" :key="`${item.name}${index}`"></el-option>
                      </el-select>
                      <span v-else>{{item.value}}</span>
                    </template>
                    <template v-else>
                      <span>{{ item.value }}</span>
                    </template>
                    <span class="tip"> ( {{item.note}} ) </span>
                  </div>
                </li>
              </ul>
              <ul class="card-ul-inner card-ul-input">
                <li>
                  <div class="block-type">
                    <span>{{ $t('name') }}</span>
                    <span class='attr-edit'>
                      <i class="icon-pencil4" v-if='!isEditOta' @click="canEdit('ota')"></i>
                      <i class="icon-exit" v-else @click="changeOta(value.id)"></i>
                    </span>
                  </div>
                  <div class="block-w">
                    <el-select size='small' v-model='otaForm.firmware' v-if='isEditOta && firmwares.length'>
                      <el-option v-for='(item, key) in firmwares' :key='key' :value="item.id" :label="item.solution"></el-option>
                      <a class='get-more' @click='getFirmwares(value.model_id)'>{{ $t('more') }}...</a>
                    </el-select>
                    <span v-else>{{ ota.name }}</span>
                  </div>
                </li>
                <li>
                  <div class="block-type">{{ $t('version') }}</div>
                  <div class="block-w con-wrap"> {{ ota.version }}&nbsp; </div>
                </li>
                <li>
                  <div class="block-type">{{ $t('create_time') }}</div>
                  <div class="block-w con-wrap">{{ ota.create_time | dateFormat }}</div>
                </li>
                <li>
                  <div class="block-type">{{ $t('update_time') }}</div>
                  <div class="block-w con-wrap">{{ ota.update_time | dateFormat }}</div>
                </li>
              </ul>
            </div>
            <div @click='getAttr(value, key)' class='more-attr'>Get Attributes... <i class="icon-arrow-down15"></i></div>
          </ul>
          <div class="card-opr-container">
            <el-dropdown class='card-opr' trigger='click' placement='right'>
              <span class="el-dropdown-link" style="display: none;"><i class="iconfont icon-gengduo"></i></span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item><div @click="edit(key)"><i class='icon-pencil7'></i> {{ $t('edit') }} </div></el-dropdown-item>
                <el-dropdown-item><div @click="del(key)"><i class='icon-bin'></i> {{ $t('delete') }}</div></el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-card>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  let thisVue = null
  export default {
    props: ['list', 'attributes', 'ota', 'firmwares', 'isEdit', 'isEditOta', 'form', 'otaForm'],
    data () {
      return {
        moreAttr: null
      }
    },
    filters: {
      dateFormat (val) {
        if (val) {
          let _date = new Date(val.toString())
          let y = _date.getFullYear()
          let m = _date.getMonth() + 1
          let d = _date.getDate()
          let h = _date.getHours() >= 10 ? _date.getHours() : `0${_date.getHours()}`
          let mm = _date.getMinutes() >= 10 ? _date.getMinutes() : `0${_date.getMinutes()}`
          let s = _date.getSeconds() >= 10 ? _date.getSeconds() : `0${_date.getSeconds()}`
          return `${y}-${m}-${d} ${h}:${mm}:${s}`
        } else {
          return ''
        }
      }
    },
    methods: {
      edit (index) {
        thisVue.$emit('eidtSubDev', index)
      },
      del (key) {
        thisVue.$emit('delSubDev', key)
      },
      canEdit (type, key) {
        thisVue.$emit('canEdit', type, key)
      },
      updateAttr (id, index) {
        thisVue.$emit('updateAttr', id, index)
      },
      changeOta (id) {
        thisVue.$emit('changeOta', id)
      },
      getAttr (val, key) {
        thisVue.$emit('getAttr', val)
        thisVue.moreAttr = key
      }
    },
    mounted () {
      thisVue = this
    }
  }
</script>
<style scoped>
  .more-attr{font-size: 1.5rem;text-align: center;margin: 10px 0px;color: #245682;cursor: pointer;}
  .attr-edit i{padding-left: 20px;font-size: 1.3rem;cursor: pointer;}
  .card-ota{padding: 0px;margin: 0px;height: auto;overflow: hidden;}
  .card-ota li{display: inline-block;width: 49%;}
  .block-card-container{ }
  .block-card-container .card-ul-box{ margin:0 0 10px;padding: 13px 20px; background: #fff;border-radius: 3px;}
  .block-card-container .card-ul-input{ padding: 10px 0 0px 0;}
  .block-card-container .block-w{ margin-left: 15px;height: auto; padding-right: 30px;}
  .block-card-container .block-w .ota-select{ margin-top:3px;}
  .block-card-container .card-ul-tit{ margin-bottom:4px;border-left: 2px solid #245682;
    line-height: 12px;
    padding: 0 0px 0 5px;}
  .block-card-container .dashed.card-ul-input{  padding-bottom: 10px; }
  .block-card-container .header-link{ padding: 4px 20px;overflow:hidden;}
  .block-card-container .header-link a{     float: left;
    padding: 2px 10px;
    color: #245682;
    font-weight: bold;
    font-size: 16px;}
  .block-card-container .block-type{ color:#245682;font-style: inherit;font-size: 12px;}
  .block-card-container .block-type::before{     content: "";
    display: inline-block;
    width: 8px;
    height: 8px;
    background: #2ec7c9;
    border-radius: 10px;
    margin-right: 6px;}
  .block-card-container .action-box{ width: 100%;}
  .block-card-container .action-box-tit{ width: 100%;line-height: 16px;font-style: italic;color: #245682;font-weight: bold;}
  .block-card-container .power-switch{ margin: 6px 6px 6px 3px;}
  .block-card-container .action-box-power{ margin-bottom:10px;}
  .block-card-container .action-box-power .tip{ color:#8c9297;vertical-align: middle;}
  .block-card-container .block-card-container{ margin-top: 12px;}
  .block-card-container .box-card { border-top: 3px solid #245682;border-radius: 3px;background: #f5f6f7;}

  .li-100{width: 100%;}
  .con-wrap{overflow: hidden;white-space: nowrap;text-overflow: ellipsis;width: 100%;}
  .el-tag{margin: 0px 5px;}
  .el-input{width: 80px;}
  .block-w{height: 32px; overflow: hidden;}
  .tags-wrap .el-tag,.tags-wrap .el-button{height: 28px;padding: 0 9px;}
  .card-ul-input{height: auto !important;overflow: hidden;}
  .block-input label{display: inline-block;margin: 10px 10px 0px 0px;}
  .card-ul-inner{ }
  .slider-box{ }
  .power-box{ margin-top:7px;float: left;}
  .power-box .icon { font-size: 20px;}
  .power-box .icon-power-on{ display: none;}
  .power-box .icon-power-off{ }
  .power-box .is-active .icon-power-on{ display: block;}
  .power-box .is-active .icon-power-off{ display: none;}
  .block-slider{ float: left;
    width: 100%;
    margin-top: 4px;
    padding: 0 0px 0 14px;}
  .power-box label{ margin-bottom: 0;}
  .power-box .icon-power-on{
    -webkit-animation-timing-function: ease-in-out;
    -webkit-animation-name: breathe;
    -webkit-animation-duration: 400ms;
    -webkit-animation-iteration-count: infinite;
    -webkit-animation-direction: alternate;}
  @-webkit-keyframes breathe {
    0% {
      opacity: .0;
    }

    100% {
      opacity: 1;
      /*transform:scale(1.1);*/
      /*text-shadow: 0px 0 8px #F00;*/
      /*box-shadow: 0px 0 8px #F00;*/
    }
  }
  .block-card-container .card-opr-container{ }
  .block-card-container .card-opr-container .card-opr{    height: 40px;
    padding-left: 13px;
    width: 130%;
    overflow: hidden;
    position: relative;
    background: #f7f7f7;
    margin-left: -24px;
    margin-top: -7px;
    border: 0;}

</style>
<style>
  .block-card-container .box-card-container .el-card__body{ padding: 0 20px;background: #f5f6f7;}
  .block-card .box-card .el-card__header{ height: auto;padding: 0;}

  .slider-box .el-slider__input{ width: 80px;}
  .slider-box .el-slider__button-wrapper{ outline: none;}
  .slider-box .el-input--small .el-input__inner{    padding: 0 2px; height: 22px;
    line-height: 22px;border-radius: 50px;}
  .slider-box .el-input-number--small .el-input-number__decrease,
  .slider-box .el-input-number--small .el-input-number__increase{ height: 20px;width:20px;margin-top: 4px;line-height: 20px;}
  .slider-box .el-input-number--small .el-input-number__decrease{ margin-bottom: 1px;margin-left: 1px;border-top-left-radius: 50px;border-bottom-left-radius: 50px;}
  .slider-box .el-input-number--small .el-input-number__increase{ margin-bottom: 1px;margin-right: 1px;border-top-right-radius: 50px;border-bottom-right-radius: 50px;}
  .power-box .el-radio-button__inner{ border:none!important;box-shadow: none!important;border-radius:4px!important;outline: none!important;}
  .power-box .radio-btn .el-radio-button__inner:hover{ background:#f0f1f3;}
  .power-box .radio-btn.is-active .el-radio-button__inner{ background:#f0f1f3;border:none;box-shadow: none;}
  /*.power-box .is-active .el-radio-button__inner:hover{ background:none;}*/
  .block-slider .el-slider__runway.show-input{ margin-right:93px;}
  .power-box-default label:focus{ box-shadow: none!important;}
  .power-box .el-radio-button--small .el-radio-button__inner{ padding:6px 8px;}

</style>
