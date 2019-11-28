<template>
  <el-row :gutter='20' class="code-box">
    <el-col :span='24'>
      <codemirror v-model='codeContent' :options='codeOption'></codemirror>
    </el-col>
  </el-row>
</template>

<script>
  import { codemirror } from 'vue-codemirror-lite'
  import 'codemirror/theme/eclipse.css'
  import 'codemirror/mode/python/python.js'
  import 'codemirror/mode/dockerfile/dockerfile.js'

  export default {
    components: { codemirror },
    props: ['codeContent'],
    data () {
      return {
        codeOption: {
          mode: {name: 'dockerfile'},
          theme: 'eclipse',
          readOnly: true,
          lineNumbers: true
        }
      }
    },
    methods: {}
  }
</script>

<style scoped>
.upload-box{margin-bottom: 10px;}
</style>
<style>
.CodeMirror{height: 450px !important;}
</style>
