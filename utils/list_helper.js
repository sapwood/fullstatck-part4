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

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}