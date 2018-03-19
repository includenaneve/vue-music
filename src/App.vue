<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>/* eslint-disable */
 import MHeader from 'components/m-header/m-header.vue'
 import Tab from 'components/tab/tab.vue'
  export default {
       components:{
         MHeader,
         Tab
       }
    }
</script>

<style scoped lang="less" rel="stylesheet/less">
</style>
