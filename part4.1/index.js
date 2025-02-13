const express = require('express');
const app = express();
const mongoose = require('mongoose');
app.use(express.json());
require('dotenv').config();
const loginRouter = require('./controllers/loginController');
const blogsRouter = require('./componentit/blogsRouter');
const usersRouter = require('./componentit/userRouter.js');
const { tokenExtractor } = require('./componentit/middleware');

app.use(tokenExtractor);
app.use('/api/login', loginRouter);
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

app.use((error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  next(error);
});

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3001;
  var server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = { app, shutdown };