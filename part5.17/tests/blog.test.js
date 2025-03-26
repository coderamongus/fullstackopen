const { test, expect, beforeEach, describe } = require('@playwright/test');

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset');
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen',
      },
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

      const responsePromise = page.waitForResponse(
        (response) => response.url().includes('/api/blogs') && response.request().method() === 'POST'
      );
      await page.getByRole('button', { name: /create/i }).click();
      await responsePromise;

      await expect(page.getByText(/new blog.*added/i)).toBeVisible();
      await page.waitForSelector('div[style*="border: 1px solid black"]');
    });

    test('a blog can be liked', async ({ page }) => {
      const randomTitle = `A Likeable Blog ${Date.now()}`;

      await page.getByRole('button', { name: /new blog/i }).click();
      await page.getByPlaceholder('Title').fill(randomTitle);
      await page.getByPlaceholder('Author').fill('Like Bot');
      await page.getByPlaceholder('URL').fill('https://playwright.dev');
      await page.getByRole('button', { name: /create/i }).click();

      await page.waitForSelector('div[style*="border: 1px solid black"]');

      const blogEntry = page.locator('div[style*="border: 1px solid black"]').filter({ hasText: randomTitle }).first();
      await expect(blogEntry).toBeVisible();

      const showButton = blogEntry.getByRole('button', { name: /show/i });
      if (await showButton.isVisible()) {
        await showButton.click();
      }

      const likeButton = blogEntry.getByRole('button', { name: /Like/i });
      const likeCountLocator = blogEntry.locator('text=/Likes: (\\d+)/i');
      const initialLikes = parseInt((await likeCountLocator.textContent())?.match(/\d+/)?.[0] || '0', 10);

      await likeButton.click();
      await page.waitForTimeout(500);
      await expect(likeCountLocator).toContainText(`Likes: ${initialLikes + 1}`);
    });

    test('the user who added a blog can delete it', async ({ page }) => {
      const randomTitle = `A Deletable Blog ${Date.now()}`;

      await page.getByRole('button', { name: /new blog/i }).click();
      await page.getByPlaceholder('Title').fill(randomTitle);
      await page.getByPlaceholder('Author').fill('Delete Bot');
      await page.getByPlaceholder('URL').fill('https://playwright.dev');
      await page.getByRole('button', { name: /create/i }).click();

      await page.waitForSelector('div[style*="border: 1px solid black"]');

      const blogEntry = page.locator('div[style*="border: 1px solid black"]').filter({ hasText: randomTitle }).first();
      await expect(blogEntry).toBeVisible();

      const showButton = blogEntry.getByRole('button', { name: /Show/i });
      if (await showButton.isVisible()) {
        await showButton.click();
      }

      await page.evaluate(() => {
        window.confirm = () => true;
      });

      const responsePromise = page.waitForResponse(
        (response) => response.url().includes('/api/blogs/') && response.request().method() === 'DELETE'
      );

      const deleteButton = blogEntry.getByRole('button', { name: /Delete/i });
      await deleteButton.click();
      await responsePromise;

      await page.waitForTimeout(1000);
      await expect(blogEntry).not.toBeVisible();
    });
  });
});

