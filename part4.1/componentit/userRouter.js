const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();   
const User = require('./userModel');
const Blog = require('./blogsModel'); 

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body;

  if (!username || username.length < 3) {
    return response.status(400).json({ error: 'Username must be at least 3 characters long' });
  }

  if (!password || password.length < 3) {
    return response.status(400).json({ error: 'Password must be at least 3 characters long' });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return response.status(400).json({ error: 'Username already exists' });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({ username, name, passwordHash });

  try {
    const savedUser = await user.save();
    response.status(201).json(savedUser);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'An error occurred while creating the user' });
  }
});

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1 });
  response.json(users);
});

usersRouter.delete('/:id', async (request, response) => {
  try {
    const userId = request.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return response.status(404).json({ error: 'User not found' });
    }

    await Blog.deleteMany({ user: userId });

    await User.findByIdAndDelete(userId);

    response.status(204).end();
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'An error occurred while deleting the user' });
  }
});

module.exports = usersRouter;