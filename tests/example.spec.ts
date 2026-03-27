import test, { expect } from '../myFixture';

test('Ping test', async ({ page, checkVisually }) => {
  await page.goto('');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Swag Labs/);

  await checkVisually('Swag-Labs-Login-Page');


});