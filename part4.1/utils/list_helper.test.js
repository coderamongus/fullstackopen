const listHelper = require('../utils/list_helper');

describe('total likes', () => {
  const blogs = [
    {
      _id: '1',
      title: 'Blog 1',
      author: 'Author 1',
      url: 'https://example.com/blog1',
      likes: 10,
    },
    {
      _id: '2',
      title: 'Blog 2',
      author: 'Author 2',
      url: 'https://example.com/blog2',
      likes: 20,
    },
    {
      _id: '3',
      title: 'Blog 3',
      author: 'Author 3',
      url: 'https://example.com/blog3',
      likes: 30,
    },
  ];

  test('when list has only one blog, equals the likes of that', () => {
    const singleBlogList = [
      {
        _id: '1',
        title: 'Single Blog',
        author: 'Single Author',
        url: 'https://example.com/single-blog',
        likes: 5,
      },
    ];

    const result = listHelper.totalLikes(singleBlogList);
    expect(result).toBe(5);
  });

  test('when list has multiple blogs, equals the sum of likes', () => {
    const result = listHelper.totalLikes(blogs);
    expect(result).toBe(10 + 20 + 30); // 60 likes
  });

  test('when list is empty, equals 0', () => {
    const result = listHelper.totalLikes([]);
    expect(result).toBe(0);
  });
});

describe('favorite blog', () => {
  test('returns the blog with the most likes', () => {
    const blogs = [
      { _id: '1', title: 'Blog 1', author: 'Author 1', url: 'https://example.com/blog1', likes: 10 },
      { _id: '2', title: 'Blog 2', author: 'Author 2', url: 'https://example.com/blog2', likes: 20 },
      { _id: '3', title: 'Blog 3', author: 'Author 3', url: 'https://example.com/blog3', likes: 30 },
    ];

    const result = listHelper.favoriteBlog(blogs);
    expect(result).toEqual({
      _id: '3',
      title: 'Blog 3',
      author: 'Author 3',
      url: 'https://example.com/blog3',
      likes: 30,
    });
  });
});

describe('most blogs', () => {
  const blogsWithAuthors = [
    {
      title: 'Blog 1',
      author: 'Author 1',
      url: 'http://example.com/1',
      likes: 5
    },
    {
      title: 'Blog 2',
      author: 'Author 1',
      url: 'http://example.com/2',
      likes: 3
    },
    {
      title: 'Blog 3',
      author: 'Author 2',
      url: 'http://example.com/3',
      likes: 7
    }
  ];

  test('returns the author with the most blogs', () => {
    const result = listHelper.mostBlogs(blogsWithAuthors);
    expect(result).toEqual({
      author: 'Author 1',
      blogs: 2
    });
  });
});

describe('most likes', () => {
  const blogsWithLikes = [
    {
      _id: '1',
      title: 'Blog 1',
      author: 'Author 1',
      url: 'https://example.com/blog1',
      likes: 10,
    },
    {
      _id: '2',
      title: 'Blog 2',
      author: 'Author 2',
      url: 'https://example.com/blog2',
      likes: 20,
    },
    {
      _id: '3',
      title: 'Blog 3',
      author: 'Author 1',
      url: 'https://example.com/blog3',
      likes: 30,
    },
  ];

  test('returns the author with the most likes', () => {
    const result = listHelper.mostLikes(blogsWithLikes);
    expect(result).toEqual({
      author: 'Author 1',
      likes: 40, 
    });
  });
});
