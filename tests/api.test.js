const { test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)
const mongoose = require('mongoose')
const Blog = require('../models/blog')

const initialData = [
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    },
    {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    },
    {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
      __v: 0
    },
    {
      _id: "5a422ba71b54a676234d17fb",
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0,
      __v: 0
    },
    {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
      __v: 0
    }  
  ]

beforeEach (async () => {
    await Blog.deleteMany({})
    const newObjects = initialData.map(ob => new Blog(ob))
    const promises = newObjects.map(blog => blog.save())
    await Promise.all(promises)
})  

test.only('Test of return json', async () => {
    const response = await api.get('/api/blogs')
    
    assert (response.status,200)
    console.log(`the headers are ${response.headers['content-type']}`)
    assert(response.headers['content-type'],/Application\/Json/)

})

test.only('Test of amount of blogs', async () => {
    const blogs = await Blog.find({})
    assert.strictEqual(blogs.length,initialData.length)
    
})

test.only('Test the unique identifier id', async () => {
    const blogs = await api.get('/api/blogs')
    blogs.body.forEach(blog => {
        assert.ok(blog.id,'id defined')
        assert.strictEqual(blog._id,undefined,'_id undefined')

    })
})

test.only('Test add to the database', async () => {
    const blog = {    

        title: "This is a test",
        author: "Brian",
        url: "http://howmao.com/",
        likes: 3,    
    }

    const current_length = (await Blog.find({})).length
    const response =   await api.post('/api/blogs')
                                .send(blog)
                                .expect(201)
    const increased_length = (await Blog.find({})).length
    assert.strictEqual(increased_length,current_length+1)
    assert.strictEqual(response.body.title,'This is a test')

    
})

test.only('Test likes value', async () => {
    const blog = {    

        title: "This is a test",
        author: "Brian",
        url: "http://howmao.com/",
            
    }
    const response =   await api.post('/api/blogs')
                                .send(blog)
                                .expect(201)

    assert.strictEqual(response.body.likes,0)

})

test.only('Test missing title and url', async () => {
    const blog = {    
        author: "Brian",             
    }
    await api.post('/api/blogs')
            .send(blog)
            .expect(400)

})

after (async () => {
    await mongoose.connection.close()
})