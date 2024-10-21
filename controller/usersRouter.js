
const User = require('../models/user')
const userRouter = require('express').Router()
const bcrypt = require('bcryptjs')


userRouter.get('/', async (request,response) => {
    const users = await User.find({})
    return response.status(200).json(users)
})

userRouter.post('/', async (request,response) => {
    const {username, name, password } = request.body
    const passwordHash = bcrypt.hashSync(password,10)
    const newUser =new User({
        username,
        name,
        passwordHash
    })
    const savedUser = await newUser.save()
    return response.status(201).json(savedUser)
})

module.exports = userRouter