const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((acc, cur) => {
    return acc + cur.likes
  }, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return []

  const { title, author, likes } = blogs.reduce((prev, current) => {
    return prev.likes > current.likes ? prev : current
  })

  return {
    title,
    author,
    likes,
  }
}

const mostBlog = (blogs) => {
  if (blogs.length === 0) return []

  const allAuthors = []

  for (const post of blogs) {
    if (!allAuthors.some((item) => item.author === post.author)) {
      allAuthors.push({ author: post.author, posts: 1 })
    } else {
      const index = allAuthors.findIndex((item) => item.author === post.author)
      allAuthors[index].posts += 1
    }
  }
  const { author, posts } = allAuthors.sort((a, b) => b.posts - a.posts)[0]
  return { author, posts }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return []

  const allAuthorsLikes = []

  for (const post of blogs) {
    if (!allAuthorsLikes.some((item) => item.author === post.author)) {
      allAuthorsLikes.push({ author: post.author, likes: post.likes })
    } else {
      const index = allAuthorsLikes.findIndex(
        (item) => item.author === post.author
      )
      allAuthorsLikes[index].likes += post.likes
    }
  }
  const { author, likes } = allAuthorsLikes.sort((a, b) => b.likes - a.likes)[0]
  return { author, likes }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlog,
  mostLikes,
}
