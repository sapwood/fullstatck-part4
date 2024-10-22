
const User = require('../models/user')
const userRouter = require('express').Router()
const bcrypt = require('bcryptjs')


userRouter.get('/', async (request,response) => {
    const users = await User.find({}).populate('blog',{url:1, title:1, author:1})
    return response.status(200).json(users)
})

userRouter.post('/', async (request,response,next) => {
    try {
        const {username, name, password } = request.body
        if (!(password&&(password.length>3))){
            console.log(`password is ${password}`)
            return  response.status(400).json({
                error: 'Invalid user'
            })
        }
        const passwordHash = bcrypt.hashSync(password,10)
        const newUser =new User({
            username,
            name,
            passwordHash
        })
        const savedUser = await newUser.save()
        return response.status(201).json(savedUser)
    }
    catch(error){
        next(error)
    }

})
userRouter.put('/:id', async (request, response) => {
    const body = request.body
    const passwordHash = await bcrypt.hashSync(body.password)
    
    const newUser = {
        username : body.username,
        name : body.name,
        passwordHash :  passwordHash
    }
    const updatedUser = await User.findByIdAndUpdate(request.params.id,newUser,{new:true})
    response.status(201).json(updatedUser)
})

module.exports = userRouter