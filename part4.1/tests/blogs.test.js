const supertest = require('supertest');
const { app, server } = require('../index');
const Blog = require('../componentit/blogsModel.js');
const api = supertest(app);

beforeAll(async () => {
  await Blog.deleteMany({});
  const initialBlogs = [
    { title: 'First Blog', author: 'John Doe', url: 'https://example.com', likes: 5 },
    { title: 'Second Blog', author: 'Jane Doe', url: 'https://example.com', likes: 10 }
  ];
  await Blog.insertMany(initialBlogs);
});


afterAll(async () => {
  await Blog.deleteMany({});
  await server.close();
});

describe('GET /api/blogs', () => {
  test('should return the correct number of blogs in JSON format', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(2);
  });
});
