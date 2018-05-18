<template>
  <scroll class="suggest"
          :data="result"
          :pullup=pullup
          @scrollToEnd="searchMore"
          ref="suggest"
  >
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="(item,index) in result" :key="index">
        <div class="icon">
          <i :class="getIconClass(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title="加载更多..."></loading>
    </ul>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import {search} from 'api/search';
  import {ERR_OK} from 'api/config';
  import {createSong, _createSong} from 'common/js/song';
  import Scroll from 'base/scroll/scroll';
  import Loading from 'base/loading/loading'
  import {getMusic} from 'api/singer'
  import Singer from 'common/js/singer'
  import {mapMutations, mapActions} from 'vuex'

  const TYPE_SINGER = 'singer';
  const perpage = 20;
  export default {
    components: {
      Loading,
      Scroll
    },
    props: {
      query: {
        type: String,
        default: ''
      },
      showSinger: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        page: 1,
        result: [],
        pullup: true,
        hasMore: true
      }
    },
    methods: {
      selectItem(item) {
        if (item.type === TYPE_SINGER) {
          const singer = new Singer({
            id: item.singermid,
            name: item.singername
          })
          this.$router.push({
            path: `/search/${singer.id}`
          })
          this.setSinger(singer);
        } else {
          console.log(1, item);
          getMusic(item.mid).then((res) => {
            if (res.code === ERR_OK) {
              const songVkey = res.data.items[0].vkey;
              const newSong = _createSong(item, songVkey);
              this.insertSong(newSong);
            }
          })
        }
      },
      getDisplayName(item) {
        if (item.type === TYPE_SINGER) {
          return item.singername;
        } else {
          return `${item.name} - ${item.singer}`
        }
      },
      getIconClass(item) {
        if (item.type === TYPE_SINGER) {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
      _checkMore(data) {
        const song = data.song;
        if (!song.list.length || (song.curnum + song.curpage * perpage) > song.totalnum) {
          this.hasMore = false;
        }
      },
      searchMore(code) {
        if (!this.hasMore) {
          return;
        }
        this.page++;
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === ERR_OK) {
            this.result = this.result.concat(this._genResult(res.data));
            this._checkMore(res.data);
          }
        })
      },
      _search() {
        this.page = 1;
        this.hasMore = true;
        this.$refs.suggest.scrollTo(0, 0);
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === ERR_OK) {
            this.result = this._genResult(res.data);
            // console.log(this.result);
            this._checkMore(res.data);
          }
        })
      },
      _genResult(data) {
        let ret = [];
        if (data.zhida && data.zhida.singerid) {
          // 等同于 [] = Object.assign({},data.zhida,{type:...})
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})
        }
        if (data.song) {
          ret = ret.concat(this._normalizeSongs(data.song.list));
        }
        return ret;
      },
      _normalizeSongs(list) {
        let ret = [];
        list.forEach((item) => {
          let musicData = item;
          if (musicData.songmid && musicData.albummid) {
            ret.push(createSong(musicData));
          }
        });
        return ret;
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      ...mapActions([
        'insertSong'
      ])
    },
    watch: {
      query() {
        this._search();
      }
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  @import "~common/less/variable.less";
  @import "~common/less/mixin.less";

  .suggest {
    height: 100%;
    overflow: hidden;
    .suggest-list {
      padding: 0 30px;
      .suggest-item {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        .icon {
          flex: 0 0 30px;
          width: 30px;
          [class^="icon-"] {
            font-size: 14px;
            color: @color-text-d;
          }
        }
        .name {
          flex: 1;
          font-size: @font-size-medium;
          color: @color-text-d;
          overflow: hidden;
          .text {
            .no-wrap();
          }
        }
      }
    }
    .no-result-wrapper {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>
