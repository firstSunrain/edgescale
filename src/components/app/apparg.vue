<template>
  <div class="arg-box" v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading...">
    <el-form :model='createAppForm' size='small' label-width='170px' ref='createAppForm'>
      <el-form-item :label="$t('commands')" prop='dynamic_commands'>
        <el-input v-model='createAppForm.dynamic_commands' placeholder='/bin/bash -c'></el-input>
      </el-form-item>
      <el-form-item :label="$t('arguments')" prop='dynamic_args'>
        <el-input v-model='createAppForm.dynamic_args' placeholder='cd /root/flask-facep-reg-v2; python main.py --dev laptop '></el-input>
      </el-form-item>
      <el-form-item :label="$t('host_arguments')">
        <div class="inline-form" v-for='(value, key) in createAppForm.dynamic_ports'>
          <el-input v-model='value.containerPort' placeholder='Host port' type="number"></el-input>
          <el-input v-model='value.hostPort' placeholder='Container port' type="number"></el-input>
          <i class="icon-subtract item-add" v-if='key>0' @click="removeItem('port', key)"></i>
        </div>
        <i class="icon-plus-circle2 item-add" @click="addItem('port')"></i>
      </el-form-item>
      <el-form-item :label="$t('volume_arguments')">
        <div class="inline-form" v-for='(value, key) in createAppForm.dynamic_volumes'>
          <el-input v-model='value.hostPath' placeholder='Host path'></el-input>
          <el-input v-model='value.mountPath' placeholder='Mount path'></el-input>
          <el-checkbox class="ml5" v-model='value.mountPathReadOnly'>{{ $t('read_only') }}</el-checkbox>
          <i class="icon-subtract item-add" v-if='key>0' @click="removeItem('path', key)"></i>
        </div>
        <i class="icon-plus-circle2 item-add" @click="addItem('path')"></i>
      </el-form-item>
      <el-form-item :label="$t('env_arguments')">
        <div class="inline-form" v-for='(value, key) in createAppForm.dynamic_env'>
          <el-input v-model='value.name' placeholder='env name'></el-input>
          <el-input v-model='value.value' placeholder='env value'></el-input>
          <i class="icon-subtract item-add" v-if='key>0' @click="removeItem('env', key)"></i>
        </div>
        <i class="icon-plus-circle2 item-add" @click="addItem('env')"></i>
      </el-form-item>
      <el-form-item>
        <div class="inline-form">
          <el-checkbox v-model='createAppForm.dynamic_cap_add'>{{ $t('permission_arguments') }}</el-checkbox>
          <el-checkbox v-model='createAppForm.dynamic_host_network'>{{ $t('host_network') }}</el-checkbox>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="common-page">
      <!-- <el-button size='small'>{{ $t('cancel') }}</el-button> -->
      <el-button size='small' type="primary" @click="saveDockerConfig">{{ $t('submit') }}</el-button>
    </div>
  </div>
</template>

<script>
import { appDockerConfig } from '@/api'
let thisVue = null

export default {
  data () {
    return {
      loading: false,
      createAppForm: {
        dynamic_commands: '',
        dynamic_args: '',
        dynamic_host_network: false,
        dynamic_ports: [{ containerPort: '', hostPort: '' }],
        dynamic_volumes: [{ mountPathReadOnly: false, hostPath: '', mountPath: '' }],
        dynamic_env: [{ name: '', value: '' }],
        dynamic_cap_add: false
      }
    }
  },
  methods: {
    addItem (type) {
      if (type === 'port') {
        thisVue.createAppForm.dynamic_ports.push({ containerPort: '', hostPort: '' })
      } else if (type === 'path') {
        thisVue.createAppForm.dynamic_volumes.push({ mountPathReadOnly: false, hostPath: '', mountPath: '' })
      } else {
        thisVue.createAppForm.dynamic_env.push({ name: '', value: '' })
      }
    },
    removeItem (type, value) {
      if (type === 'port') {
        thisVue.createAppForm.dynamic_ports.splice(value, 1)
      } else if (type === 'path') {
        thisVue.createAppForm.dynamic_volumes.splice(value, 1)
      } else {
        thisVue.createAppForm.dynamic_env.splice(value, 1)
      }
    },
    saveDockerConfig () {
      thisVue.loading = true
      appDockerConfig({parameters: thisVue.createAppForm}).then(dat => {
        let res = dat.data
        thisVue.loading = false
        if (res.status === 'fail') {
          thisVue.$alert(thisVue.$t('save_app_config_fail'), thisVue.$t('error'), {type: 'error'})
        } else {
          thisVue.$message({type: 'success', message: thisVue.$t('save_app_config_success')})
          thisVue.$emit('dockerConfig', thisVue.createAppForm)
        }
      }).catch(_ => {
        thisVue.loading = false
        return false
      })
    }
  },
  mounted () {
    thisVue = this
  }
}
</script>
<style scoped>
  .filter-box .el-input{vertical-align: middle;}
  .inline-form{position: relative;margin-bottom: 10px;}
  .inline-form .el-input{display: inline-block;width: 30%;}
  .item-add{font-size: 20px; color: #245682; position: absolute; top: 3px; left: 80%;cursor: pointer;}
  .item-add:hover{ color:#5ca3e2;}
</style>
<style>
  .arg-box .el-checkbox__label{ padding-left:5px;}
</style>
