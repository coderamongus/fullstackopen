const mongoose = require('mongoose');
const supertest = require('supertest');
const { app } = require('../index');
const User = require('../componentit/userModel');

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
});

describe('User creation', () => {
  test('succeeds with valid username and password', async () => {
    const newUser = {
      username: 'validUser',
      name: 'Test User',
      password: 'strongpass'
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await User.find({});
    expect(usersAtEnd).toHaveLength(1);
    expect(usersAtEnd[0].username).toBe('validUser');
  });

  test('fails with status 400 if username is too short', async () => {
    const newUser = {
      username: 'ab',
      name: 'Short Username',
      password: 'strongpass'
    };

    const response = await api.post('/api/users').send(newUser).expect(400);
    expect(response.body.error).toContain('Username must be at least 3 characters long');
  });

  test('fails with status 400 if password is too short', async () => {
    const newUser = {
      username: 'validUser',
      name: 'Test User',
      password: '12'
    };

    const response = await api.post('/api/users').send(newUser).expect(400);
    expect(response.body.error).toContain('Password must be at least 3 characters long');
  });

  test('fails with status 400 if username already exists', async () => {
    const existingUser = {
      username: 'duplicateUser',
      name: 'First User',
      password: 'securepass'
    };

    await api.post('/api/users').send(existingUser).expect(201);

    const duplicateUser = {
      username: 'duplicateUser',
      name: 'Second User',
      password: 'anotherpass'
    };

    const response = await api.post('/api/users').send(duplicateUser).expect(400);
    expect(response.body.error).toContain('Username already exists');
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});