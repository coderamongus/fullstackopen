const { test, expect, beforeEach, describe } = require('@playwright/test');

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset');
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    });
    await page.goto('http://localhost:5177/');
  });

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByPlaceholder('Username')).toBeVisible();
    await expect(page.getByPlaceholder('Password')).toBeVisible();
  });

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByPlaceholder('Username').fill('mluukkai');
      await page.getByPlaceholder('Password').fill('salainen');
      await page.getByRole('button', { name: /login/i }).click();
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible();
    });

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByPlaceholder('Username').fill('mluukkai');
      await page.getByPlaceholder('Password').fill('wrongpassword');
      await page.getByRole('button', { name: /login/i }).click();
      await expect(page.getByText(/wrong username\/password/i)).toBeVisible();
      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible();
    });
  });

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByPlaceholder('Username').fill('mluukkai');
      await page.getByPlaceholder('Password').fill('salainen');
      await page.getByRole('button', { name: /login/i }).click();
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible();
    });

    test('a new blog can be created', async ({ page }) => {
      const randomTitle = `A Playwright Blog ${Date.now()}`;
      
      await page.getByRole('button', { name: /new blog/i }).click();
      await page.getByPlaceholder('Title').fill(randomTitle);
      await page.getByPlaceholder('Author').fill('Playwright Bot');
      await page.getByPlaceholder('URL').fill('https://playwright.dev');
      
      const responsePromise = page.waitForResponse(response => 
        response.url().includes('/api/blogs') && response.request().method() === 'POST'
      );
      await page.getByRole('button', { name: /create/i }).click();
      const response = await responsePromise;
      expect(response.status()).toBe(201);

      await expect(page.getByText(/new blog.*added/i)).toBeVisible();

      await page.waitForSelector('div[style*="border: 1px solid black"]');
      
      const blogEntry = page.locator('div[style*="border: 1px solid black"]')
        .filter({ hasText: randomTitle })
        .filter({ hasText: 'Playwright Bot' })
        .first();
      await expect(blogEntry).toBeVisible();
      
      const blogContent = await blogEntry.textContent();
      expect(blogContent).toContain(randomTitle);
      expect(blogContent).toContain('Playwright Bot');
    });
  });
});