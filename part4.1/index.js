const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const Blog = require('./componentit/blogsModel');
const blogsRouter = require('./componentit/blogsRouter');
const usersRouter = require('./componentit/userRouter.js');

const app = express();
app.use(express.json());
app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter); 

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); 
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

connectToDatabase();

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const shutdown = () => {
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    server.close(() => {
      console.log('Server closed');
    });
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

module.exports = { app, server, shutdown }; 
