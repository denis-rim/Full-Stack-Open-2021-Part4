const listHelper = require('../utils/list_helper')

const listWithEmptyBlogs = []
const listWithOneBlog = [
  {
    _id: '2gtgh5hfr5g1gr15r1gh11',
    title: 'Blog with 5 likes',
    author: 'User 1',
    likes: 5,
  },
]
const listWithManyBlogs = [
  {
    _id: '5a422tyb54a676234d17f8',
    title: 'First post of the Top User',
    author: 'Top user',
    likes: 5,
  },
  {
    _id: '2gtgh5hfr5g1gr15r1gh11',
    title: 'Blog with 5 likes',
    author: 'User 1',
    likes: 5,
  },
  {
    _id: '5a422tyb54a676234d17f8',
    title: 'Blog with High likes ',
    author: 'Top user',
    likes: 7,
  },
  {
    _id: '5a422tyb54a676234d17f8',
    title: 'Blog with lowes likes',
    author: 'Lowes likes user',
    likes: 2,
  },
  {
    _id: '5a422tyb54a676234d17f8',
    title: 'Second post of the Top User',
    author: 'Top user',
    likes: 3,
  },
]

describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes(listWithEmptyBlogs)
    expect(result).toBe(0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('of bigger list is calculated right', () => {
    const result = listHelper.totalLikes(listWithManyBlogs)
    expect(result).toBe(22)
  })
})

describe('favorite blogs', () => {
  test('of empty list is zero', () => {
    const result = listHelper.favoriteBlog(listWithEmptyBlogs)
    expect(result).toEqual([])
  })

  test('when list has only one blog', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    expect(result).toEqual({
      title: 'Blog with 5 likes',
      author: 'User 1',
      likes: 5,
    })
  })

  test('find most favorite blog', () => {
    const result = listHelper.favoriteBlog(listWithManyBlogs)
    expect(result).toEqual({
      title: 'Blog with High likes ',
      author: 'Top user',
      likes: 7,
    })
  })
})

describe('the author who has the largest amount of blogs', () => {
  test('of empty list is zero', () => {
    const result = listHelper.mostBlog(listWithEmptyBlogs)
    expect(result).toEqual([])
  })

  test('when list has only one blog', () => {
    const result = listHelper.mostBlog(listWithOneBlog)
    expect(result).toEqual({
      author: 'User 1',
      posts: 1,
    })
  })

  test('find most user', () => {
    const result = listHelper.mostBlog(listWithManyBlogs)
    expect(result).toEqual({
      author: 'Top user',
      posts: 3,
    })
  })
})

describe('the author with larges amount of likes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.mostLikes(listWithEmptyBlogs)
    expect(result).toEqual([])
  })

  test('when list has only one blog', () => {
    const result = listHelper.mostLikes(listWithOneBlog)
    expect(result).toEqual({
      author: 'User 1',
      likes: 5,
    })
  })

  test('find most user', () => {
    const result = listHelper.mostLikes(listWithManyBlogs)
    expect(result).toEqual({
      author: 'Top user',
      likes: 15,
    })
  })
})
