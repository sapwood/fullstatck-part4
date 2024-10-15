const mongoose = require('mongoose')
const cors = require('cors')
const express = require('express')
const app = express()
const logger = require('./utils/logger')
const config = require('./utils/config')
const middleware = require('./utils/middleware')


const url = config.MONGODB_URI

mongoose.connect(url)
.then(() => {
    logger.info('Connected to Mongodb')
})
.catch(error => {
    logger.error(`Error: ${error.message}`)
})


app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

const route = require('./controller/router')
app.use('/api/blogs',route)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


module.exports = app