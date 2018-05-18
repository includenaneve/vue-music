<template>
  <transition name="slide">
    <music-list :title="title" :bgImage="bgImage" :songs="songs" :rank="rank"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list';
  import {mapGetters} from 'vuex';
  import {ERR_OK} from 'api/config';
  import {getMusicList} from 'api/rank';
  import {getMusic} from 'api/singer';
  import {createSong} from 'common/js/song';

  export default {
    components: {MusicList},
    data() {
      return {
        songs: [],
        rank: true
      }
    },
    created() {
      if (!this.topList.id) {
        this.$router.push({
          path: `/rank`
        })
      }
      this._getMusicList();
    },
    methods: {
      _getMusicList() {
        getMusicList(this.topList.id).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.songlist);
          }
        })
      },
      _normalizeSongs(list) {
        let ret = [];
        list.forEach((item) => {
          let musicData = item.data;
          if (musicData.songmid && musicData.albummid) {
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
    },
    computed: {
      title() {
        return this.topList.topTitle;
      },
      bgImage() {
        if (this.songs.length) {
          return this.songs[0].image;
        }
      },
      ...mapGetters([
        'topList'
      ])
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  .slide-enter-active, .slide-leave-active {
    transition: all .3s ease-in-out;
  }

  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
</style>
