import { test as testBase, expect as baseExpect, Locator } from '@playwright/test'
import { Account, AccountManager } from './controllers/AccountManager';
import { LoginPage } from './page-objects/LoginPage';
import path from 'path';
import fs from 'fs';
import { BookingController } from './controllers/BookingController';
import { InventoryPage } from './page-objects/InventoryPage';

export type visualCheckOptions = {
    myMasks?: Locator[],
    elementContent?: Locator,
    scrollableContent?: Locator
}

interface TestFixtures {
    loginPage: LoginPage,
    inventoryPage: InventoryPage,
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
    inventoryPage: async({ page}, use) => {
        await use(new InventoryPage(page));
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
            const elementSnapshotSize = await snapshotOptions?.elementContent?.boundingBox() ?? { width: 0, height: 0};
            const scrollableSnapshotSize = await snapshotOptions?.scrollableContent?.boundingBox() ?? { width: 0, height: 0};
            const customizedSnapshotSize = {
                width: elementSnapshotSize.width || scrollableSnapshotSize.width || normalSnapshotSize.width,
                height: elementSnapshotSize.height || scrollableSnapshotSize.height || normalSnapshotSize.height
            }

            //setting snapshotsize to be used
            await page.setViewportSize({
                width: Math.ceil(Math.max(normalSnapshotSize.width, customizedSnapshotSize.width)),
                height: Math.ceil(Math.max(normalSnapshotSize.height, customizedSnapshotSize.height))
            });

            //selecting the snapshot size while visual check
            if(typeof snapshotOptions?.elementContent != "undefined"){
                await expect.soft(snapshotOptions?.elementContent).toHaveScreenshot(`${ snapshotName }.png`, {
                    mask: allMasks,
                    maxDiffPixelRatio: 0.02
                })
            } else {
                await expect.soft(page).toHaveScreenshot(`${ snapshotName }.png`, {
                    fullPage: true,
                    mask: allMasks,
                    maxDiffPixelRatio: 0.02

                })
            }
            //resetting the viewportSize
            await page.setViewportSize(normalSnapshotSize)!;
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

        const page = await browser.newPage({ storageState: undefined});
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