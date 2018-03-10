<template>
  <div id="app">
    <m-header></m-header>
    <router-view/>
  </div>
</template>

<script>/* eslint-disable */
 import MHeader from 'components/m-header/m-header.vue'
  export default {
       components:{
           MHeader
       }
    }
</script>

<style scoped lang="less" rel="stylesheet/less">
</style>
