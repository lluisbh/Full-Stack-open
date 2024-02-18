import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog , likeAction, removeShow, removeAction }) => {
  //console.log(blog)
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }
  const removeStyle = { display: removeShow ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button style={hideWhenVisible} onClick={toggleVisibility}>view</button>
      <button style={showWhenVisible} onClick={toggleVisibility}>hide</button>
      <div style={showWhenVisible} className="togglableContent">
        {blog.url} <br/>
        {blog.likes} <button onClick={({ target }) => likeAction(blog)}>like</button> <br/>
        {blog.user.name} <br/>
        <button onClick={({ target }) => removeAction(blog)} style={removeStyle}>remove</button>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  likeAction: PropTypes.func.isRequired,
  removeShow: PropTypes.bool.isRequired,
  removeAction: PropTypes.func.isRequired,
}

export default Blog