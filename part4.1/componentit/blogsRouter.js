const jwt = require('jsonwebtoken');
const blogsRouter = require('express').Router();
const Blog = require('./blogsModel');
const User = require('./userModel');

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
  res.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  try {
    const token = request.token;
    if (!token) {
      return response.status(401).json({ error: 'token missing' });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' });
    }

    const user = await User.findById(decodedToken.id);
    if (!user) {
      return response.status(401).json({ error: 'user not found' });
    }

    const blog = new Blog({
      title: request.body.title,
      author: request.body.author,
      url: request.body.url,
      likes: request.body.likes || 0,
      user: user._id
    });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    response.status(201).json(savedBlog);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
});

blogsRouter.delete('/:id', async (request, response) => {
  try {
    const token = request.token;
    let decodedToken = null;

    if (token) {
      decodedToken = jwt.verify(token, process.env.SECRET);
    }

    const blog = await Blog.findById(request.params.id);
    if (!blog) {
      return response.status(404).json({ error: 'Blog not found' });
    }

    const adminUser = await User.findOne({ username: 'admin' });

    if (adminUser && decodedToken && decodedToken.id === adminUser._id.toString()) {
      await Blog.findByIdAndDelete(request.params.id);
      return response.status(204).end();
    }

    if (!decodedToken || !decodedToken.id) {
      return response.status(401).json({ error: 'Token missing or invalid' });
    }

    if (blog.user.toString() !== decodedToken.id) {
      return response.status(403).json({ error: 'Permission denied' });
    }

    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } catch (error) {
    response.status(400).json({ error: 'Invalid request' });
  }
});

blogsRouter.put('/:id', async (req, res) => {
  const { likes } = req.body;

  if (likes === undefined) {
    return res.status(400).json({ error: 'Likes field is required' });
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { likes },
      { new: true, runValidators: true, context: 'query' }
    );

    if (updatedBlog) {
      res.json(updatedBlog);
    } else {
      res.status(404).json({ error: 'Blog not found' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Invalid ID format' });
  }
});

module.exports = blogsRouter;