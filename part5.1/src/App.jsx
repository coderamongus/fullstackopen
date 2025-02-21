import { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]); 

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/api/login', {
        username,
        password,
      });

      setUser(response.data); 
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  useEffect(() => {
    if (user) {
      axios.get('http://localhost:3001/api/blogs', {
        headers: {
          Authorization: `Bearer ${user.token}` 
        }
      })
      .then(response => {
        setBlogs(response.data);
      })
      .catch(error => {
        console.error('Error fetcing blogs:', error.message);
      });
    }
  }, [user]);
  

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h2>Blogs</h2>
      <p>{user.name} logged in</p>
      <ul>
        {blogs.map(blog => (
          <li key={blog.id}>
            {blog.title} by {blog.author}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
