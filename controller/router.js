const route = require('express').Router()

const Blog = require('../models/blog')


route.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)

  })
  
route.post('/', async (request, response) => {
    const { title, author, url, likes } = request.body  

    if (!(title&&url)){
      return response.status(400).end()
    }
    
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

route.delete('/:id', async (request,response) => {
  const deteled = await Blog.findByIdAndDelete(request.params.id)
  response.status(204).json(deteled)
})

route.put('/:id', async (request,response) => {
  const body = request.body
  const newBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }
  const updated = await Blog.findByIdAndUpdate(request.params.id,newBlog,{new:true})
  response.json(updated)
})

module.exports = route