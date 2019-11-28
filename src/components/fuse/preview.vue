<template>
  <div class="preview-content">
      <el-collapse v-model='activeName'>
        <el-collapse-item name='1'>
          <template slot='title'>
            <span class='collapse-tit'>{{ $t('basic_info') }}</span>
          </template>
          <ul>
            <li>
                <i class='icon-diamond4 info-icon'></i>
                <span style='padding: 0px 6px;font-weight: bold;'>{{ $t('name') }} :</span>
                <span>{{ setForm.name }}</span>
            </li>
            <li v-if='!isUpload'>
              <i class='icon-diamond4 info-icon'></i>
              <span style='padding: 0px 6px;font-weight: bold;'>{{ $t('key_pair') }} : </span>
              <span>{{ setForm.key_pair }}</span>
            </li>
            <li>
              <i class='icon-diamond4 info-icon'></i>
              <span style='padding: 0px 6px;font-weight: bold;'>{{ $t('description') }} : </span>
              <span>{{ setForm.description }}</span></span>
            </li>
          </ul>
        </el-collapse-item>
        <el-collapse-item name='2' class="continfo-box">
          <template slot='title'>
            <span class='collapse-tit'>{{ $t('basic_info') }}</span>
          </template>
          <ul>
            <li><showCode :codeContent='content'></showCode></li>
          </ul>
        </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
import { fileContent } from '@/api'
import showCode from '../showCode'
let thisVue = null
export default {
  components: { showCode },
  props: ['setForm', 'isUpload', 'url'],
  data () {
    return {
      content: '',
      activeName: ['1', '2']
    }
  },
  methods: {
    getFileContent () {
      fileContent(thisVue.url).then(dat => {
        let res = dat.data
        thisVue.content = res
        thisVue.$emit('content', res)
      }).catch(_ => {
        thisVue.loading = false
      })
    }
  },
  mounted () {
    thisVue = this
    if (thisVue.isUpload) {
      thisVue.getFileContent()
    } else {
      thisVue.content = `---------------------------------------------------
# Specify the platform. [Mandatory]
# Choose Platform - LS1/LS1043/LS1012/LS1046
PLATFORM=${thisVue.setForm.platform}
---------------------------------------------------
# GPIO Pin to be set for raising POVDD [Optional]
POVDD_GPIO=${thisVue.setForm.povdd_gpio}
---------------------------------------------------
# One time programmable master key flags in binary form.[Mandatory]
# 0000 -> Program default minimal OTPMK value
# 0001 -> Program random OTPMK value
# 0010 -> Program user supplied OTPMK value
# 0101 -> Program random OTPMK value with pre-programmed minimal value
# 0110 -> Program user supplied OTPMK value with pre-programmed minimal value

# 1xxx -> Don't blow OTPMK
OTPMK_FLAGS=${thisVue.setForm.otpmk_flags}
# One time programmable master key value.
# [Optional dependent on flags, Mandatory in case OTPMK_FLAGS="0010" or "0110"]
OTPMK_0=${thisVue.setForm.otpmk_0}
OTPMK_1=${thisVue.setForm.otpmk_1}
OTPMK_2=${thisVue.setForm.otpmk_2}
OTPMK_3=${thisVue.setForm.otpmk_3}
OTPMK_4=${thisVue.setForm.otpmk_4}
OTPMK_5=${thisVue.setForm.otpmk_5}
OTPMK_6=${thisVue.setForm.otpmk_6}
OTPMK_7=${thisVue.setForm.otpmk_7}
---------------------------------------------------
# Specify OEM UIDs. [Optional]
# e.g OEM_UID_0=11111111
OEM_UID_0=${thisVue.setForm.oem_uid_0}
OEM_UID_1=${thisVue.setForm.oem_uid_1}
OEM_UID_2=${thisVue.setForm.oem_uid_2}
OEM_UID_3=${thisVue.setForm.oem_uid_3}
OEM_UID_4=${thisVue.setForm.oem_uid_4}
---------------------------------------------------
# Specify Debug challenge and response values. [Optional]
# e.g DCV_0=11111111
DCV_0=${thisVue.setForm.dcv_0}
DCV_1=${thisVue.setForm.dcv_1}
DRV_0=${thisVue.setForm.drv_0}
DRV_1=${thisVue.setForm.drv_1}
---------------------------------------------------
# Specify Debug Level in binary form. [Optional]
# 000 -> Wide open: Debug portals are enabled unconditionally.
# 001 -> Conditionally open via challenge response, without notification.
# 01x -> Conditionally open via challenge response, with notification.
# 1xx -> Closed. All debug portals are disabled.
DBG_LVL=${thisVue.setForm.dbg_lvl}
---------------------------------------------------
# System Configuration register bits in binary form [Optional]
# WP (OEM write protect)
# ITS (Intent to Secure)
# NSEC (Non secure)
# ZD (ZUC Disable)
# K0,K1,K2 (Key revocation bits)
# FR0 (Field return 0)
# FR1 (Field return 1)
WP=${thisVue.setForm.wp}
ITS=${thisVue.setForm.its}
NSEC=${thisVue.setForm.nsec}
ZD=${thisVue.setForm.zd}
K0=${thisVue.setForm.k0}
K1=${thisVue.setForm.k1}
K2=${thisVue.setForm.k2}
FR0=${thisVue.setForm.fr0}
FR1=${thisVue.setForm.fr1}
---------------------------------------------------
# Specify the output fuse provisioning file name. (Default:fuse_scr.bin) [Optional]
OUTPUT_FUSE_FILENAME=${thisVue.setForm.output_fuse_filename}
---------------------------------------------------`
      thisVue.$emit('content', thisVue.content)
    }
  }
}
</script>
<style scoped>
  .preview-content p{margin: 0px;}
  .com-p{padding-left: 30px; line-height: 24px;margin-bottom: 20px;border-bottom: 1px solid #e8e8e8;padding-bottom: 20px;}
  .com-p strong{font-size: 14px;padding-right: 10px;}
</style>
<style scoped>
  .fuse-box .el-collapse-item__content span{ color: #223c53 !important;font-size: 14px;}
  .opr-box-container{ overflow:hidden;}
  .collapse-tit{border-left: 2px solid #245682;padding-left: 10px;}
  .continfo-box{ }
  .continfo-box ul{ border: 1px solid #e9eef1;
    padding-left:0;
    -webkit-box-shadow: 0px 1px 5px 0px rgba(21,59,92,0.11);
    -moz-box-shadow: 0px 1px 5px 0px rgba(21,59,92,0.11);
    box-shadow: 0px 1px 5px 0px rgba(21,59,92,0.11);}
</style>
<style>
  .el-collapse li{margin-bottom:7px;list-style: none;}
  .CodeMirror-gutters {border-right: 1px solid #dfe5eb;
    background-color: #f0f3f6;
    white-space: nowrap;
  }
  .CodeMirror-focused .CodeMirror-selected{ background:#dee6ec;}
  /*.CodeMirror-line::selection,.CodeMirror-line>span::selection,.CodeMirror-line>span>span::selection { background:#f5f7fa;}*/
</style>
