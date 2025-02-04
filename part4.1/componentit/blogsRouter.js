const blogsRouter = require('express').Router();
const Blog = require('./blogsModel');

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({});
  res.json(blogs);
});

blogsRouter.post('/', async (req, res) => {
  const { title, author, url, likes } = req.body;

  if (!title || !url) {
    return res.status(400).json({ error: 'title and url are required' });
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0
  });

  try {
    const savedBlog = await blog.save();
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
