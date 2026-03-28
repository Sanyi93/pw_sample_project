import { test as testBase, expect as baseExpect, Locator } from '@playwright/test';
import { Account, AccountManager } from './controllers/AccountManager';
import { LoginPage } from './page-objects/LoginPage';
import path from 'path';
import fs from 'fs';
import { BookingController } from './controllers/BookingController';

export type visualCheckOptions = {
    myMasks: Locator[],
    elementContent: Locator,
    scrollableContent: Locator
}

interface TestFixtures {
    loginPage: LoginPage,
    bookingController: BookingController
    checkVisually: (snapshotName: string, snapshotOptions?: visualCheckOptions) => Promise<void>;
}

interface WorkerFixtures {
    workerStorageState: string,
    acquireAccount: (id: number) => Promise<Account>;
}

const test = testBase.extend<TestFixtures, WorkerFixtures>({
    
    //TEST-SCOPED FIXTURES
    loginPage: async({ page }, use) => {
        await use(new LoginPage(page));
    },
    bookingController: async({ request }, use) => {
        await use(new BookingController(request));
    },

    checkVisually: async({ page }, use) => {
        await use(async( snapshotName: string, snapshotOptions?: visualCheckOptions) => {

            //masks if needed
            const basicMasks: Locator[] = [];
            const allMasks = [...basicMasks, ...snapshotOptions?.myMasks ?? basicMasks];

            //assigning normal snapshot size
            const normalSnapshotSize = await page.viewportSize()!;

            //assigning customized snapshot size
            const elementSnapshotSize = await snapshotOptions?.elementContent.boundingBox() ?? { width: 0, height: 0};
            const scrollableSnapshotSize = await snapshotOptions?.scrollableContent.boundingBox() ?? { width: 0, height: 0};
            const customizedSnapshotSize = {
                width: normalSnapshotSize.width || elementSnapshotSize.width || scrollableSnapshotSize.width,
                height: normalSnapshotSize.height || elementSnapshotSize.height || scrollableSnapshotSize.height
            }
            //setting snapshotsize to be used
            await page.setViewportSize(customizedSnapshotSize);

            //selecting the snapshot size while visual check
            if(typeof snapshotOptions?.elementContent != "undefined"){
                await expect.soft(page).toHaveScreenshot(`${ snapshotName }.png`, {
                    mask: allMasks,
                })
            } else {
                await expect.soft(page).toHaveScreenshot(`${ snapshotName }.png`, {
                    fullPage: true,
                    mask: allMasks
                })
            }
            //resetting the viewportSize
            await page.setViewportSize(normalSnapshotSize);
        })
    },

    //WORKER-SCOPED FIXTURES
    //account
    acquireAccount: [ async({ }, use) => {
        const accountManager = new AccountManager();
        await use((id: number) => accountManager.acquireAccount(id));
    }, { scope: 'worker'}],

    //storage state based on the account
    workerStorageState: [ async({ browser, acquireAccount }, use) => {
        const id = test.info().parallelIndex;
        const fileName = path.resolve(test.info().project.outputDir, `auth/${id}.json`);

        if(fs.existsSync(fileName)){
            await use(fileName);
            return;
        }

        const page =  await browser.newPage({ storageState: undefined});
        const account = await acquireAccount(id);

        //worker-scoped authentication based on the account ordered
        await page.goto('https://saucedemo.com/');
        await page.getByPlaceholder('Username').fill(account.username);
        await page.getByPlaceholder('Password').fill(account.password);
        await page.getByRole('button', { name: 'Login'}).click();

        //saving authentication state
        await expect(page).toHaveURL(/.*inventory.html/);
        await page.context().storageState({ path: fileName});
        await page.close();
        await use(fileName);
    }, { scope: 'worker'}],
})

export default test;
export const { expect } = test;