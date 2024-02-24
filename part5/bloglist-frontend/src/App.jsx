import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import { Notification } from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [message, setMessage] = useState({ text: null, type: null })
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  const resetMessage = () => setMessage({ text: null, type: null })
  const setMessageError = (messageText) => {
    setMessage({
      text: messageText,
      type: 'error'
    })
    setTimeout(resetMessage, 5000)
  }
  const setMessageConfirm = (messageText) => {
    setMessage({
      text: messageText,
      type: 'confirm'
    })
    setTimeout(resetMessage, 5000)
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort((blog1,blog2) => (blog2.likes-blog1.likes)) )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
    } catch (exception) {
      setMessageError(exception.response.data.error)
    }
  }

  const handleLogout = ({ target }) => {
    window.localStorage.clear()
    setUser(null)
  }

  const addBlog = async (blog) => {
    try {
      const newBlog = await blogService.create(blog)
      newBlog.user = user
      setBlogs(blogs.concat(newBlog))
      setMessageConfirm(`a new blog "${newBlog.title}" was added`)
      blogFormRef.current.toggleVisibility()
    } catch (exception) {
      setMessageError('Unable to add blog')
    }
  }

  const addLike = async (blog) => {
    try {
      blog.likes += 1
      const modifiedBlog = {
        user : blog.user.id,
        likes: blog.likes,
        author: blog.author,
        title: blog.title,
        url: blog.url,
      }
      await blogService.modify(modifiedBlog, blog.id)
      setBlogs(blogs
        .map(b => (blog.id === b.id) ? blog : b)
        .sort((blog1,blog2) => (blog2.likes-blog1.likes))
      )

    } catch (exception) {
      console.log(exception)
      setMessageError('Could not like blog')
    }
  }

  const removeBlog = async (blog) => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)){
      try {
        await blogService.remove(blog.id)
        setMessageConfirm(`Blog "${blog.title}" removed`)
        setBlogs(blogs
          .filter(b => blog.id !== b.id)
        )
      } catch (exception) {
        console.log(exception)
        setMessageError('Could not remove blog')
      }
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>

        <Notification message={message.text} type={message.type}/>

        <form onSubmit={handleLogin}>
          <div>
            username <input id='username' type='text' value={username} onChange={({ target }) => setUsername(target.value)}/>
          </div>
          <div>
            password <input id='password' type='password' value={password} onChange={({ target }) => setPassword(target.value)}/>
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>

      <Notification message={message.text} type={message.type}/>

      <div>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </div>
      <br/>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <h2>create new</h2>
        <BlogForm createBlog={addBlog}/>
      </Togglable>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} likeAction={addLike} removeShow= {blog.user.username === user.username} removeAction={removeBlog}/>
      )}
    </div>
  )
}

export default App