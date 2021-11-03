import React, { useState } from 'react'
import { clickLike, deleteBlog, addComment } from '../reducers/blogReducer'
import { useDispatch } from 'react-redux'
import { useParams, Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'

const Blogdetails = ({ blogs, user }) => {
  const dispatch = useDispatch()
  const id = useParams().id
  const blog = blogs.find(n => n.id === id)
  const [newComment, setNewComment] = useState('')

  if (!blog) { return null }
  if(blog.comments === undefined){
    blog.comments = []
  }

  const handleUpdateBlog = async (event) => {
    event.preventDefault()
    dispatch(clickLike(blog))
  }

  const handleDeleteBlog = async (event) => {
    event.preventDefault()
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)){
      dispatch(deleteBlog(blog))
    }
  }

  const handleAddComment = async (event) => {
    event.preventDefault()
    setNewComment('')
    dispatch(addComment(blog, newComment))
  }

  return (
    <div className='blog'>
      <h1 className='titleAuth'> Blog: {blog.title} {blog.author}</h1>
      <p className='url'>url: {blog.url}</p>
      <p className='like'>Likes {blog.likes} <Button size="sm" variant="primary" id="like-button" onClick={handleUpdateBlog}>like</Button> </p>
      <p className='user'>added by <Link to={`/users/${blog.user.id}`}>{blog.user.name}</Link> </p>
      {blog.user.username === user.username &&
        <Button size="sm" variant="danger" id="delete-button" onClick={handleDeleteBlog}>delete</Button>
      }
      <h3>Blog comments </h3>
      <Form onSubmit={handleAddComment}>
        <h2> Create comment </h2>
        <Form.Group>
          <Form.Label>Comment:</Form.Label>
          <Form.Control
            id="comment"
            value={newComment}
            onChange={({ target }) => setNewComment(target.value)}
          />
          <Button size="sm" variant="success" id="create-comment" type="submit">create</Button>
        </Form.Group>
      </Form>
      <ul>
        {blog.comments.map((comment, key) =>
          <li key={key}> {comment} </li>
        )}
      </ul>
    </div>

  )}

export default Blogdetails