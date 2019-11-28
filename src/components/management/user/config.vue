<template>
  <div class="config-page" name='config'>
    <el-row class='list-box' v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="loading....">
      <el-col :span='24' class='form-box'>
        <el-collapse v-model='activeNames'>
          <!-- basic -->
          <el-collapse-item name='1'>
            <template slot='title'>
              <span class='collapse-tit'>{{ $t('ca_config') }}</span>
            </template>
            <div class='card-form-box'>
              <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="Root CA" prop="body">
                  <textarea rows="3" v-model="form.body" placeholder="Please input the CA"></textarea>
                </el-form-item>
                <el-form-item label="Private Key" prop="private_key">
                  <textarea rows="3" v-model="form.private_key" placeholder="Please input the private_key"></textarea>
                </el-form-item>
                <el-form-item label="Trust chain" prop="chain">
                  <textarea rows="3" v-model="form.chain" placeholder="Please input the chain"></textarea>
                </el-form-item>
              </el-form>
              <div class='card-btn'>
                <el-button class='common-btn' size='small' icon="icon-floppy-disk" v-if='!isHas' @click="submitConfig('post')"> {{ $t('save') }}</el-button>
                <el-button class='common-btn' size='small' icon="icon-pencil5" v-if='isHas' @click="submitConfig('put')"> {{ $t('update') }}</el-button>
                <el-button class='common-btn' size='small' icon='icon-trash' @click="deleteConfig"> {{ $t('delete') }}</el-button>
              </div>
            </div>
          </el-collapse-item>
          <!-- device -->
          <el-collapse-item name='2'>
            <template slot='title'>
              <span class='collapse-tit'>{{ $t('service_config') }}</span>
            </template>
            <div class='card-form-box com-table'>
              <el-table :data='serviceList'>
                <el-table-column label='Name' prop='name'></el-table-column>
                <el-table-column label='Url' prop='url'></el-table-column>
                <el-table-column label='Port' prop='port' width='100'></el-table-column>
                <el-table-column label='Access Token' prop='access_token'></el-table-column>
                <el-table-column label='Action' width='80'>
                <template slot-scope='scope'>
                  <i class="table-btn icon-pencil5" @click="editService(scope.row)"></i>
                  <i class="table-btn icon-trash" @click="deleteService(scope.row.id)"></i>
                </template>
              </el-table-column>
              </el-table>
              <div class='card-btn'>
                <el-button class='common-btn' size='small' icon="icon-googleplus5 text-size-base" @click='creatService'> {{ $t('create') }}</el-button>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-col>
      <!-- dialog -->
      <el-dialog :visible.sync="serviceDialog" title='Create Service'>
        <el-form :model='serviceForm' label-width='100px' size='small' ref='service_form'>
          <el-form-item label="Service Name" prop="name">
            <el-select v-model='serviceForm.name' filterable allow-create>
              <el-option v-for='(value, key) in serviceNames' :key='key' :label='value' :value='value'></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="URL" prop="url">
            <el-input v-model="serviceForm.url" name="url" placeholder="Please input the url"></el-input>
          </el-form-item>
          <el-form-item label="Port" prop="port">
            <el-input type='number' v-model="serviceForm.port" name="port" placeholder="Please input the port"></el-input>
          </el-form-item>
          <el-form-item label="Access Token" prop="access_token" v-if="serviceForm.name=='DockerRepo Service'">
            <el-input v-model="serviceForm.access_token" name="port" placeholder="Please input the port"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type='default' size='small' @click="resetForm">{{ $t('cancel') }}</el-button>
          <el-button type='success' size='small' @click='submitServiceForm'>{{ $t('submit') }}</el-button>
        </span>
      </el-dialog>
    </el-row>
  </div>
</template>
<script>
import { userCertificate, userCertificateDelete, serviceList, serviceDelete, serviceCreate, serviceUpdate, userCertificateOpr } from '@/api'
let thisVue = null
export default {
  data () {
    return {
      loading: true,
      isHas: false,
      activeNames: ['1', '2'],
      serviceList: [],
      serviceDialog: false,
      serviceForm: {
        name: '',
        port: '',
        url: '',
        access_token: ''
      },
      serviceNames: ['Enrollment Service', 'DockerRepo Service', 'DockerNotary Service', 'RestAPI Service', 'Message Service'],
      form: {
        body: '',
        private_key: '',
        chain: ''
      }
    }
  },
  methods: {
    getConfig () {
      thisVue.loading = true
      userCertificate().then(dat => {
        let res = dat.data
        thisVue.loading = false
        thisVue.form = res
        if (res.body) {
          thisVue.isHas = true
        } else {
          thisVue.isHas = false
        }
      }).catch(_ => {
        thisVue.loading = false
      })
    },
    deleteConfig () {
      thisVue.loading = true
      userCertificateDelete().then(dat => {
        let res = dat.data
        thisVue.loading = false
        thisVue.$message({type: res.status, message: res.message})
        thisVue.getConfig()
      }).catch(_ => {
        thisVue.loading = false
      })
    },
    getServiceList () {
      thisVue.loading = true
      serviceList().then(dat => {
        let res = dat.data
        thisVue.loading = false
        if (res) {
          thisVue.serviceList = res
        }
      }).catch(_ => {
        thisVue.loading = false
      })
    },
    deleteService (id) {
      thisVue.$confirm(thisVue.$t('want_to_continue'), thisVue.$t('delete')).then(function () {
        thisVue.loading = true
        serviceDelete(id).then(dat => {
          let res = dat.data
          thisVue.loading = false
          if (res.status === 'success') {
            thisVue.$message({ message: res.message, type: 'success' })
            thisVue.getServiceList()
          } else {
            thisVue.$message({ status: 'error', message: res.message })
          }
        }).catch(_ => {
          thisVue.loading = false
        })
      }).catch(function (err) {
        return err
      })
    },
    editService (dat) {
      thisVue.serviceForm = dat
      thisVue.isEdit = true
      thisVue.serviceDialog = true
    },
    creatService () {
      thisVue.isEdit = false
      thisVue.serviceDialog = true
    },
    submitServiceForm () {
      let actionType = serviceCreate
      if (thisVue.isEdit) {
        actionType = serviceUpdate
      }
      actionType(thisVue.serviceForm).then(dat => {
        let res = dat.data
        thisVue.loading = false
        if (res.status === 'success') {
          thisVue.$message({ message: res.message, type: 'success' })
          thisVue.resetForm()
          thisVue.getServiceList()
        } else {
          thisVue.$message({ status: 'error', message: res.message })
        }
      }).catch(_ => {
        thisVue.loading = false
      })
    },
    submitConfig (type) {
      userCertificateOpr(type, thisVue.form).then(dat => {
        let res = dat.data
        thisVue.loading = false
        if (res.status === 'success') {
          thisVue.$message({ message: res.message, type: 'success' })
          thisVue.getConfig()
        } else {
          thisVue.$message({ status: 'error', message: res.message })
        }
      }).catch(_ => {
        thisVue.loading = false
      })
    },
    resetForm () {
      thisVue.serviceForm = {
        name: '',
        port: '',
        url: '',
        access_token: ''
      }
      thisVue.serviceDialog = false
    }
  },
  mounted () {
    thisVue = this
    thisVue.getConfig()
    thisVue.getServiceList()
  }
}
</script>

<style scoped>
  .config-page{min-height: 500px;}
  .list-box{background-color: #fff;}
  .opr-box{padding: 15px 20px;background-color: #fcfcfc;}
  .form-box{padding: 15px 20px;}
  .item-box{margin-bottom: 20px;}
  textarea{line-height: 20px; width: 100%; resize: none; border: 1px solid #d6d5d5; border-radius: 5px; background-color: #fdfdfd; padding: 10px;}
  .config-tit{font-size: 16px; color: #444; background-color: #44baf5; color: #fff; line-height: 30px; padding: 10px 20px;font-weight: bold;}
  .card-form-box{padding: 20px;}
  .card-form-box .el-form-item{margin-bottom: 0px;}
  .card-btn{padding-top: 10px;text-align: right;}
  .btn-red{color: #f00;}
  .el-select{width: 100%;}
</style>
