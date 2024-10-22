const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const bcrypt = require('bcryptjs')

loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body
    const user = await User.findOne(username)
    passwordCorrect = user === null ? false : bcrypt.compare(password,user.passwordHash)

    if (!(user&&passwordCorrect)){
        return response.status(400).json({
            error: 'Invalid username or password'
        })
    }

    const userForToken = {
        username : user.username,
        id : user.id
    }

    const token = jwt.sign(userForToken,process.env.SECRET,{expiresIn:60*60})
    response.status(200).send({token,username:user.username, name: user.name })
})