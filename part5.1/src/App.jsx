import { useState, useEffect } from 'react';
import axios from 'axios';
import BlogForm from './components/BlogForm';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); 

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
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedBlogUser');
    setUser(null);
    setBlogs([]);
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
    } catch (error) {
      console.error('Error creating blog:', error);
    }
  };

  return (
    <div>
      <h1>Blog List</h1>
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