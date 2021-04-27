const postRouter = require("express").Router();
const Blog = require("../models/blog");

postRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

postRouter.post("/", async (request, response) => {
  const { title, author, url, likes } = request.body;

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
  });

  const savedBlog = await blog.save();
  response.json(savedBlog);
});

module.exports = postRouter;
