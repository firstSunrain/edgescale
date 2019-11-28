const publicJS = {
  timetrans: function (mydat) {
    var dat = new Date(mydat)
    var Y = dat.getFullYear() + '-'
    var M = (dat.getMonth() + 1 < 10 ? '0' + (dat.getMonth() + 1) : dat.getMonth() + 1) + '-'
    var D = (dat.getDate() < 10 ? '0' + (dat.getDate()) : dat.getDate()) + ' '
    var h = (dat.getHours() < 10 ? '0' + dat.getHours() : dat.getHours()) + ':'
    var m = (dat.getMinutes() < 10 ? '0' + dat.getMinutes() : dat.getMinutes()) + ':'
    var s = (dat.getSeconds() < 10 ? '0' + dat.getSeconds() : dat.getSeconds())
    return Y + M + D + h + m + s
  }
} 

export default publicJS