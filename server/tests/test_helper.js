const Blog = require("../models/blog");

const initialBlogs = [
  {
    title: "First blog",
    author: "Daniel Elias",
    url: "https://danielelias.org",
    likes: 0,
  },
  {
    title: "Second blog",
    author: "Denis Santeri",
    url: "https://denissanteri.org",
    likes: 0,
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  initialBlogs,
  blogsInDb,
};
