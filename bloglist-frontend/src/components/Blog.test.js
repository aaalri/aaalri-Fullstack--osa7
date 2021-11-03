import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent  } from '@testing-library/react'
//import { prettyDOM } from '@testing-library/dom'
import Blog from './Blog'

describe('<Blog />', () => {

  let component
  let mockHandler

  beforeEach(() => {
    mockHandler = jest.fn()

    const user = {
      username: 'testia',
      name: 'Testi Testaaja',
      blogs: [],
      id: '6177644cbc6f09d3e57eb6ec'
    }
    const blog = {
      title: 'hello',
      author: 'auth',
      url: 'url',
      likes: 2,
      user: {
        username: 'testi',
        name: 'Testi Testaaja',
        id: '6177764aad40baa792ad504e'
      },
    }

    component = render(
      <Blog blog={blog} user={user} updateBlog={mockHandler} deleteBlog={mockHandler} />
    )
  })

  test('at start only title and auth are displayed', () => {
    const titleAuth = component.container.querySelector('.titleAuth')
    expect(titleAuth).toBeVisible()
    const url = component.container.querySelector('.url')
    expect(url).not.toBeVisible()
    const like = component.container.querySelector('.like')
    expect(like).not.toBeVisible()
    const user = component.container.querySelector('.user')
    expect(user).not.toBeVisible()
  })

  test('pressing show displays rest', () => {
    const button = component.getByText('show')
    fireEvent.click(button)

    const url = component.container.querySelector('.url')
    expect(url).toBeVisible()
    const like = component.container.querySelector('.like')
    expect(like).toBeVisible()
    const user = component.container.querySelector('.user')
    expect(user).toBeVisible()
  })

  test('pressing like twice triggers handle twice', () => {
    const button = component.getByText('like')
    fireEvent.click(button)
    fireEvent.click(button)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})