const route = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


const getTokenForm = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')){
      return authorization.replace('Bearer ','')
  }
  return null
}


route.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user',{username:1,name:1})
    response.status(200).json(blogs)

  })
  
route.post('/', async (request, response,next) => {
   
  try {
    const decodedToken = jwt.verify(getTokenForm(request),process.env.SECRET) 
    if (!decodedToken.id){
      return response.status(400).json({
        error: 'invalid token'
      })
    }
    const { title, author, url, likes } = request.body  

    if (!(title&&url)){
      return response.status(400).json({
        error: 'Invalid blog'
      })
    }
    


    modifiedLikes = likes !== undefined ? likes : 0
    const user = await User.findById(decodedToken.id)


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
  }
    catch(error){
      next(error)
    }
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