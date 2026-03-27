import { Locator, Page } from '@playwright/test';

export class LoginPage{
    page: Page;
    usernamefield: Locator;
    userpasswordfield: Locator;
    loginButton: Locator;
    errorButton: Locator;
    passwordValidationElement: Locator;

    constructor(page: Page){
        this.page = page;
        this.usernamefield = page.getByPlaceholder('Username');
        this.userpasswordfield = page.getByPlaceholder('Password');
        this.loginButton = page.getByRole('button', { name: 'Login'});
        this.errorButton = page.locator('//button[@class = "error-button"]');
        this.passwordValidationElement = page.locator('//h3[@data-test = "error"]');
    }
}