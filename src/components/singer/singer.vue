<template>
  <div class="singer">
  </div>
</template>

<script type="text/ecmascript-6">
  import {getSingerList} from 'api/singer';
  import {ERR_OK} from 'api/config';
  import Singer from 'common/js/singer'

  const HOT_NAME = '热';
  const HOT_SINGER_LEN = 10;

  export default {
    data() {
      return {
        singers: []
      }
    },
    created() {
      this._getSingerList();
    },
    methods: {
      _getSingerList() {
        getSingerList().then((res) => {
          if (res.code === ERR_OK) {
            console.log(this._normalizeSingerList(res.data.list));
          }
        })
      },
      _normalizeSingerList(list) {
        let map = {
          hot: {
            title: HOT_NAME,
            item: []
          }
        }
        list.forEach((item, index) => {
          if (index < HOT_SINGER_LEN) {
            map.hot.item.push(new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            }))
          }
          // a-z对应的歌手
          const key = item.Findex;
          if (!map[key]) {
            map[key] = {
              title: key,
              item: []
            }
          }
          map[key].item.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        })
        let hot = [];
        let ret = [];
        for (let key in map) {
          let item = map[key];
          if (item.title.match(/[a-zA-Z]/)) {
            ret.push(item);
          } else if (item.title === HOT_NAME) {
            hot.push(item);
          }
        }
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0);
        })
        return hot.concat(ret);
      }
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  .singer {
    position: fixed;
    top: 88px;
    bottom: 0;
    width: 100%;
  }
</style>
