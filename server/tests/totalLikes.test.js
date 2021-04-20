const listHelper = require("../utils/list_helper");

describe("total likes", () => {
  const listWithEmptyBlogs = [];
  const listWithOneBlog = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url:
        "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0,
    },
  ];
  const listWithManyBlogs = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url:
        "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0,
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url:
        "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0,
    },
  ];

  test("of empty list is zero", () => {
    const result = listHelper.totalLikes(listWithEmptyBlogs);
    expect(result).toBe(0);
  });

  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    expect(result).toBe(5);
  });

  test("of bigger list is calculated right", () => {
    const result = listHelper.totalLikes(listWithManyBlogs);
    expect(result).toBe(10);
  });
});

describe("favorite blogs", () => {
  const listWithEmptyBlogs = [];
  const listWithOneBlog = [
    {
      _id: "2gtgh5hfr5g1gr15r1gh11",
      title: "Blog with 5 likes",
      author: "User 1",
      likes: 5,
    },
  ];
  const listWithManyBlogs = [
    {
      _id: "2gtgh5hfr5g1gr15r1gh11",
      title: "Blog with 5 likes",
      author: "User 1",
      likes: 5,
    },
    {
      _id: "5a422tyb54a676234d17f8",
      title: "Blog with High likes ",
      author: "Top user",
      likes: 7,
    },
    {
      _id: "5a422tyb54a676234d17f8",
      title: "Blog with lowes likes",
      author: "Lowes likes user",
      likes: 2,
    },
  ];

  test("of empty list is zero", () => {
    const result = listHelper.favoriteBlog(listWithEmptyBlogs);
    expect(result).toEqual([]);
  });

  test("when list has only one blog", () => {
    const result = listHelper.favoriteBlog(listWithOneBlog);
    expect(result).toEqual({
      title: "Blog with 5 likes",
      author: "User 1",
      likes: 5,
    });
  });

  test("find most favorite blog", () => {
    const result = listHelper.favoriteBlog(listWithManyBlogs);
    expect(result).toEqual({
      title: "Blog with High likes ",
      author: "Top user",
      likes: 7,
    });
  });
});
