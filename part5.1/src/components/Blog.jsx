import { useState } from 'react';

const Blog = ({ blog }) => {
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
          <p>URL: <a href={blog.url} target="_blank" rel="noopener noreferrer">{blog.url}</a></p>
          <p>Likes: {blog.likes} <button>Like</button></p>
          <p>Author: {blog.author}</p>
          <p>Username: {blog.user?.name || 'Unknown'}</p>
        </div>
      )}
    </div>
  );
};

export default Blog;
