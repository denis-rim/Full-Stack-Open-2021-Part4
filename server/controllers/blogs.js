const postRouter = require("express").Router();
const Blog = require("../models/blog");

postRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

postRouter.post("/", async (request, response) => {
  const { title, author, url, likes } = request.body;

  if (!title && !url) {
    return response.status(400).json({});
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
  });

  const savedBlog = await blog.save();
  response.json(savedBlog);
});

postRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

postRouter.put("/:id", async (request, response) => {
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });
  response.json(updatedBlog);
});

module.exports = postRouter;
