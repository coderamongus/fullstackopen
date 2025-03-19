import React from 'react'
import { render, screen } from '@testing-library/react'
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
})
