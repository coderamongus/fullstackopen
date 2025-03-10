import { useState, useEffect } from 'react';
import axios from 'axios';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification'; 

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });

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
  
      const response = await axios.post(
        'http://localhost:3001/api/blogs',
        blogObject,
        config
      );
  
      setBlogs(blogs.concat(response.data));
      showNotification(`A new blog "${blogObject.title}" by ${blogObject.author} added!`);
    } catch (error) {
      console.error('Error creating blog:', error);
  
      const errorMessage = error.response?.data?.error || 'Error creating blog';
      showNotification(errorMessage, 'error');
    }
  };
  

  return (
    <div>
      <h1>Blog List</h1>

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
          <BlogForm createBlog={createBlog} />
        </div>
      )}

      <h2>Blogs</h2>
      <ul>
        {blogs.map((blog) => (
          <li key={blog.id}>
            {blog.title} by {blog.author}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
