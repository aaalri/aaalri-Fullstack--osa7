import React from 'react'
import { useSelector } from 'react-redux'
import { Alert } from 'react-bootstrap'

const Notification = () => {
  const notification = useSelector(state => state.notification)

  if (notification.content === null) {
    return null
  }

  return (
    <Alert variant={notification.style}>
      {notification.content}
    </Alert>
  )
}

export default Notification