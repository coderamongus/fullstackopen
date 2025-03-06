import { useState } from 'react';

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    });

    alert(`A new blog "${newTitle}" by ${newAuthor} added!`);

    setNewTitle('');
    setNewAuthor('');
    setNewUrl('');
  };

  return (
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={handleSubmit}>
        <div>
          Title: <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
        </div>
        <div>
          Author: <input value={newAuthor} onChange={(e) => setNewAuthor(e.target.value)} />
        </div>
        <div>
          URL: <input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default BlogForm;
