require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const blogsRouter = require('./componentit/blogsRouter');

const app = express();
app.use(express.json()); // For parsing JSON bodies

const mongoUrl = process.env.MONGO_URI; // Use the connection string from the .env file

mongoose.connect(mongoUrl)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message);
  });

app.use('/api/blogs', blogsRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
