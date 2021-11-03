import React from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'

const User = ({ users }) => {
  const id = useParams().id
  const user = users.find(n => n.id === id)

  if (!user) { return null }

  return (
    <div>
      <h1>{user.name}</h1>
      <h3>Added blogs</h3>
      {user.blogs.length === 0 &&
        <p> User has added no blogs </p>
      }
      <ul>
        {user.blogs.map(blog =>
          <li key = {blog.id}><Link to={`/blogs/${blog.id}`}> {blog.title} </Link></li>
        )}
      </ul>
    </div>
  )}

export default User

