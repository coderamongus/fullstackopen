const blogsRouter = require('express').Router();
const Blog = require('./blogsModel');
const User = require('./userModel');

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  res.json(blogs);
});

blogsRouter.post('/', async (req, res) => {
  const { title, author, url, likes, userId } = req.body;

  if (!title || !url) {
    return res.status(400).json({ error: 'title and url are required' });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(400).json({ error: 'user not found' });
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user._id,
  });

  try {
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    res.status(500).json({ error: 'something went wrong' });
  }
});

blogsRouter.delete('/:id', async (request, response) => {
  try {
    const blog = await Blog.findById(request.params.id);

    if (!blog) {
      return response.status(204).end();
    }

    await Blog.findByIdAndDelete(request.params.id); 
    response.status(204).end();
  } catch (error) {
    console.error('Error during deletion:', error);

    if (error.name === 'CastError') {
      return response.status(400).json({ error: 'Invalid ID format' });
    }

    response.status(500).json({ error: 'Something went wrong' });
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