<template>
  <transition name="fade">
    <music-list :title="title" :bgImage="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list';
  import {mapGetters} from 'vuex'
  import {getDisc} from 'api/recommend';
  import {ERR_OK} from 'api/config';
  import {createSong} from 'common/js/song';
  import {getMusic} from 'api/singer';

  export default {
    data() {
      return {
        songs: []
      }
    },
    components: {
      MusicList
    },
    created() {
      this._getSonglist();
    },
    methods: {
      _getSonglist() {
        if (!this.disc.dissid) {
          this.$router.push('/recommend');
          return;
        }
        getDisc(this.disc.dissid).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.cdlist[0].songlist);
          }
        })
      },
      _normalizeSongs(list) {
        let ret = [];
        list.forEach((item) => {
          let musicData = item;
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
        return this.disc.dissname;
      },
      bgImage() {
        return this.disc.imgurl;
      },
      ...mapGetters([
        'disc'
      ])
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  @import "~common/less/variable.less";

  .fade-enter-active, .fade-leave-active {
    transition: all .3s
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
