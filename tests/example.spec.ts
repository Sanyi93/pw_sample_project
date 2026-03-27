import { errorMonitor } from 'events';
import test, { expect } from '../myFixture';

const passwordValidationText = 'Epic sadface: Username and password do not match any user in this service';

test.beforeEach(async ({ page }) => {
  await page.goto('');
})

test('Ping test', async ({ page, checkVisually }) => {
  await expect(page).toHaveTitle(/Swag Labs/);
  await checkVisually('Swag-Labs-Login-Page');
});

test('Incorrect login test', async({ checkVisually, loginPage, page }) => {
  await loginPage.usernamefield.click();
  await loginPage.usernamefield.fill('NonExistingUser');
  await loginPage.userpasswordfield.click();
  await loginPage.userpasswordfield.fill('DoesNotReallyMatter');
  await loginPage.loginButton.click();

  await expect.soft(loginPage.errorButton).toBeVisible();
  await expect.soft(loginPage.passwordValidationElement).toHaveText(passwordValidationText);

  await checkVisually('After-Unauthorized-Login');
})