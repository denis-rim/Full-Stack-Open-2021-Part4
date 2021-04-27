const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");

const Blog = require("../models/blog");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
});

test("blogs in JSON format", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("correct amount of blogs", async () => {
  const response = await api.get("/api/blogs");
  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test("unique identifier property of the blog posts is named id", async () => {
  const response = await api.get("/api/blogs");
  expect(response.body[0].id).toBeDefined();
});

test("a blog post can be added", async () => {
  const newBlog = {
    title: "Added blog post",
    author: "Daniel Elias",
    url: "https://danielelias.org",
    likes: 0,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  const contents = blogsAtEnd.map((n) => n.title);
  expect(contents).toContain("Added blog post");
});

test("a blog post with missing likes field set likes by default to 0", async () => {
  const newBlog = {
    title: "Added blog post without likes",
    author: "Daniel Elias",
    url: "https://danielelias.org",
  };

  const response = await api.post("/api/blogs").send(newBlog);

  expect(response.body.likes).toEqual(0);
});

test("a blog post with missing author and url fields throw 400 error", async () => {
  const newBlog = {
    author: "Daniel Elias",
    likes: 0,
  };

  const response = await api.post("/api/blogs").send(newBlog);

  expect(response.status).toEqual(400);
});

afterAll(() => {
  mongoose.connection.close();
});
