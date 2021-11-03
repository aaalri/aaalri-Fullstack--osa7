var _ = require('lodash')

const sum_blogs = (array) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }
  return array.length === 0
    ? 0
    : array.reduce(reducer, 0)
}

const max_blog = (array) => {
  const reducer = (last, cur) => {
    return cur.likes < last.likes
      ? last
      : cur
  }
  return array.length === 0
    ? 0
    : array.reduce(reducer)
}


const max_blogs_blogger = (array) => {
  return _(array)
    .countBy('author')
    .map((val, key) => ({ author: key, blogs: val }))
    .orderBy( 'blogs', 'desc')
    .first()
}

const max_like_blogger = (array) => {
  return _(array)
    .map(function(objects) {
      return _.pick(objects, ['author', 'likes'])
    })
    .groupBy('author')
    .map((val, key) => ({ author: key, likes: _.sumBy(val, 'likes') }))
    .orderBy('likes', 'desc')
    .first()

}

const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return sum_blogs(blogs)
}

const favoriteBlog = (blogs) => {
  return max_blog(blogs)
}

const mostBlogs = (blogs) => {
  return max_blogs_blogger(blogs)
}

const mostLikes = (blogs) => {
  return max_like_blogger(blogs)
}



module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}