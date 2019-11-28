<template>
  <ul class="tree-menu">
    <li v-for="(item, index) in data" :key="index">
      <span @click="toggle(item, index)">
        <i :class="['icon', item.children && item.children.length ? folderIconList[index] : 'file-text', loading ? loadingIconList[index] : '']"></i>
        {{ item[name] || item.menuName }}
      </span>
      <tree-menu v-if="scope[index]" :data="item.children"></tree-menu>
    </li>
    <!-- update code Dialog -->
    <el-dialog title='update code' :visible.sync='dialogVisible' :show-close='false' :close-on-click-modal='false'>
      <div v-loading='dialogLoading' element-loading-spinner="el-icon-loading" element-loading-text="loading...">
        <textarea style="min-height:200px; height:200px; width:100%;" v-model="textarea"></textarea>
        <div slot="footer" style='text-align: right; margin-top:20px;'>
          <el-button size='small' @click="closeDialog">Cancel</el-button>
          <el-button size='small' type="primary" @click="submitCode">Submit</el-button>
        </div>
      </div>
    </el-dialog>
  </ul>
</template>
 
<script>
import { eiqGetTxt } from '@/api/api'
export default {
  name: 'treeMenu',
  props: {
    data: Array,
    name: String,
    loading: Boolean
  },
  data () {
    return {
      dialogLoading: false,
      dialogVisible: false,
      textarea: '',
      folderIconList: [],
      loadingIconList: [],
      scope: {}
    }
  },
  created () {
    this.data.forEach((item, index) => {
      if (item.children && item.children.length) {
        this.folderIconList[index] = 'folder'
      }
    })
  },
  methods: {
    closeDialog () {
      this.dialogVisible = false
      this.textarea = ''
    },
    submitCode () {
      console.log(222)
    },
    doTask (index) {
      this.$set(this.scope, index, !this.scope[index])
      this.folderIconList[index] = this.scope[index] ? 'folder-open' : 'folder'
    },
    toggle (item, index) {
      let thisVue = this
      thisVue.loadingIconList = []
      if (item.children && item.children.length) {
        thisVue.doTask(index)
      } else {
        if (item.type === 2) {
          thisVue.dialogVisible = true
          eiqGetTxt('get', item.path).then(json => {
            thisVue.textarea = json.request.response
          })
        } else {
          thisVue.loadingIconList[index] = 'loading'
          thisVue.$emit('getSubMenu', item, (subMenuList) => {
            console.log(subMenuList)
            if (subMenuList && subMenuList.length) {
              thisVue.doTask(index)
            }
          })
        }
      }
    }
  }
}
</script>
 
<style scoped>
.tree-menu {
  list-style: none;
}
.tree-menu li {
  line-height: 2;
}
.tree-menu li span {
  cursor: default;
}
.icon {
  display: inline-block;
  width: 15px;
  height: 15px;
  background-repeat: no-repeat;
  vertical-align: -2px;
}
.icon.folder {
  background-image: url(../../../../static/img/assets/folder.png);
}
.icon.folder-open {
  background-image: url(../../../../static/img/assets/folder-open.png);
}
.icon.file-text {
  background-image: url(../../../../static/img/assets/file-text.png);
}
.icon.loading {
  background-image: url(../../../../static/img/assets/loading.gif);
  background-size: 15px;
}
.el-dialog__body{
  padding: 20px 20px;
}
</style>