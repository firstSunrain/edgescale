<template>
  <div class='device-group' name="devgroup">
      <router-view ></router-view>
  </div>
</template>

<style>
  .device-group{min-height: 590px;}
  .dev-group{background-color: #fff; height: auto; overflow: hidden;padding: 20px;}
  .opr-box .el-button i{font-size: 12px;padding-right: 3px;}
  .dev-group .el-button-group i{font-size: 14px !important;}
  .el-select{vertical-align: middle;}
  .dialog-footer{text-align: right;}
</style>

