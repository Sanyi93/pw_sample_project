import path from 'path';
import fs from 'fs';
import test, { expect } from '../myFixture';

const authFileNormalUser = path.resolve('.auth', './normal_user.json');
const authFileAdminUser = path.resolve('.auth', './admin_user.json');

test('Authenticate normal user', async ({ loginPage, page }) => {
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

//TODO: 
// 1 Some inventory page test/workflow of a purchase
// 2 API tests incl. Controller possibly APIconfig/project; 
// 3 Reporting & githubAction workflow