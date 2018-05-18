<template>
  <div class="rank" ref="rank">
    <scroll class="toplist" :data="list" ref="scroll">
      <ul>
        <li class="item" v-for="(item,index) in list" :key="index" @click="selectItem(item)">
          <div class="icon">
            <img width="100" height="100" :src="item.picUrl"/>
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song,index) in item.songList" :key="index">
              <span>{{index + 1}} · </span>
              <span>{{song.songname}} - {{song.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!list.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getTopList} from 'api/rank';
  import {ERR_OK} from 'api/config';
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {playlistMixin} from 'common/js/mixin';
  import {mapMutations} from 'vuex';

  export default {
    mixins: [playlistMixin],
    components: {
      Scroll,
      Loading
    },
    data() {
      return {
        list: []
      }
    },
    created() {
      setTimeout(() => {
        this._getTopList();
      }, 500)
    },
    methods: {
      // 选择某个item之后，进行二级路由跳转，然后将这个item通过commit mutation的方式缓存到state里面
      selectItem(item) {
        this.$router.push({
          path: `/rank/${item.id}`
        })
        this.setTopList(item);
      },
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : '';
        this.$refs.rank.style.bottom = bottom;
        this.$refs.scroll.refresh();
      },
      _getTopList() {
        getTopList().then((res) => {
          if (res.code === ERR_OK) {
            this.list = res.data.topList;
          }
        })
      },
      ...mapMutations({
        setTopList: 'SET_TOPLIST'
      })
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  @import "~common/less/variable.less";
  @import "~common/less/mixin.less";

  .rank {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
    .toplist {
      height: 100%;
      overflow: hidden;
      .item {
        display: flex;
        margin: 0 20px;
        padding-top: 20px;
        height: 100px;
        &:last-child {
          padding-bottom: 20px;
        }
        .icon {
          flex: 0 0 100px;
          width: 100px;
          height: 100px;
        }
        .songlist {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 20px;
          height: 100px;
          overflow: hidden;
          background: @color-highlight-background;
          color: @color-text-d;
          font-size: @font-size-small;
          .song {
            .no-wrap();
            line-height: 26px;
          }
        }
      }
      .loading-container {
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
</style>
