import path from 'path';
import fs from 'fs';
import test, { expect } from '../myFixture';
import { LoginPage } from '../page-objects/LoginPage';

const authFileNormalUser = path.join('.auth', './normal_user.json');
const authFileAdminUser = path.join('.auth', './admin_user.json');

test('Authenticate normal user', async ({ loginPage, page }) => {
    await page.goto('/');
    await loginPage.usernamefield.click();
    await loginPage.usernamefield.fill(process.env.USERNAME_N!);
    await loginPage.userpasswordfield.click();
    await loginPage.userpasswordfield.fill(process.env.PWD_N!);
    await loginPage.loginButton.click();
    await expect(page).toHaveURL('inventory.html');
    
    //TODO loginProcess after the LoginPage POM & Fixture Completion
    if(!fs.existsSync('.auth')){
        fs.mkdirSync('auth');
    }

    await page.context().storageState({ path: authFileNormalUser});
});

test('Authenticate admin user', async({ loginPage, page }) => {
    await page.goto('/');
    await loginPage.usernamefield.click();
    await loginPage.usernamefield.fill(process.env.USERNAME_A!);
    await loginPage.userpasswordfield.click();
    await loginPage.userpasswordfield.fill(process.env.PWD_A!);
    await loginPage.loginButton.click();
    await expect(page).toHaveURL('inventory.html');
    
    //TODO LoginProcess after the LoginPage POM & Fixture Completion

        if(!fs.existsSync('.auth')){
        fs.mkdirSync('auth');
    }

    await page.context().storageState({ path: authFileAdminUser});
})