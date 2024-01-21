import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import { Notification } from './components/Notification'

const App = () => {
  const [message, setMessage] = useState({text: null, type: null})
  const [blogs, setBlogs] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)

  const resetMessage = () => setMessage({text: null, type: null});
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
      setBlogs( blogs )
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

  const handleLogout = ({target}) => {
    window.localStorage.clear()
    setUser(null)
  }

  const addBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    }
    try {
      const newBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(newBlog))
      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')
      setMessageConfirm(`a new blog "${newTitle}" was added`)
    } catch (exception) {
      setMessageError('Unable to add blog')
    }
  }
  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>

        <Notification message={message.text} type={message.type}/>

        <form onSubmit={handleLogin}>
          <div>
            username <input type='text' value={username} onChange={({target}) => setUsername(target.value)}/>
          </div>
          <div>
            password <input type='password' value={password} onChange={({target}) => setPassword(target.value)}/>
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
      <h2>create new</h2>
      <form onSubmit={addBlog} >
        <div>
          title: <input value={newTitle} onChange={({target}) => setNewTitle(target.value)} />
        </div>
        <div>
          author: <input value={newAuthor} onChange={({target}) => setNewAuthor(target.value)} />
        </div>
        <div>
          url: <input value={newUrl} onChange={({target}) => setNewUrl(target.value)} />
        </div>
        <button type='submit'>create</button>
      </form>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App