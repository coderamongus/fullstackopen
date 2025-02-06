const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
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

const shutdown = async () => {
  console.log('Shutting down...');
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3001;
  var server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = { app, shutdown };
