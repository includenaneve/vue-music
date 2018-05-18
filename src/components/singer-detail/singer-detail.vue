<template>
  <transition name="fade">
    <music-list :title="title" :songs="songs" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex';
  import {getSingerDetail, getMusic} from 'api/singer';
  import {ERR_OK} from 'api/config';
  import {createSong} from 'common/js/song';
  import MusicList from 'components/music-list/music-list';

  export default {
    name: 'singet-detail',
    components: {MusicList},
    data() {
      return {
        songs: []
      }
    },
    computed: {
      title() {
        return this.singer.name;
      },
      bgImage() {
        return this.singer.avatar;
      },
      ...mapGetters([
        'singer'
      ])
    },
    created() {
      this._getDetail()
    },
    methods: {
      _getDetail() {
        // 如果用户手动刷新了页面，这是singer.id不存在，就返回到上一个页面
        if (!this.singer.id) {
          this.$router.push('/singer');
          return;
        }
        getSingerDetail(this.singer.id).then((res) => {
          if (res.code === ERR_OK) {
            // console.log(this._normalizeSongs(res.data.list));
            this.songs = this._normalizeSongs(res.data.list)
          }
        });
      },
      _normalizeSongs(list) {
        let ret = [];
        list.forEach((item) => {
          let {musicData} = item;
          if (musicData.songid && musicData.albummid) {
            getMusic(musicData.songmid).then((res) => {
              if (res.code === ERR_OK) {
                const songVkey = res.data.items[0].vkey;
                const newSong = createSong(musicData, songVkey);
                ret.push(newSong);
              }
            })
          }
        });
        return ret;
      }
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  @import "~common/less/variable.less";

  .singer-detail {
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: @color-background;
  }

  .fade-enter-active, .fade-leave-active {
    transition: all .3s
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
