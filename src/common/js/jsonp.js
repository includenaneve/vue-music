/**
 * Created by naneve on 2018/3/10.
 */
import originJSONP from 'jsonp'

export default function jsonp(url, data, option) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data);
  // console.log(url);
  return new Promise((resolve, reject) => {
    originJSONP(url, option, (err, data) => {
      if (!err) {
        resolve(data);
      } else {
        reject(err);
      }
    })
  })
}

export function param(data) {
  let url = '';
  for (var k in data) {
    let value = data[k] !== undefined ? data[k] : '';
    if (typeof value === 'object') {
      value = JSON.stringify(value);
    }
    url += `&${k}=${encodeURIComponent(value)}`
  }
  return url ? url.substring(1) : '';
}
