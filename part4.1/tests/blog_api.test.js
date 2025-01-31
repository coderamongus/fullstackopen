const mongoose = require('mongoose');
const supertest = require('supertest');
const { app } = require('../index'); 
const api = supertest(app);
const Blog = require('../componentit/blogsModel'); 

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
    const newBlog = {
      author: 'Test Author',
      likes: 10
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
