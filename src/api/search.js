import jsonp from '../common/js/jsonp.js'
import {commonParams, options} from './config.js'

export function getHotTips() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg';

  const data = Object.assign({}, commonParams, {
    format: 'json',
    playform: 'h5',
    needNewCode: 1,
    _: +new Date()
  })
  return jsonp(url, data, options);
}

// query查询字符串 page第几页 zhida要不要歌手
export function search(query, page, zhida, perpage) {
  const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp';

  const data = Object.assign({}, commonParams, {
    uin: 0,
    notice: 0,
    platform: 'h5',
    needNewCode: 1,
    w: query,
    zhidaqu: 1,
    catZhida: zhida ? 1 : 0,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    perpage,
    n: perpage,
    p: page,
    remoteplace: 'txt.mqq.all'
  })
  return jsonp(url, data, options);
}
