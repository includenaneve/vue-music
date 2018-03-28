<template>
  <div class="loading">
    <img src="./loading.gif"/>
    <p class="desc">{{title}}</p>
  </div>
</template>

<script>
  export default {
    name: 'loading',
    props: {
      title: {
        type: String,
        default: '正在加载...'
      }
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  @import "~common/less/variable.less";

  .loading {
    width: 100%;
    text-align: center;

  .desc {
    line-height: 20px;
    font-size: @font-size-small;
    color: @color-text-l;
  }

  }
</style>
