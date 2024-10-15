const mongoose = require('mongoose')

const blofSchema = new mongoose.Schema({
    title : String,
    author : String,
    url : String,
    likes : Number, 
})

const Blog = mongoose.model('Blog',blofSchema)

module.exports = Blog