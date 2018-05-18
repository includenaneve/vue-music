<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div class="play" v-show="songs.length>0" ref="playBtn" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll @scroll="scroll"
            :probe-type="probeType"
            :listen-scroll="listenScroll"
            :data="songs"
            class="list"
            ref="list">
      <div class="song-list-wrapper">
        <song-list @select="selectItem" :songs="songs" :rank="rank"></song-list>
      </div>
      <loading class="loading-container" v-show="!songs.length"></loading>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll';
  import SongList from 'base/song-list/song-list';
  import {profixStyle} from 'common/js/dom';
  import Loading from 'base/loading/loading';
  import {mapActions} from 'vuex';
  import {playlistMixin} from 'common/js/mixin';

  // 预留高度
  const RESOLVED_HEIGHT = 40;
  const transform = profixStyle('transform');
  const backdrop = profixStyle('backdrop');

  export default {
    mixins: [playlistMixin],
    name: 'music-list',
    components: {SongList, Scroll, Loading},
    data() {
      return {
        scrollY: 0
      }
    },
    props: {
      bgImage: {
        type: String,
        default: ''
      },
      songs: {
        type: Array,
        default: () => []
      },
      title: {
        type: String,
        default: ''
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    created() {
      this.probeType = 3;
      this.listenScroll = true;
    },
    mounted() {
      this.imageHeight = this.$refs.bgImage.clientHeight;
      // 能往上移动的最大距离
      this.minTranslateY = -this.imageHeight + RESOLVED_HEIGHT;
      // this.$refs.list取到的是vue component对象，所以要加$el将其转换成dom元素。
      this.$refs.list.$el.style.top = `${this.imageHeight}px`;
    },
    methods: {
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : '';
        this.$refs.list.$el.style.bottom = bottom;
        this.$refs.list.refresh();
      },
      back() {
        this.$router.back();
      },
      scroll(pos) {
        this.scrollY = pos.y;
        // console.log(this.scrollY)
      },
      selectItem(item, index) {
        this.selectPlay({
          list: this.songs,
          index
        })
      },
      random() {
        this.randomPlay({
          list: this.songs
        })
      },
      ...mapActions([
        'selectPlay',
        'randomPlay'
      ])
    },
    watch: {
      // newY往上移动是负值 往下移动是正值
      scrollY(newY) {
        // 垂直的偏移量
        let translateY = Math.max(this.minTranslateY, newY);
        let zIndex = 0;
        // 放大的倍数
        let scale = 1;
        const precent = Math.abs(newY / this.imageHeight);
        let blur = 0;
        this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`;
        if (newY > 0) { // 往下拉的时候放大图片，并将图片的层级往上调
          scale = 1 + precent;
          zIndex = 10;
        } else {
          blur = Math.min(20 * precent, 20);
        }
        // ios高斯模糊效果
        this.$refs.filter.style[backdrop] = `blur(${blur}px)`;
        // 如果往上拉到尽头，就修改图片样式，并且隐藏随机播放按钮
        if (newY < this.minTranslateY) {
          zIndex = 10;
          this.$refs.bgImage.style.paddingTop = 0;
          this.$refs.bgImage.style.height = `${RESOLVED_HEIGHT}px`;
          this.$refs.playBtn.style.display = 'none';
        } else {
          this.$refs.bgImage.style.paddingTop = '70%';
          this.$refs.bgImage.style.height = 0;
          this.$refs.playBtn.style.display = '';
        }
        // 其余情况就是图片不断缩小的过程
        this.$refs.bgImage.style.zIndex = zIndex;
        this.$refs.bgImage.style[transform] = `scale(${scale})`;
      }
    },
    computed: {
      bgStyle() {
        return `background-image:url(${this.bgImage})`;
      }
    }

  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  @import "~common/less/variable.less";
  @import "~common/less/mixin.less";

  .music-list {
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: @color-background;
    .back {
      position: absolute;
      top: 0;
      left: 6px;
      z-index: 50;
      .icon-back {
        display: block;
        padding: 10px;
        font-size: @font-size-large-x;
        color: @color-theme;
      }
    }
    .title {
      position: absolute;
      top: 0;
      left: 10%;
      z-index: 40;
      width: 80%;
      .no-wrap;
      text-align: center;
      line-height: 40px;
      font-size: @font-size-large;
      color: @color-text-ll;
    }
    .bg-image {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 70%;
      transform-origin: top;
      background-repeat: no-repeat;
      background-size: cover;
      .play-wrapper {
        position: absolute;
        bottom: 20px;
        z-index: 50;
        width: 100%;
        .play {
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          box-sizing: border-box;
          width: 135px;
          padding: 7px 0;
          margin: 0 auto;
          text-align: center;
          border: 1px solid @color-theme;
          color: @color-theme;
          border-radius: 100px;
          font-size: 0;
          .icon-play {

            display: inline-block;;
            vertical-align: middle;
            margin-right: 6px;
            font-size: @font-size-medium-x;
          }
          .text {
            display: inline-block;;
            vertical-align: middle;
            font-size: @font-size-small;
          }
        }
        .filter {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(7, 17, 27, 0.4);
        }
      }
    }
    .bg-layer {
      position: relative;
      height: 100%;
      background: @color-background;
    }
    .list {
      position: fixed;
      top: 0;
      bottom: 0;
      width: 100%;
      background: @color-background;
      .song-list-wrapper {
        padding: 20px 30px;
      }
      .loading-container {
        position: absolute;
        width: 100%;
        top: 50%;
        -webkit-transform: translateY(-50%);
        -moz-transform: translateY(-50%);
        -ms-transform: translateY(-50%);
        -o-transform: translateY(-50%);
        transform: translateY(-50%);
      }
    }
  }
</style>
