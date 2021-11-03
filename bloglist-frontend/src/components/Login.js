import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button } from 'react-bootstrap'

const Login = (props) => {

  Login.propTypes = {
    handleLogin: PropTypes.func.isRequired,
    setUsername: PropTypes.func.isRequired,
    setPassword: PropTypes.func.isRequired,
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired
  }

  return (
    <div>
      <h2>Log in to application</h2>
      <Form onSubmit={props.handleLogin}>
        <Form.Group>
          <Form.Label>username:</Form.Label>
          <Form.Control
            id="username"
            type="text"
            value={props.username}
            name="Username"
            onChange={({ target }) => props.setUsername(target.value)}
          />

          <Form.Label>password:</Form.Label>
          <Form.Control
            id="password"
            type="password"
            value={props.password}
            name="Password"
            onChange={({ target }) => props.setPassword(target.value)}
          />
          <Button variant="primary" id="login-button" type="submit">login</Button>
        </Form.Group>
      </Form>
    </div>
  )
}

export default Login