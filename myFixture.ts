import { test as testBase, expect as baseExpect, Locator } from '@playwright/test';
import { Account, AccountManager } from './controllers/AccountManager';
import { LoginPage } from './page-objects/LoginPage';
import path from 'path';
import fs from 'fs';

export type visualCheckOptions = {
    myMasks: Locator[],
    elementContent: Locator,
    scrollableContent: Locator
}

interface TestFixtures {
    loginPage: LoginPage,
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

    checkVisually: async({ page }, use) => {
        await use(async( snapshotName: string, snapshotOptions?: visualCheckOptions) => {

            //masks if needed
            const basicMasks: Locator[] = [];
            const allMasks = [...basicMasks, ...snapshotOptions?.myMasks ?? []];

            //assigning normal snapshot size
            const normalSnapshotSize = await page.viewportSize()!;

            //assigning customized snapshot size
            const elementSnapshotSize = await snapshotOptions?.elementContent.boundingBox() ?? { width: 0, height: 0};
            const scrollableSnapshotSize = await snapshotOptions?.scrollableContent.boundingBox() ?? { width: 0, height: 0};
            const customizedSnapshotSize = {
                width: normalSnapshotSize.width || elementSnapshotSize.width || scrollableSnapshotSize.width,
                height: normalSnapshotSize.height || elementSnapshotSize.height || scrollableSnapshotSize.height
            }

            //selecting the snapshot size while visual check
            if(typeof snapshotOptions?.elementContent != "undefined"){
                await expect.soft(page).toHaveScreenshot(`${ snapshotName}`, {
                    mask: allMasks,
                })
            } else {
                await expect.soft(page).toHaveScreenshot(`${ snapshotName}`, {
                    fullPage: true,
                    mask: allMasks
                })
            }
        })
    },

    //TODO: WORKER-SCOPED FIXTURE
    //WORKER-SCOPED FIXTURES
})

export default test;
export const { expect } = test;