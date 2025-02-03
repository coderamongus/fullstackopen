const mongoose = require('mongoose');
const supertest = require('supertest');
const { app } = require('../index');
const api = supertest(app);
const Blog = require('../componentit/blogsModel');
const listHelper = require('../utils/list_helper');

beforeEach(async () => {
  await Blog.deleteMany({});
  const initialBlogs = [
    { title: 'First Blog', author: 'John Doe', url: 'https://example.com', likes: 5 },
    { title: 'Second Blog', author: 'Jane Doe', url: 'https://example.com', likes: 10 }
  ];
  await Blog.insertMany(initialBlogs);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Blog API', () => {
  test('a blog can be added with POST', async () => {
    const newBlog = {
      title: 'New Blog Post',
      author: 'Test Author',
      url: 'http://newblog.com',
      likes: 10
    };
    await api.post('/api/blogs').send(newBlog).expect(201);
  });

  test('returns 400 if title or url is missing', async () => {
    const newBlog = { author: 'Test Author', likes: 10 };
    await api.post('/api/blogs').send(newBlog).expect(400);
  });

  test('should return the correct number of blogs in JSON format', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(2);
  });
});

describe('List Helper Functions', () => {
  const blogs = [
    { _id: '1', title: 'Blog 1', author: 'Author 1', url: 'https://example.com/blog1', likes: 10 },
    { _id: '2', title: 'Blog 2', author: 'Author 2', url: 'https://example.com/blog2', likes: 20 },
    { _id: '3', title: 'Blog 3', author: 'Author 3', url: 'https://example.com/blog3', likes: 30 },
  ];

  test('totalLikes calculates correct sum', () => {
    expect(listHelper.totalLikes(blogs)).toBe(60);
  });

  test('returns 0 when list is empty', () => {
    expect(listHelper.totalLikes([])).toBe(0);
  });

  test('favoriteBlog returns the blog with the most likes', () => {
    expect(listHelper.favoriteBlog(blogs)).toEqual({
      _id: '3',
      title: 'Blog 3',
      author: 'Author 3',
      url: 'https://example.com/blog3',
      likes: 30,
    });
  });

  test('if likes property is missing, it defaults to 0', async () => {
    const newBlog = {
      title: 'Blog Without Likes',
      author: 'Author Test',
      url: 'http://nolikes.com'
    };
  
    const response = await api.post('/api/blogs').send(newBlog).expect(201);
    expect(response.body.likes).toBe(0);
  });

  test('mostBlogs returns the author with the most blogs', () => {
    const blogsWithAuthors = [
      { title: 'Blog 1', author: 'Author 1', url: 'http://example.com/1', likes: 5 },
      { title: 'Blog 2', author: 'Author 1', url: 'http://example.com/2', likes: 3 },
      { title: 'Blog 3', author: 'Author 2', url: 'http://example.com/3', likes: 7 }
    ];
    expect(listHelper.mostBlogs(blogsWithAuthors)).toEqual({ author: 'Author 1', blogs: 2 });
  });

  test('mostLikes returns the author with the most likes', () => {
    const blogsWithLikes = [
      { _id: '1', title: 'Blog 1', author: 'Author 1', url: 'https://example.com/blog1', likes: 10 },
      { _id: '2', title: 'Blog 2', author: 'Author 2', url: 'https://example.com/blog2', likes: 20 },
      { _id: '3', title: 'Blog 3', author: 'Author 1', url: 'https://example.com/blog3', likes: 30 },
    ];
    expect(listHelper.mostLikes(blogsWithLikes)).toEqual({ author: 'Author 1', likes: 40 });
  });

  test('blog without title is not added and returns 400', async () => {
    const blogWithoutTitle = {
      author: 'Missing Title',
      url: 'http://notitle.com',
      likes: 3
    };
  
    await api.post('/api/blogs')
      .send(blogWithoutTitle)
      .expect(400);
  });
  
  test('blog without url is not added and returns 400', async () => {
    const blogWithoutUrl = {
      title: 'Missing URL',
      author: 'Author Test',
      likes: 7
    };
  
    await api.post('/api/blogs')
      .send(blogWithoutUrl)
      .expect(400);
  });

  test('should delete a blog by ID', async () => {
    const blogsAtStart = await api.get('/api/blogs');
    const blogToDelete = blogsAtStart.body[0];
  
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204);
  
    const blogsAtEnd = await api.get('/api/blogs');
    expect(blogsAtEnd.body).toHaveLength(blogsAtStart.body.length - 1);
    expect(blogsAtEnd.body.map(b => b.id)).not.toContain(blogToDelete.id);
  });
  
  test('should return 204 when deleting a non-existent blog', async () => {
    const nonExistentId = '000000000000000000000000'; 
    await api.delete(`/api/blogs/${nonExistentId}`).expect(204);
  });
  
  

});
