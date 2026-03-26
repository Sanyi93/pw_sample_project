import { test as testBase, expect as exportBase, Locator } from '@playwright/test';
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

