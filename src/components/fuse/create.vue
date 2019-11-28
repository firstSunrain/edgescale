<template>
  <div class="fuse-box" v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading...">
    <el-row>
      <el-col :span='24' v-if='!preview'>
        <el-form :model='form' ref='form' size='mini' :rules='rules' label-width='120px'>
          <el-collapse v-model='activeNames'>
            <el-collapse-item name='1'>
              <template slot='title'>
                <span class='collapse-tit'>{{ $t('basic_info') }}</span>
              </template>
              <div class="com-item">
                <el-form-item class='com-form' :label="$t('name')" prop='name'>
                  <el-input v-model='form.name'></el-input>
                </el-form-item>
                <el-form-item class='com-form' :label="$t('key_pair')" prop='key_pair'  v-if='!is_upload'>
                  <el-select v-model='form.key_pair'>
                    <el-option v-for='(item, key) in keys' :key='key' :value="item.id" :label="item.name"></el-option>
                    <a class='get-more' @click='getKeys'>{{ $t('more') }}...</a>
                  </el-select>
                </el-form-item>
                <el-form-item class='com-form' :label="$t('desc')" prop='description'>
                  <el-input v-model='form.description'></el-input>
                </el-form-item>
                <el-form-item class='com-form' :label="$t('confile_type')">
                  <el-radio-group v-model="is_upload">
                    <el-radio-button :label="false">{{ $t('setting_generate') }}</el-radio-button>
                    <el-radio-button :label="true">{{ $t('upload_config') }}</el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </div>
              <div v-if='is_upload'>
                <el-form-item class='com-form' :label="$t('upload_config')">
                  <comUpload class='com-upload' :uploadParams="{type: 'eiq', username: 'fuse'}" @fileUrl='getFileUrl'></comUpload>
                </el-form-item>
              </div>
            </el-collapse-item>
          </el-collapse>
          <el-collapse v-if='!is_upload' v-model='activeNames'>
            <!-- Mandatory -->
            <el-collapse-item name='2'>
              <template slot='title'>
                <span class='collapse-tit'>MANDATORY</span>
              </template>
              <el-form-item class='com-form' :label="$t('upper_platform')" prop='platform'>
                <el-select v-model='form.platform'>
                  <el-option value='LS1020' label='LS1020'></el-option>
                  <el-option value='LS1043' label='LS1043'></el-option>
                  <el-option value='LS1012' label='LS1012'></el-option>
                  <el-option value='LS1046' label='LS1046'></el-option>
                  <el-option value='LS1046' label='LS1046'></el-option>
                  <el-option value='LS2080' label='LS2080'></el-option>
                  <el-option value='LS1088' label='LS1088'></el-option>
                  <el-option value='LX2160' label='LX2160'></el-option>
                  <el-option value='LS1028' label='LS1028'></el-option>
                </el-select>
                <span class="tip">Specify the platform.</span>
              </el-form-item>
              <el-form-item class='com-form' label="OTPMK_FLAGS" prop='otpmk_flags'>
                <el-select v-model='form.otpmk_flags'>
                  <el-option value='0000' label='Program default minimal OTPMK value'></el-option>
                  <el-option value='0001' label='Program random OTPMK value'></el-option>
                  <el-option value='0010' label='Program user supplied OTPMK value'></el-option>
                  <el-option value='0101' label='Program random OTPMK value with pre-programmed minimal value'></el-option>
                  <el-option value='0110' label='Program user supplied OTPMK value with pre-programmed minimal value'></el-option>
                </el-select>
                <span class='tip'>One time programmable master key flags in binary form.</span>
              </el-form-item>
              <div class='chose-opt' v-if="form.otpmk_flags == '0010' || form.otpmk_flags == '0110'">
                <template v-for='count in 8'>
                  <el-form-item class='line-form' :label="`OTPMK_${count-1}`" :prop="`otpmk_${count-1}`">
                    <el-input v-model="form[`otpmk_${count-1}`]"></el-input>
                  </el-form-item>
                </template>
              </div>
            </el-collapse-item>
            <div class="more-setting" v-if="!moreSetting" @click='moreSetting = true'>More Settings <i class="icon-arrow-down12"></i></div>
            <div class="more-setting" v-if="moreSetting" @click='moreSetting = false'>Hidden Settings <i class="icon-arrow-up12"></i></div>
            <template v-if='moreSetting'>
              <!-- oem uid -->
              <el-collapse-item name='4'>
                <template slot='title'>
                  <span class='collapse-tit'>OEM UID</span>
                  <span class='tip'>Specify OEM UIDs. (e.g OEM_UID_0=11111111)</span>
                </template>
                <div class="chose-opt">
                  <template v-for='count in 5'>
                    <el-form-item class='line-form' :label="`OEM_UID_${count-1}`" :prop="`oem_uid_${count-1}`">
                      <el-input v-model="form[`oem_uid_${count-1}`]"></el-input>
                    </el-form-item>
                  </template>
                </div>
              </el-collapse-item>
              <!-- debug -->
              <el-collapse-item name='5'>
                <template slot='title'>
                  <span class='collapse-tit'>DEBUG</span>
                  <span class='tip'>Specify Debug challenge and response values. (e.g DCV_0=11111111)</span>
                </template>
                <div class="chose-opt">
                  <template v-for='count in 2'>
                    <el-form-item class='line-form' :label="`DCV_${count-1}`" :prop="`dcv_${count-1}`">
                      <el-input v-model="form[`dcv_${count-1}`]"></el-input>
                    </el-form-item>
                  </template>
                  <template v-for='count in 2'>
                    <el-form-item class='line-form' :label="`DRV_${count-1}`" :prop="`drv_${count-1}`">
                      <el-input v-model="form[`drv_${count-1}`]"></el-input>
                    </el-form-item>
                  </template>
                </div>
              </el-collapse-item>
              <!-- debug -->
              <el-collapse-item name='6'>
                <template slot='title'>
                  <span class='collapse-tit'>CONFIGURATION</span>
                  <span class='tip'>System Configuration register bits in binary form</span>
                </template>
                <div class="chose-opt">
                  <el-form-item class='line-form-50' label="WP" prop='wp'>
                    <el-input v-model='form.wp'></el-input>
                    <span class="tip">OEM write protect</span>
                  </el-form-item>
                  <el-form-item class='line-form-50' label="ITS" prop='its'>
                    <el-input v-model='form.its'></el-input>
                    <span class="tip">Intent to Secure</span>
                  </el-form-item>
                  <el-form-item class='line-form-50' label="NSEC" prop='nsec'>
                    <el-input v-model='form.nsec'></el-input>
                    <span class="tip">Non secure</span>
                  </el-form-item>
                  <el-form-item class='line-form-50' label="ZD" prop='zd'>
                    <el-input v-model='form.zd'></el-input>
                    <span class="tip">ZUC Disable</span>
                  </el-form-item>
                  <el-form-item class='line-form-50' label="FR0" prop='fr0'>
                    <el-input v-model='form.fr0'></el-input>
                    <span class="tip">Field return 0</span>
                  </el-form-item>
                  <el-form-item class='line-form-50' label="FR1" prop='fr1'>
                    <el-input v-model='form.fr1'></el-input>
                    <span class="tip">Field return 1</span>
                  </el-form-item>
                  <el-form-item class='line-form-50' label="K0" prop='k0'>
                    <el-input v-model='form.k0'></el-input>
                    <span class="tip">Key revocation bits</span>
                  </el-form-item>
                  <el-form-item class='line-form-50' label="K1" prop='k1'>
                    <el-input v-model='form.k1'></el-input>
                    <span class="tip">Key revocation bits</span>
                  </el-form-item>
                  <el-form-item class='line-form-50' label="K2" prop='k2'>
                    <el-input v-model='form.k2'></el-input>
                    <span class="tip">Key revocation bits</span>
                  </el-form-item>
                </div>
              </el-collapse-item>
              <!-- Optional -->
              <el-collapse-item name='3'>
                <template slot='title'>
                  <span class='collapse-tit'>OPTIONAL</span>
                </template>
                <el-form-item class='com-form' label="POVDD GPIO" label-width='200px' prop='povdd_gpio'>
                  <el-input v-model='form.povdd_gpio'></el-input>
                  <span class="tip">GPIO Pin to be set for raising POVDD</span>
                </el-form-item>
                <el-form-item class='com-form' label-width='200px' label="DBG LVL" prop='dbg_lvl'>
                  <el-select v-model='form.dbg_lvl'>
                    <el-option value='000' label='Wide open: Debug portals are enabled unconditionally'></el-option>
                    <el-option value='001' label='Conditionally open via challenge response, without notification'></el-option>
                    <el-option value='01x' label='Conditionally open via challenge response, with notification'></el-option>
                    <el-option value='1xx' label='Closed. All debug portals are disabled'></el-option>
                  </el-select>
                  <span class="tip">Specify Debug Level in binary form.</span>
                </el-form-item>
                <el-form-item class='com-form' label="OUTPUT FUSE FILENAME" label-width='200px' prop='output_fuse_filename'>
                  <el-input v-model='form.output_fuse_filename'></el-input>
                  <span class="tip">Specify the output fuse provisioning file name.</span>
                </el-form-item>
              </el-collapse-item>
            </template>
          </el-collapse>
        </el-form>
      </el-col>
      <el-col :span='24' v-if='preview'>
        <viewContent :setForm='form' :isUpload='is_upload' :url='configUrl' @content='getContent'></viewContent>
      </el-col>
      <el-col :span='24' class='btn-bar'>
        <div class="el-form">
          <el-button class='common-btn' size='small' @click="resetForm('form')" v-if='!is_upload && !preview'>{{ $t('reset') }}</el-button>
          <a href="/static/template_fuse.txt" target='_blank' v-if='is_upload && !preview'><el-button class='common-btn' size='small'>{{ $t('download_template') }}</el-button></a>
          <el-button class='common-btn' size='small' v-if='preview' @click="preview = false">&lt; {{ $t('back') }}</el-button>
          <el-button class='common-btn' type="primary" v-if='!preview' size='small' @click="previewHandle('form')">{{ $t('preview') }} &gt;</el-button>
          <el-button class='common-btn' type="primary" v-if='preview' size='small' @click="submitForm('form')">{{ $t('submit') }}</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getKeyList, fuseCreate } from '@/api'
import comUpload from '../commonUpload'
import viewContent from './preview'
let thisVue = null

export default {
  components: { viewContent, comUpload },
  data () {
    return {
      loading: false,
      activeNames: ['1', '2'],
      is_upload: false,
      configUrl: '',
      moreSetting: false,
      preview: false,
      content: '',
      keys: [],
      rules: {
        name: [{required: true, message: this.$t('rule_name_require'), trigger: 'blur'}],
        platform: [{required: true, message: this.$t('rule_platform_require'), trigger: 'change'}],
        otpmk_flags: [{required: true, message: this.$t('rule_flag_require'), trigger: 'change'}]
      },
      form: {
        name: '',
        description: '',
        key_pair: '',
        platform: '',
        povdd_gpio: '',
        output_fuse_filename: 'fuse_scr.bin',
        otpmk_flags: '',
        otpmk_0: '',
        otpmk_1: '',
        otpmk_2: '',
        otpmk_3: '',
        otpmk_4: '',
        otpmk_5: '',
        otpmk_6: '',
        otpmk_7: '',
        oem_uid_0: '',
        oem_uid_1: '',
        oem_uid_2: '',
        oem_uid_3: '',
        oem_uid_4: '',
        dcv_0: '',
        dcv_1: '',
        drv_0: '',
        drv_1: '',
        dbg_lvl: '',
        wp: '',
        its: '',
        nsec: '',
        zd: '',
        k0: '',
        k1: '',
        k2: '',
        fr0: '',
        fr1: ''
      }
    }
  },
  methods: {
    getKeys () {
      let offset = thisVue.keys.length
      getKeyList({limit: 10, offset}).then(dat => {
        let res = dat.data
        thisVue.loading = false
        res.list.map(item => {
          thisVue.keys.push(item)
        })
      }).catch(_ => {
        thisVue.loading = false
      })
    },
    submitForm (form) {
      thisVue.loading = true
      let {name, description} = thisVue.form
      let params = {name, description, key_pair_id: thisVue.form.key_pair, content: thisVue.content}
      fuseCreate(params).then(dat => {
        let res = dat.data
        thisVue.loading = false
        if (res.status === 'fail') {
          thisVue.$message({message: thisVue.$t('create_fail'), type: 'error'})
        } else {
          thisVue.$message({message: thisVue.$t('create_success'), type: 'success'})
          thisVue.$router.go(-1)
        }
      }).catch(_ => {
        thisVue.loading = false
      })
    },
    previewHandle (form) {
      thisVue.$refs.form.validate(valid => {
        if (valid) {
          thisVue.preview = true
        }
      })
    },
    getFileUrl (data) {
      thisVue.configUrl = data
    },
    getContent (data) {
      thisVue.content = data
    },
    resetForm (form) {
      thisVue.$refs.form.resetFields()
    }
  },
  mounted () {
    thisVue = this
    thisVue.getKeys()
  }
}
</script>
<style scoped>
  .collapse-tit{border-left: 2px solid #0072ea;padding-left: 10px;}
  .line-form{display: inline-block;}
  .tip{padding-left: 5px; color: #8c9297; font-weight: normal; font-size: 14px;}
  .chose-opt{padding-top: 6px}
  .line-form-50{width: 33%;display: inline-block;}
  .line-form-50 .el-input{width: 50%;}
  .com-form .el-select, .com-form .el-input, .com-upload{width: 40%;}
  .el-collapse{border-bottom: none;}
  .btn-bar{text-align: right;margin-top: 20px;}
  .more-setting{margin-top: 10px;padding: 6px 0;background: #f0f3f6;color: #245682;font-size: 14px;text-align: center;cursor: pointer;}
</style>
<style>
  .fuse-box .el-collapse-item__content{ padding-bottom:0;}

</style>
