import React from 'react';

const Blog = ({ blog, handleLike, handleDelete, currentUser }) => {
  const [showDetails, setShowDetails] = React.useState(false);

  const toggleDetails = () => setShowDetails(!showDetails);

  const canDelete = currentUser && (blog.user?.username === currentUser.username || currentUser.username === 'admin');

  return (
    <div style={{ border: '1px solid black', padding: '10px', marginBottom: '10px' }}>
      <div>
        {blog.title} - {blog.author}
        <button onClick={toggleDetails}>{showDetails ? 'Hide' : 'Show'}</button>
      </div>
      {showDetails && (
        <div>
          <p>URL: <a href={blog.url} target="_blank" rel="noopener noreferrer">{blog.url}</a></p>
          <p>
            Likes: {blog.likes} <button onClick={() => handleLike(blog)}>Like</button>
          </p>
          <p>Author: {blog.author}</p>
          <p>Username: {blog.user?.username || 'Unknown'}</p>
          {canDelete && <button onClick={() => handleDelete(blog)}>Delete</button>}
        </div>
      )}
    </div>
  );
};

export default Blog;
