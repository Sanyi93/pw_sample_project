import path from 'path';
import fs from 'fs';
import test, { expect } from '../myFixture';

const authFileNormalUser = path.join('.auth', './normal_user.json');
const authFileAdminUser = path.join('.auth', './admin_user.json');

test('Authenticate normal user', async ({ page }) => {
    await page.goto('/');
    
    //TODO loginProcess after the LoginPage POM & Fixture Completion

    if(!fs.existsSync('.auth')){
        fs.mkdirSync('auth');
    }

    await page.context().storageState({ path: authFileNormalUser});
});

test('Authenticate admin user', async({ page }) => {
    await page.goto('/');

    //TODO LoginProcess after the LoginPage POM & Fixture Completion

        if(!fs.existsSync('.auth')){
        fs.mkdirSync('auth');
    }

    await page.context().storageState({ path: authFileAdminUser});
})