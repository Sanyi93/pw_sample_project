import { Locator, Page } from '@playwright/test';

export class InventoryPage{
    page: Page;

    constructor(page: Page){
        this.page = page;
        

    }
}