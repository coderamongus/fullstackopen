const express = require('express');
const Blog = require('./blogsModel'); 
const User = require('./userModel'); 
const testingRouter = express.Router();

testingRouter.post('/reset', async (req, res) => {
  await Blog.deleteMany({});
  await User.deleteMany({});
  res.status(204).end();
});

module.exports = testingRouter;
