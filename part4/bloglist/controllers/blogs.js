const blogRouter = require('express').Router()
const Blog = require("../models/blog")
const middleware = require("../utils/middleware")

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {name:1, username:1})
    response.json(blogs)
})
  
blogRouter.post('/', middleware.userExtractor, async (request, response) => {
    const user = request.user

    if (!Object.hasOwn(request.body, 'title')|| !Object.hasOwn(request.body, 'url')) {
        response.status(400).end()
        return
    }

    const blogObject = {
        title: request.body.title,
        author: request.body.author,
        url: request.body.url,
        likes: request.body.likes || 0,
        user: user.id
    }
    const blog = new Blog(blogObject)

    const result = await blog.save()
    user.blogs = user.blogs.concat(blog._id)
    await user.save()

    response.status(201).json(result)
})

blogRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
    const userId = request.user.id
    const blog = await Blog.findById(request.params.id)

    if (blog && blog.user.toString() !== userId.toString() ) {
        return response.status(401).json({ error: 'you are not allowed to delete this blog' })
    }

    const result = await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
    const body = request.body

    const blog = {
        likes: body.likes
    }
  
    const result = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(result)
})

module.exports = blogRouter