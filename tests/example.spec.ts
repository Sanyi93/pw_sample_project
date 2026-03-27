import { errorMonitor } from 'events';
import test, { expect } from '../myFixture';

const passwordValidationText = 'Epic sadface: Username and password do not match any user in this service';
const username = 'NonExistingUser';
const password = 'ShallNotMatter';

test.beforeEach(async ({ page }) => {
  await page.goto('');
})

test('Ping test', async ({ page, checkVisually }) => {
  await expect(page).toHaveTitle(/Swag Labs/);
  await checkVisually('Swag-Labs-Login-Page');
});

test('Incorrect login test', async({ checkVisually, loginPage, page }) => {

  await test.step('Negative Login process - providing username, password and clicking the login button', async() => {
    await loginPage.login(username, password)
  });

  await test.step('Checking the loginpage characteristics after an unsuccessful login process', async() => {
    await expect.soft(loginPage.errorButton).toBeVisible();
    await expect.soft(loginPage.passwordValidationElement).toHaveText(passwordValidationText);
    await checkVisually('After-Unauthorized-Login');
  })
})