<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query">
      <div class="shortcut">
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul class="items">
            <li class="item" v-for="(item,index) in hotKey" :key="index">
              <span @click="addQuery(item.k)">{{item.k}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="search-result" v-show="query">
      <suggest :query="query"></suggest>
    </div>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import SearchBox from 'base/search-box/search-box';
  import {getHotTips} from 'api/search';
  import {ERR_OK} from 'api/config';
  import Suggest from 'components/suggest/suggest';

  export default {
    data() {
      return {
        hotKey: [],
        query: ''
      }
    },
    components: {
      Suggest,
      SearchBox
    },
    created() {
      this._getHotTips();
    },
    methods: {
      onQueryChange(query) {
        this.query = query;
      },
      _getHotTips() {
        getHotTips().then((res) => {
          if (res.code === ERR_OK) {
            this.hotKey = res.data.hotkey.slice(0, 12);
          }
        })
      },
      addQuery(query) {
        this.$refs.searchBox.setQuery(query);
      }
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  @import "~common/less/variable.less";
  @import "~common/less/mixin.less";

  .search {
    .search-box-wrapper {
      margin: 20px;
    }
    .shortcut-wrapper {
      position: fixed;
      top: 178px;
      bottom: 0;
      width: 100%;
      .shortcut {
        height: 100%;
        overflow: hidden;
        .hot-key {
          margin: 0 20px 20px 20px;
          .title {
            margin-bottom: 20px;
            font-size: @font-size-medium;
            color: @color-text-l;
            text-align: center;
          }
          .items {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            .item {
              display: inline-block;
              padding: 5px 10px;
              margin: 0 20px 10px 0;
              border-radius: 6px;
              background: @color-highlight-background;
              font-size: @font-size-medium;
              color: @color-text-d;
            }
          }
        }
        .search-history {
          position: relative;
          margin: 0 20px;
          .title {
            display: flex;
            align-items: center;
            height: 40px;
            font-size: @font-size-medium;
            color: @color-text-l;
            .text {
              flex: 1;
            }
            .clear {
              .extend-click;
              .icon-clear {
                font-size: @font-size-medium;
                color: @color-text-d;
              }
            }
          }
        }
      }
    }
    .search-result {
      position: fixed;
      width: 100%;
      top: 178px;
      bottom: 0;
    }
  }
</style>
