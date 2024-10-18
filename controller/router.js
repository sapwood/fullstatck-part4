const route = require('express').Router()
const Blog = require('../models/blog')


route.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)

  })
  
route.post('/', async (request, response) => {
    const { title, author, url, likes } = request.body  
    modifiedLikes = likes !== undefined ? likes : 0
    
    newBlog ={
      title:title,
      author:author,
      url:url,
      likes:modifiedLikes
    }
    
    const blog = new Blog(newBlog)
    const result = await blog.save()
    response.status(201).json(result)

  })


module.exports = route