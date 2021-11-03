import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  BrowserRouter as Router,
  Switch, Route, Link
} from 'react-router-dom'
import { Navbar, Nav, Container } from 'react-bootstrap'
import Notification from './components/Notification'
import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs } from './reducers/blogReducer'
import { setUser, clearUser } from './reducers/userReducer'
import Blog from './components/Blog'
import Blogdetails from './components/Blogdetails'
import Usertable from './components/Usertable'
import User from './components/User'
import Login from './components/Login'
import Logout from './components/Logout'
import Createblog from './components/Createblog'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [users, setUsers] = useState([])
  const blogFormRef = useRef()
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    userService.getAll().then(users => {
      setUsers( users )
    })
  }, [blogs])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password, })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      dispatch(setUser(user))
      setUsername('')
      setPassword('')
      dispatch(setNotification('login success'))
    } catch (exception) {
      dispatch(setNotification('wrong username or password','danger'))
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    dispatch(clearUser())
    dispatch(setNotification('logout success'))
  }


  const Menu = () => {
    return (
      <Navbar collapseOnSelect expand="lg" bg="success" variant="dark">
        <div className="navbar-header">
          <a className="navbar-brand">Blogs</a>
        </div>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link eventKey="link-1" href="#" as="span">
              <Link to="/">Blogs</Link>
            </Nav.Link>
            <Nav.Link eventKey="link-2" href="#" as="span">
              <Link to="/users">Users</Link>
            </Nav.Link>
            <span className="navbar-text text-light">{user.name} logged in <Logout handleLogout={handleLogout}/></span>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }

  if (user === null) {
    return (
      <div>
        <Notification />
        <Container>
          <Login username={username} password={password} handleLogin={handleLogin} setUsername={setUsername} setPassword={setPassword} />
        </Container>
      </div>
    )
  } else {
    return (
      <Router>
        <div>
          <Notification />
          <Menu />
          <Container>
            <Switch>
              <Route path="/blogs/:id">
                <Blogdetails blogs={blogs} user={user} />
              </Route>
              <Route path="/users/:id">
                <User users={users} />
              </Route>
              <Route path="/users">
                <h1>Users</h1>
                <Usertable users={users} />
              </Route>
              <Route path="/">
                <Togglable buttonLabel="new blog" ref={blogFormRef}>
                  <Createblog />
                </Togglable>
                <br></br>
                <div className='blogs'>
                  {blogs.map(blog =>
                    <Blog key={blog.id} blog={blog}/>
                  )}
                </div>
              </Route>
            </Switch>
          </Container>
        </div>
      </Router>
    )
  }
}

export default App