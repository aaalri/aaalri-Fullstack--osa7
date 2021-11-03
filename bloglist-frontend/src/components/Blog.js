import React from 'react'
import { Link } from 'react-router-dom'
import { ListGroup } from 'react-bootstrap'

const Blog = ({ blog }) => {

  return (

    <div className='blog'>
      <ListGroup variant="flush">
        <Link to={`/blogs/${blog.id}`}>
          <ListGroup.Item> Blog: {blog.title} {blog.author} </ListGroup.Item>
        </Link>
      </ListGroup>
    </div>
  )}

export default Blog