import { Locator, Page } from '@playwright/test';

export class LoginPage{
    page: Page;
    usernamefield: Locator;
    userpasswordfield: Locator;
    loginButton: Locator;

    constructor(page: Page){
        this.page = page;
        this.usernamefield = page.getByPlaceholder('Username');
        this.userpasswordfield = page.getByPlaceholder('Password');
        this.loginButton = page.getByRole('button', { name: 'Login'});
    }
}