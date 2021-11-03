import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent  } from '@testing-library/react'
//import { prettyDOM } from '@testing-library/dom'
import Createblog from './Createblog'

describe('<Createblog />', () => {

  let component
  let mockHandler

  beforeEach(() => {
    mockHandler = jest.fn()

    component = render(
      <Createblog createBlog={mockHandler}/>
    )
  })

  test('<NoteForm /> updates parent state and calls onSubmit', () => {

    const form = component.container.querySelector('form')
    const title = component.container.querySelector('#title')
    const author = component.container.querySelector('#author')
    const url = component.container.querySelector('#url')

    fireEvent.change(title, {
      target: { value: 'otsake' }
    })
    fireEvent.change(author, {
      target: { value: 'kirjoittaja' }
    })
    fireEvent.change(url, {
      target: { value: 'osoite.fi' }
    })
    fireEvent.submit(form)

    expect(mockHandler.mock.calls).toHaveLength(1)
    expect(mockHandler.mock.calls[0][0].title).toBe('otsake')
    expect(mockHandler.mock.calls[0][0].author).toBe('kirjoittaja')
    expect(mockHandler.mock.calls[0][0].url).toBe('osoite.fi')
  })
})