const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")

const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

const URL = '/api/blogs'

beforeEach(async() => {
    await User.deleteMany({})
    const initialUsers = await helper.initializeUsers()
    const usersPromise = initialUsers.map(async (user) => {
        const userEntry = new User(await user)
        return await userEntry.save()
    })
    await Promise.all(usersPromise)
    const userDefaultId = (await helper.usersInDb())[0].id
    await Blog.deleteMany({})
    const blogsPromise = helper.initialBlogs.map(async (blog) => {
        blog.user = userDefaultId
        const blogEntry = new Blog(blog)
        return blogEntry.save()
    })
    await Promise.all(blogsPromise)
    
})

afterAll(async() => {
    await mongoose.connection.close()
})

describe('GET', () => {
    test('blogs returned as JSON', async () => {
        await api
            .get(URL)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
    
    test('all blogs are returned', async () => {
        const response = await api.get(URL)
    
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })
    
    test('a specific title is within the returned blogs', async () => {
        const response = await api.get(URL)
    
        const contents = response.body.map(r => r.title) 
        expect(contents).toContain('TDD harms architecture')
    })

    test('blogs have an id attribute, not _id or _v', async () => {
        const response = await api.get(URL)

        response.body.forEach(blog => {
            expect(blog.id).toBeDefined()
            expect(blog._id).toBeUndefined()
            expect(blog.__v).toBeUndefined()
        })
    })
})

describe('POST', () => {
    test('a valid blog gets added', async () => {
        const newBlog = {
            title: "Test blog",
            author: "Lluis B.",
            url: "https://github.com/lluisbh/Full-Stack-open",
            likes: 2
        }
        const token = await helper.generateToken()

        await api
            .post(URL)
            .set('Authorization', `bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const blogsDb = await helper.blogsInDb()
        
        expect(blogsDb).toHaveLength(helper.initialBlogs.length + 1)
        const contents = blogsDb.map(b => b.title)  
        expect(contents).toContain(
            'Test blog'
        )
    })

    test('a blog without likes defined gets set to 0', async () => {
        const newBlog = {
            title: "Test blog",
            author: "Lluis B.",
            url: "https://github.com/lluisbh/Full-Stack-open"
        }
        const token = await helper.generateToken()

        const response = await api.post(URL).send(newBlog)
            .set('Authorization', `bearer ${token}`).expect(201)
        
        expect(response.body.likes).toBe(0)
    })

    test('a blog without title is not added', async () => {
        const newBlog = {
            author: "Lluis B.",
            url: "https://github.com/lluisbh/Full-Stack-open",
            likes: 1
        }
        const token = await helper.generateToken()

        await api.post(URL).send(newBlog)
            .set('Authorization', `bearer ${token}`).expect(400)
    })

    test('a blog without url is not added', async () => {
        const newBlog = {
            title: "Test blog",
            author: "Lluis B.",
            likes: 1
        }
        const token = await helper.generateToken()

        await api.post(URL).send(newBlog)
            .set('Authorization', `bearer ${token}`).expect(400)
    })

    test('blog can\'t be added if unauthorized', async () => {
        const newBlog = {
            title: "Test blog",
            author: "Lluis B.",
            url: "https://github.com/lluisbh/Full-Stack-open",
            likes: 2
        }

        await api
            .post(URL)
            .send(newBlog)
            .expect(401)
    })
})

describe('DELETE', () => {
    test('deleting a blog with valid id', async () => {
        const token = await helper.generateToken()
        const idRemove = (await helper.blogsInDb())[0].id

        await api.delete(`${URL}/${idRemove}`)
            .set('Authorization', `bearer ${token}`).expect(204)
        
        expect(await helper.blogsInDb()).toHaveLength(helper.initialBlogs.length - 1)
    })

    test('deleting a blog with an invalid id also returns 204', async () => {
        const token = await helper.generateToken()
        const idRemove = await helper.nonExistingId()

        await api.delete(`${URL}/${idRemove}`)
            .set('Authorization', `bearer ${token}`).expect(204)
        
        expect(await helper.blogsInDb()).toHaveLength(helper.initialBlogs.length)
    })

    test('can\'t delete if unauthorized', async () => {
        const idRemove = (await helper.blogsInDb())[0].id

        await api.delete(`${URL}/${idRemove}`).expect(401)
    })
})

describe('PUT', () => {
    test('updating a blog with valid id', async () => {
        const token = await helper.generateToken()
        const idUpdate = (await helper.blogsInDb())[0].id
        const blog = {likes : 1000}

        const result = await api.put(`${URL}/${idUpdate}`)
            .send(blog)
            .expect(200)
        
        expect(result.body.likes).toBe(1000)
            
        expect(await helper.blogsInDb()).toHaveLength(helper.initialBlogs.length)
    })
})