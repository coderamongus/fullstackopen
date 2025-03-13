import { useState } from 'react';

const Blog = ({ blog, handleLike }) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} - {blog.author} 
        <button onClick={toggleVisibility}>{visible ? 'Hide' : 'View'}</button>
      </div>

      {visible && (
        <div>
          <p><strong>URL:</strong> <a href={blog.url} target="_blank" rel="noopener noreferrer">{blog.url}</a></p>
          <p><strong>Likes:</strong> {blog.likes} <button onClick={() => handleLike(blog)}>Like</button></p>
          <p><strong>Author:</strong> {blog.author}</p>
          <p><strong>Username:</strong> {blog.user?.name || 'Unknown'}</p>
        </div>
      )}
    </div>
  );
};

export default Blog;
