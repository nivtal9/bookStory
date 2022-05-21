const moment = require('moment')

//added ".add(3,'h')" for GMT+3 in current il time
//this is a function to format the date to a regular instead of a long one
module.exports = {
  formatDate: function (date, format) {
    return moment(date).add(3,'h').utc().format(format)
  },
  // this is a function to shorten the stories in 'public stories' to a max
  // value that determined in 'viewes/stories/index.hbs'
  truncate: function (str, len) {
    if (str.length > len && str.length > 0) {
      let new_str = str + ' '
      new_str = str.substr(0, len)
      new_str = str.substr(0, new_str.lastIndexOf(' '))
      new_str = new_str.length > 0 ? new_str : str.substr(0, len)
      return new_str + '...'
    }
    return str
  },
  //this is a function to drop all html tags when story withdrawn from MongoDB
  stripTags: function (input) {
    return input.replace(/<(?:.|\n)*?>/gm, '')
    },

    //this is a function to create a floating editicon if the user is applicable to edit the story
    editIcon: function (storyUser, loggedUser, storyId, floating = true) {
      if (storyUser._id.toString() == loggedUser._id.toString()) {
        if (floating) {
          return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`
        } else {
          return `<a href="/stories/edit/${storyId}"><i class="fas fa-edit"></i></a>`
        }
      } else {
        return ''
      }
    },
    // this is a function to get the recent status of the story (private/public) and assign it
    // to the select input at the edit story page
    select: function (selected, options) {
      return options
        .fn(this)
        .replace(
          new RegExp(' value="' + selected + '"'),
          '$& selected="selected"'
        )
        .replace(
          new RegExp('>' + selected + '</option>'),
          ' selected="selected"$&'
        )
    },
}