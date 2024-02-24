import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('BlogForm', () => {
  let container
  let addBlogHandler

  beforeEach(() => {
    addBlogHandler = jest.fn()
    container = render(
      <BlogForm createBlog={addBlogHandler}/>
    ).container
  })

  test('Blogform calls addBlog on submit, with all information', async () => {
    const user = userEvent.setup()

    const inputTitle = screen.getByPlaceholderText('Add title...')
    const inputAuthor = screen.getByPlaceholderText('Add author...')
    const inputUrl = screen.getByPlaceholderText('Add url...')
    const sendButton = screen.getByText('create')

    await user.type(inputTitle, 'Input Title')
    await user.type(inputAuthor, 'Input Author')
    await user.type(inputUrl, 'Input Url')
    await user.click(sendButton)

    expect(addBlogHandler.mock.calls).toHaveLength(1)
    expect(addBlogHandler.mock.calls[0][0].title).toBe('Input Title')
    expect(addBlogHandler.mock.calls[0][0].author).toBe('Input Author')
    expect(addBlogHandler.mock.calls[0][0].url).toBe('Input Url')
  })
})