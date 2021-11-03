import React from 'react'
import { Button } from 'react-bootstrap'

const Logout = (props) => {  return (
  <Button variant="secondary" size="sm" type="submit" onClick={props.handleLogout}>logout</Button>
)
}

export default Logout