const listHelper = require('../utils/list_helper');

describe('totalLikes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0,
    },
  ];

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    expect(result).toBe(5);
  });

  const listWithMultipleBlogs = [
    { title: 'Blog 1', likes: 1 },
    { title: 'Blog 2', likes: 2 },
    { title: 'Blog 3', likes: 3 },
  ];

  test('when list has multiple blogs, equals the sum of likes', () => {
    const result = listHelper.totalLikes(listWithMultipleBlogs);
    expect(result).toBe(6);
  });

  test('when list is empty, equals 0', () => {
    const result = listHelper.totalLikes([]);
    expect(result).toBe(0);
  });
});
