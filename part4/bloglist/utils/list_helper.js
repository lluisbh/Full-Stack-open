const dummy = (blogs) => {

    return 1
}

const totalLikes = (blogs) => {
    const sum = (sum, blog) => {
        return sum + blog.likes
    }

    return blogs.reduce(sum, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length == 0) return {}

    let favourite = blogs[0]
    blogs.forEach(blog => {
        if (favourite.likes < blog.likes) {
            favourite = blog
        }
    })
    return {
        title: favourite.title,
        author: favourite.author,
        likes: favourite.likes
    }
}

const mostBlogs = (blogs) => {
    if (blogs.length == 0) return {}

    const authorCount = {}
    let winner = blogs[0]
    blogs.forEach((blog) => {
        if (!(blog.author in authorCount)) authorCount[blog.author] = 1
        else authorCount[blog.author] += 1

        if (authorCount[winner.author] < authorCount[blog.author]) winner = blog
    })

    return {
        author: winner.author,
        blogs: authorCount[winner.author]
    }
}

const mostLikes = (blogs) => {
    if (blogs.length == 0) return {}

    const authorLikes = {}
    let winner = blogs[0]
    blogs.forEach((blog) => {
        if (!(blog.author in authorLikes)) authorLikes[blog.author] = blog.likes
        else authorLikes[blog.author] += blog.likes

        if (authorLikes[winner.author] < authorLikes[blog.author]) winner = blog
    })

    return {
        author: winner.author,
        likes: authorLikes[winner.author]
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}