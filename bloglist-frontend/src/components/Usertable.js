import React from 'react'
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'

const User = ({ user }) => {

  return (
    <tr className='user'>
      <td className='name'> <Link to={`/users/${user.id}`}>{user.name}</Link> </td>
      <td className='blogs'>{user.blogs.length}</td>
    </tr>
  )}

const Users = ({ users }) => {

  return (
    <Table striped bordered hover size="sm">
      <thead>
        <tr>
          <th>Name</th>
          <th>Blogs count</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user =>
          <User key={user.id} user={user}/>
        )}
      </tbody>
    </Table>
  )}

export default Users