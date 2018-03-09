<template>
  <div id="app">
    <m-header></m-header>
    <router-view/>
  </div>
</template>

<script>
 import MHeader from 'components/m-header/m-header.vue'
</script>

<style scoped lang="less" rel="stylesheet/less">
  @import "common/less/variable.less";
  #app {
    color:@color-theme;
  }
</style>
