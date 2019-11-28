const Cookie = {
  setCookie: function (name, value, expire) {
    var date = new Date()
    date.setSeconds(date.getSeconds() + expire)
    document.cookie = name + '=' + escape(value) + '; expires=' + date.toGMTString()
  },
  getCookie: function (name) {
    if (document.cookie.length > 0) {
      var start = document.cookie.indexOf(name + '=')
      if (start !== -1) {
        start = start + name.length + 1
        var end = document.cookie.indexOf(';', start)
        if (end === -1) end = document.cookie.length
        return unescape(document.cookie.substring(start, end))
      }
    }
    return ''
  },
  delCookie: function (name) {
    var date = new Date()
    date.setTime(date.getTime() - 10000)
    Cookie.setCookie(name, '', date)
  },
  clearAllCookie: function () {
    var cookies = document.cookie.split(';')
    var i = 0
    while (i < cookies.length) {
      var spcook = cookies[i].split('=')
      document.cookie = spcook[0] + '=0;expires=' + new Date(0).toUTCString()
      i++
    }
  }
}
export default Cookie
