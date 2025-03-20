import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import Blog from './Blog'
import '@testing-library/jest-dom'

const blog = {
  title: 'Test Blog Title',
  author: 'Test Author',
  url: 'http://testurl.com',
  likes: 5,
  user: {
    username: 'testuser',
    name: 'Test User'
  }
}

const currentUser = {
  username: 'testuser',
  name: 'Test User'
}

describe('<Blog />', () => {
  test('renders blog title and author by default, but not url or likes', () => {
    render(<Blog blog={blog} currentUser={currentUser} handleLike={() => {}} handleDelete={() => {}} />)
    expect(screen.getByText('Test Blog Title - Test Author')).toBeInTheDocument()
    const urlElement = screen.queryByText(/http:\/\/testurl\.com/i)
    expect(urlElement).not.toBeInTheDocument()
    const likesElement = screen.queryByText(/Likes:/i)
    expect(likesElement).not.toBeInTheDocument()
  })

  test('shows url, likes, and user info when the "Show" button is clicked', () => {
    render(<Blog blog={blog} currentUser={currentUser} handleLike={() => {}} handleDelete={() => {}} />)
  
    const viewButton = screen.getByText(/show/i)
    fireEvent.click(viewButton)

    expect(screen.getByText('http://testurl.com')).toBeInTheDocument()
    expect(screen.getByText(/Likes: 5/i)).toBeInTheDocument()
    expect(screen.getByText(/Username: testuser/i)).toBeInTheDocument()
  })
  
  test('calls handleLike twice when like button is clicked twice', () => {
    const mockHandleLike = vi.fn()
  
    render(
      <Blog
        blog={blog}
        currentUser={currentUser}
        handleLike={mockHandleLike}
        handleDelete={() => {}}
      />
    )
  
    const showButton = screen.getByText(/show/i)
    fireEvent.click(showButton)
    const likeButton = screen.getByRole('button', { name: /like/i })
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)
  
    expect(mockHandleLike).toHaveBeenCalledTimes(2)
  })
  
})
