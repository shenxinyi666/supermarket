export function debounce(func, delay=50) {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

export function formatDate(date, fmt) {
  //获取年份(正则表达式)(y字符串匹配)
  //y+ -> 1个或者多个y
  //y* -> 0个或者多个y
  //y？ -> 0个或者1个y
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  //获取其他时间
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
};

//举例：6s
//'006'
//str.length为1
//substr(1)从索引1处开始截取，如果没有指定截取长度，默认截取后面的所有字符。
//return '06'
function padLeftZero(str) {
  return ('00' + str).substr(str.length);
};
