const moment = require('moment')

//added ".add(3,'h')" for GMT+3 in current il time
module.exports = {
  formatDate: function (date, format) {
    return moment(date).add(3,'h').utc().format(format)
  },
}