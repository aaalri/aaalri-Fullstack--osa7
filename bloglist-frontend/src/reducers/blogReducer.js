import blogService from '../services/blogs'
import { setNotification } from './notificationReducer'


export const createBlog = (blogObject) => {
  return async dispatch => {
    try {
      const newBlog = await blogService.create(blogObject)
      dispatch ({
        type: 'NEW_BLOG',
        data: newBlog
      })
      dispatch(setNotification(`a new blog ${blogObject.title} ${blogObject.author} added`))
    } catch (exception) {
      dispatch(setNotification('adding blog failed','danger'))
    }
  }
}

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch ({
      type: 'INIT_BLOGS',
      data: blogs
    })
  }
}

export const deleteBlog = (blog) => {
  return async dispatch => {
    try {
      await blogService.remove(blog.id)
      dispatch ({
        type: 'DELETE_BLOG',
        data: { id: blog.id }
      })
      dispatch(setNotification(`blog ${blog.title} ${blog.author} deleted`))
    } catch (exception) {
      dispatch(setNotification('blog deletion failed','danger'))
    }
  }
}

export const clickLike = (blog) => {
  return async dispatch => {
    const changedBlog = {
      url: blog.url,
      title: blog.title,
      author: blog.author,
      user: blog.user.id,
      likes: blog.likes + 1,
      comments: blog.comments
    }
    try {
      await blogService.update(blog.id, changedBlog)
      await dispatch ({
        type: 'LIKE',
        data: { id: blog.id }
      })
      dispatch(setNotification(`blog ${blog.title} ${blog.author} likes updated`))
    } catch (exception) {
      dispatch(setNotification('updating blog failed','danger'))
    }
  }
}

export const addComment = (blog, comment) => {
  return async dispatch => {
    try {
      await blogService.comment(blog.id, { comment: comment })
      await dispatch ({
        type: 'ADD_COMMENT',
        data: {
          id: blog.id,
          comment: comment
        }
      })
      dispatch(setNotification(`blog ${blog.title} ${blog.author} comments updated`))
    } catch (exception) {
      dispatch(setNotification('updating comments failed','danger'))
    }
  }
}

const blogReducer = (state = [], action) => {
  let changedBlog = {}
  switch (action.type) {

  case 'NEW_BLOG':
    return state.concat(action.data)

  case 'DELETE_BLOG': {
    const id = action.data.id
    var filtered = state.filter(n => n.id !== id)
    return filtered
  }

  case 'INIT_BLOGS':
    return action.data

  case 'LIKE': {
    const id = action.data.id
    const blogToChange = state.find(n => n.id === id)
    changedBlog = {
      id: id,
      url: blogToChange.url,
      title: blogToChange.title,
      author: blogToChange.author,
      user: blogToChange.user,
      likes: blogToChange.likes + 1,
      comments: blogToChange.comments
    }
    return state.map(blog =>
      blog.id !== id ? blog : changedBlog
    ).sort((firstBlog, secondBlog) => {
      return secondBlog.likes - firstBlog.likes
    })
  }

  case 'ADD_COMMENT': {
    const id = action.data.id
    const blogToChange = state.find(n => n.id === id)
    changedBlog = {
      id: id,
      url: blogToChange.url,
      title: blogToChange.title,
      author: blogToChange.author,
      user: blogToChange.user,
      likes: blogToChange.likes,
      comments: blogToChange.comments.concat(action.data.comment)
    }
    return state.map(blog =>
      blog.id !== id ? blog : changedBlog
    ).sort((firstBlog, secondBlog) => {
      return secondBlog.likes - firstBlog.likes
    })
  }

  default: return state
  }
}

export default blogReducer