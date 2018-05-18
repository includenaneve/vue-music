import {getLyric} from 'api/song';
import {ERR_OK} from 'api/config';
import {Base64} from 'js-base64' // 用来对歌词数据进行解密

export default class Song {
  constructor({id, mid, singer, name, album, duration, image, url}) {
    this.id = id;
    this.mid = mid;
    this.singer = singer;
    this.name = name;
    this.album = album;
    this.duration = duration;
    this.image = image;
    this.url = url;
  }

  // 类的成员函数，每个对象实体都能使用
  getLyric() {
    // 每次currentSong变化都会触发这个请求。因此做限制
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric);
          resolve(this.lyric);
        } else {
          reject(new Error('找不到歌词'))
        }
      })
    })
  }
}


export function createSong(musicData, songVkey, isSearch = false) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: isSearch ? musicData.singer : filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `http://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://thirdparty.gtimg.com/C400${musicData.songmid}.m4a?vkey=${songVkey}&guid=3428843300&uin=0&fromtag=66`
  })
}

export function _createSong(item, songVkey) {
  return new Song({
    id: item.id,
    mid: item.mid,
    singer: item.singer,
    name: item.name,
    album: item.album,
    duration: item.duration,
    image: item.image,
    url: `http://thirdparty.gtimg.com/C400${item.mid}.m4a?vkey=${songVkey}&guid=3428843300&uin=0&fromtag=66`
  })
}

function filterSinger(singer) {
  let ret = [];
  if (!singer) {
    return;
  }
  singer.forEach((s) => {
    ret.push(s.name);
  })
  return ret.join('/');
}
