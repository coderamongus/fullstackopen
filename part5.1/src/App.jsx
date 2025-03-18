import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });

  const blogFormRef = useRef();

  useEffect(() => {
    const loggedUserJSON = localStorage.getItem('loggedBlogUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [user]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 3000);
  };

  const fetchBlogs = async () => {
    try {
      if (!user) return;
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const response = await axios.get('http://localhost:3001/api/blogs', config);
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      showNotification('Error fetching blogs', 'error');
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/login', { username, password });
      const user = response.data;

      localStorage.setItem('loggedBlogUser', JSON.stringify(user));
      setUser(user);
      fetchBlogs();
      showNotification(`Welcome ${user.name}!`);
    } catch (error) {
      console.error('Login failed:', error);
      showNotification('Wrong username/password', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedBlogUser');
    setUser(null);
    setBlogs([]);
    showNotification('Logged out successfully.');
  };

  const createBlog = async (blogObject) => {
    try {
      const user = JSON.parse(localStorage.getItem('loggedBlogUser'));
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      const response = await axios.post('http://localhost:3001/api/blogs', blogObject, config);

      const newBlogWithUser = {
        ...response.data,
        user: { username: user.username, name: user.name, id: user.id },
      };

      setBlogs(blogs.concat(newBlogWithUser));
      showNotification(`A new blog "${blogObject.title}" by ${blogObject.author} added!`);
      blogFormRef.current.toggleVisibility();  // Hide form after creation
    } catch (error) {
      console.error('Error creating blog:', error);
      const errorMessage = error.response?.data?.error || 'Error creating blog';
      showNotification(errorMessage, 'error');
    }
  };

  const handleDelete = async (blogToDelete) => {
    const confirmDelete = window.confirm(`Delete blog "${blogToDelete.title}" by ${blogToDelete.author}?`);
    if (!confirmDelete) return;

    try {
      const user = JSON.parse(localStorage.getItem('loggedBlogUser'));
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      await axios.delete(`http://localhost:3001/api/blogs/${blogToDelete.id}`, config);

      setBlogs(blogs.filter((blog) => blog.id !== blogToDelete.id));
      showNotification(`Deleted blog "${blogToDelete.title}" by ${blogToDelete.author}`);
    } catch (error) {
      console.error('Error deleting blog:', error);
      const errorMessage = error.response?.data?.error || 'Error deleting blog';
      showNotification(errorMessage, 'error');
    }
  };

  const handleLike = async (blog) => {
    try {
      if (!blog.id) {
        showNotification('Error: Blog ID is missing.', 'error');
        return;
      }

      const updatedBlog = {
        ...blog,
        likes: blog.likes + 1,
        user: blog.user,
      };

      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      await axios.put(`http://localhost:3001/api/blogs/${blog.id}`, updatedBlog, config);

      setBlogs(blogs.map((b) => (b.id === blog.id ? updatedBlog : b)));
    } catch (error) {
      console.error('Error liking blog:', error);
      showNotification('Error liking blog', 'error');
    }
  };

  return (
    <div>
      <h1>Blogs</h1>

      <Notification message={notification.message} type={notification.type} />

      {!user ? (
        <div>
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <div>
              Username:
              <input
                type="text"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
              />
            </div>
            <div>
              Password:
              <input
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </div>
            <button type="submit">Login</button>
          </form>
        </div>
      ) : (
        <div>
          <p>
            {user.name} logged in <button onClick={handleLogout}>Logout</button>
          </p>

          <Togglable buttonLabel="New Blog" ref={blogFormRef}>
            <BlogForm createBlog={createBlog} />
          </Togglable>
        </div>
      )}

      <h2>Blogs</h2>
      <div>
        {blogs
          .slice()
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              handleLike={handleLike}
              handleDelete={handleDelete}
              currentUser={user}
            />
          ))}
      </div>
    </div>
  );
};

export default App;
