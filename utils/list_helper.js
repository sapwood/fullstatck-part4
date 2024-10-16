const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum+item.likes
    }
    return blogs.reduce(reducer,0)
}

const favoriteBlog = (blogs) => {
    const maxLikes = (max,current) => {
        return current.likes > max.likes ? current : max
    }
    const maxLikesBlog = blogs.reduce(maxLikes,blogs[0])
    const result = {
        title: maxLikesBlog.title,
        author:maxLikesBlog.author,
        likes:maxLikesBlog.likes
    }
    return result
}

const mostBlogs = (blogs) => {
    const blogCount = _.countBy(blogs,'author')
    let maxKey = ''
    let maxValue = -Infinity

    Object.entries(blogCount).forEach(([key,value]) => {
        if (value > maxValue){
            maxValue = value
            maxKey = key
        }
    })
    const result = {
        author : maxKey,
        blogs : maxValue
    }
    return result
}

const mostLikes = (blogs) => {
    const authorLikes = blogs.reduce((ob, current) => {
        ob[current.author] = (ob[current.author] || 0) + current.likes
        return ob
    },{})

    const [author,likes] = _.maxBy(Object.entries(authorLikes),([author,likes]) => likes)
 
    return {author,likes}

}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
}