<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input class="box" v-model="query" :placeholder="placeholder"/>
    <i v-show="query.length" class="icon-dismiss" @click="clear"></i>
  </div>
</template>

<script>
  export default {
    props: {
      placeholder: {
        type: String,
        default: '搜索歌曲、歌手'
      }
    },
    data() {
      return {
        query: ''
      }
    },
    methods: {
      clear() {
        this.query = '';
      },
      setQuery(query) {
        this.query = query;
      }
    },
    created() {
      this.$watch('query', (newQuery) => {
        this.$emit('query', newQuery);
      })
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  @import "~common/less/variable.less";

  .search-box {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    padding: 0 6px;
    height: 40px;
    background: @color-highlight-background;
    border-radius: 6px;
    .icon-search {
      font-size: 24px;
      color: @color-text;
    }
    .box {
      flex: 1;
      margin: 0 5px;
      line-height: 18px;
      background: @color-highlight-background;
      color: @color-text-ll;
      font-size: @font-size-medium-x;
      height: 100%;
      padding-left: 5px;
      &:focus {
        outline: none;
      }
      &::placeholder {
        color: @color-text-d;
      }
    }
    .icon-dismiss {
      font-size: 16px;
      color: @color-text-d;
    }

  }
</style>
