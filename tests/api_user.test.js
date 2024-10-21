const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const User = require('../models/user')
const bcrypt =require('bcryptjs')
const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')
const api = supertest(app)

describe('Two users in db',  () => {

    beforeEach(async () => {
        await User.deleteMany({})
        const users = [
            {
                username: 'root',
                name : 'Brian',
                passwordHash : await bcrypt.hashSync('123456',10)
            },
            {
                username: 'admin',
                name : 'Simon',
                passwordHash: await bcrypt.hashSync('98765',10)
            }
        ]
        const userObjects = users.map(user => new User(user))
        const promises = userObjects.map(user => user.save())
        await Promise.all(promises)

    })

    test('add a new user', async () => {
        const newUser={
            username: 'guest',
            name: 'Mary',
            password: '123456'
        }
        await api.post('/api/users')
                .send(newUser)
                .expect(201)
                .expect('Content-Type',/application\/json/)
        const result = (await User.find({})).map(u => u.username)
        assert(result.includes(newUser.username))


    })

    test('add valid user failed', async () => {
        const newUser={
            username: 'admin',
            name:'Gary',
            password:'768653'
        }
        const result = await api.post('/api/users')
            .send(newUser)
            .expect(400)
        console.log(`error is ${result.body}`)
    })
})



after(async () => {
    await mongoose.connection.close()
})