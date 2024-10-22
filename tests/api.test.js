const { test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

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

test('Test of return json', async () => {
    await api.get('/api/blogs')
            .expect(200)
            .expect('Content-Type',/application\/json/)

  
})

test('Test of amount of blogs', async () => {
    const blogs = await Blog.find({})
    assert.strictEqual(blogs.length,initialData.length)
    
})

test('Test the unique identifier id', async () => {
    const blogs = await api.get('/api/blogs')
    blogs.body.forEach(blog => {
        assert.ok(blog.id,'id defined')
        assert.strictEqual(blog._id,undefined,'_id undefined')

    })
})

test('Test add to the database with token', async () => {
    const username = 'admin'

    const user = await User.findOne({username})
    
    const userForToken ={
      username: username,
      id : user._id
    }
    

    const token = jwt.sign(userForToken,process.env.SECRET,{expiresIn:60*60})

   
    const blog = {    

        title: "This is a test",
        author: "Brian",
        url: "http://howmao.com/",
        likes: 3,    
    }

    const current_length = (await Blog.find({})).length
    const response =   await api.post('/api/blogs')
                                .set('Authorization',`Bearer ${token}`)
                                .send(blog)
                                .expect(201)
    const result = await Blog.find({})
    
    const increased_length = (await Blog.find({})).length
    assert.strictEqual(increased_length,current_length+1)
    assert.strictEqual(response.body.title,'This is a test')

    
})

test('Test failed adding to the database without token', async () => {
 
  const blog = {    

      title: "This is a test",
      author: "Brian",
      url: "http://howmao.com/",
      likes: 3,    
  }

  
  const response =   await api.post('/api/blogs')
                              .send(blog)
                              .expect(401)
 
  
})

test('Test likes value', async () => {
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

test('Test missing title and url', async () => {
    const blog = {    
        author: "Brian",             
    }
    await api.post('/api/blogs')
            .send(blog)
            .expect(400)

})

test('Test delete from database', async () => {
    const id = '5a422ba71b54a676234d17fb'
    await api.delete(`/api/blogs/${id}`)
            .expect(204)
})

test('Test update database', async () => {
    const updateBlog = {
        id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
    }
    const updated = await api.put(`/api/blogs/${updateBlog.id}`)
                            .send(updateBlog)

   
    assert.deepStrictEqual(updated.body,updateBlog)
})

test('add new blog with user', async () => {
  const newBlog = {
      title : 'This is a test with user',
      author : 'Brian',
      url : 'https://howmao.com',
      likes : 10,
      user_id: '6716df62fd702bfe1ed107b6'
  }
  await api.post('/api/blogs')
    .send(newBlog)
    .expect(201)
})

after (async () => {
    await mongoose.connection.close()
})