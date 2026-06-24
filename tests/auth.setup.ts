import path from 'path';
import fs from 'fs';
import test, { expect } from '../myFixture';

const authFileNormalUser = path.resolve('.auth', './normal_user.json');
const authFileAdminUser = path.resolve('.auth', './admin_user.json');

const USERNAME_N = process.env.USERNAME_N;
const PWD_N = process.env.PWD_N;

const USERNAME_A = process.env.USERNAME_A;
const PWD_A = process.env.PWD_A;


test('Authenticate normal user', async ({ loginPage, page }) => {
    if(!USERNAME_N || !PWD_N){
        throw new Error('Missing credential variables for normal user - configure local variables or CI github secrets')
    }
    await page.goto('/');
    await loginPage.usernamefield.click();
    await loginPage.usernamefield.fill(process.env.USERNAME_N!);
    await loginPage.userpasswordfield.click();
    await loginPage.userpasswordfield.fill(process.env.PWD_N!);
    await loginPage.loginButton.click();
    await expect(page).toHaveURL('inventory.html');
    
    if(!fs.existsSync('.auth')){
        fs.mkdirSync('.auth');
    }

    await page.context().storageState({ path: authFileNormalUser});
});

test('Authenticate admin user', async({ loginPage, page }) => {
    if(!USERNAME_A || !PWD_A){
        throw new Error('Missing credential variables for admin - configure local variables or CI github secrets')
    }
    await page.goto('/');
    await loginPage.usernamefield.click();
    await loginPage.usernamefield.fill(process.env.USERNAME_A!);
    await loginPage.userpasswordfield.click();
    await loginPage.userpasswordfield.fill(process.env.PWD_A!);
    await loginPage.loginButton.click();
    await expect(page).toHaveURL('inventory.html');
    
        if(!fs.existsSync('.auth')){
        fs.mkdirSync('.auth');
    }

    await page.context().storageState({ path: authFileAdminUser});
})