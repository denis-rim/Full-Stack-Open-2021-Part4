const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((acc, cur) => {
    return acc + cur.likes;
  }, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return [];

  const { title, author, likes } = blogs.reduce((prev, current) => {
    return prev.likes > current.likes ? prev : current;
  });
  return {
    title,
    author,
    likes,
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
