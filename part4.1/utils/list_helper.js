const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  return blogs.reduce((max, blog) => (blog.likes > max.likes ? blog : max), blogs[0]);
};

const mostBlogs = (blogs) => {
  const authorCounts = blogs.reduce((count, blog) => {
    count[blog.author] = (count[blog.author] || 0) + 1;
    return count;
  }, {});

  const maxAuthor = Object.entries(authorCounts).reduce((max, [author, count]) => {
    return count > max.blogs ? { author, blogs: count } : max;
  }, { author: '', blogs: 0 });

  return maxAuthor;
};

const mostLikes = (blogs) => {
  const authorLikes = blogs.reduce((counts, blog) => {
    counts[blog.author] = (counts[blog.author] || 0) + blog.likes;
    return counts;
  }, {});

  const mostLikesAuthor = Object.entries(authorLikes).reduce((max, [author, likes]) => {
    return likes > max.likes ? { author, likes } : max;
  }, { author: '', likes: 0 });

  return mostLikesAuthor;
};

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
