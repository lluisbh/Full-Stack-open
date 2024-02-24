import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('Blog', () => {
  let container
  const blog = {
    title: 'Test blog',
    author: 'Test author',
    url: 'Test Url',
    likes: 7,
    user: {
      name: 'Test user'
    }
  }
  let likeHandler
  let removeHandler

  beforeEach(() => {
    likeHandler = jest.fn()
    removeHandler = jest.fn()
    container = render(
      <Blog blog={blog} likeAction={likeHandler} removeShow={true} removeAction={removeHandler}/>
    ).container
  })

  test('Renders the title and author, doesn\'t render likes and url', async () => {
    await screen.findAllByText('Test blog Test author')
    const div = container.querySelector('.togglableContent')
    expect(div).toHaveStyle('display: none')
  })

  test('Likes and url are rendered when clicking the \'view\' button', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const div = container.querySelector('.togglableContent')
    expect(div).not.toHaveStyle('display: none')
  })

  test('Clicking on \'like\' calls the likeAction', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('like')
    await user.click(button)
    await user.click(button)

    expect(likeHandler.mock.calls).toHaveLength(2)
  })
})