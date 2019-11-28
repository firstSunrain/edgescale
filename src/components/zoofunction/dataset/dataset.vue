<template>
  <div class='model-zoo' name="devgroup">
      <router-view ></router-view>
  </div>
</template>

<style>
  .dataset-box{background-color: #fff; height: auto; overflow: hidden;padding: 20px;}
  .com-tit{font-size: 16px; color: #666;padding-bottom: 20px;}
  .dataset-box .el-table__body-wrapper{overflow: hidden;}
  .dataset-box .el-table thead th{padding: 5px 0px;}
  .dataset-box .el-button i{font-size: 14px;padding-right: 5px;}
  .page-bar{text-align:right; padding: 15px 0px;}
  .line-filter{ height: 30px; width: 1px; background: #dcdfe6; cursor: auto; display: inline-block; padding-right: 0; padding-left: 0; border: 0;}
  .line-filter:hover, .line-filter:active, .line-filter:visited { color: #fff; border-color: #fff; background-color: #dcdfe6;}
  .line-filter.mr10{ margin-right:10px;}
  .btn-filter button{ height:32px;}
</style>

