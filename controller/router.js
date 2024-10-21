const route = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

route.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user',{username:1,name:1})
    response.status(200).json(blogs)

  })
  
route.post('/', async (request, response) => {
    const { title, author, url, likes, user_id } = request.body  

    if (!(title&&url)){
      return response.status(400).json({
        error: 'Invalid blog'
      })
    }
    
    modifiedLikes = likes !== undefined ? likes : 0
    const user = await User.findById(user_id)
    console.log(`the user id is ${user_id}`)
    console.log(`user is ${user}`)

    const newBlog ={
      title : title,
      author : author,
      url : url,
      likes : modifiedLikes,
      user : user.id
    }
    
    const blog = new Blog(newBlog)
    const result = await blog.save()
    user.blog = user.blog.concat(blog._id)
    await user.save()
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