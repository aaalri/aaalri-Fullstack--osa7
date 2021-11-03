import React, { useState } from 'react'
import { createBlog } from '../reducers/blogReducer'
import { useDispatch } from 'react-redux'
import { Form, Button } from 'react-bootstrap'


const Createblog = () => {
  const dispatch = useDispatch()

  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const handleAddBlog = async (event) => {
    event.preventDefault()
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
    dispatch(createBlog({ title: newTitle, author: newAuthor, url: newUrl }))
  }

  return (
    <Form onSubmit={handleAddBlog}>
      <Form.Group>
        <h2> Create blog </h2>
        <Form.Label>Title:</Form.Label>
        <Form.Control
          id="title"
          value={newTitle}
          onChange={({ target }) => setNewTitle(target.value)}
        />
        <Form.Label>Author:</Form.Label>
        <Form.Control
          id="author"
          value={newAuthor}
          onChange={({ target }) => setNewAuthor(target.value)}
        />
        <Form.Label>Url:</Form.Label>
        <Form.Control
          id="url"
          value={newUrl}
          onChange={({ target }) => setNewUrl(target.value)}
        />
        <Button variant="success" id="create-blog" type="submit">create</Button>
      </Form.Group>
    </Form>
  )
}

export default Createblog