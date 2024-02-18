import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    }
    createBlog(blogObject)
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <form onSubmit={addBlog} >
      <div>
            title: <input value={newTitle} onChange={({ target }) => setNewTitle(target.value)} placeholder='Add title...'/>
      </div>
      <div>
            author: <input value={newAuthor} onChange={({ target }) => setNewAuthor(target.value)} placeholder='Add author...'/>
      </div>
      <div>
            url: <input value={newUrl} onChange={({ target }) => setNewUrl(target.value)} placeholder='Add url...'/>
      </div>
      <button type='submit'>create</button>
    </form>
  )
}

export default BlogForm