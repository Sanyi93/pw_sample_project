import { Locator, Page } from '@playwright/test';

export class InventoryPage{
    page: Page;
    backpackAddToCartButton: Locator;
    backpackRemoveFromCartButton: Locator;
    shoppingCartIcon: Locator;
    shoppingCartBadge: Locator;
    checkoutButton: Locator;
    firstNameField: Locator;
    lastNameField: Locator;
    postalCodeField: Locator;
    continueButton: Locator;
    finishButton: Locator;
    backHomeButton: Locator;
    


    constructor(page: Page){
        this.page = page;
        this.backpackAddToCartButton = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
        this.backpackRemoveFromCartButton = page.locator('[data-test="remove-sauce-labs-backpack"]');
        this.shoppingCartIcon = page.locator('[data-test="shopping-cart-link"]');
        this.shoppingCartBadge = page.locator('[data-test="shopping-cart-badge"]');
        this.firstNameField = page.getByPlaceholder('First Name');
        this.lastNameField = page.getByPlaceholder('Last Name');
        this.postalCodeField = page.getByPlaceholder('Zip/Postal Code');
        this.checkoutButton = page.getByRole('button', { name: 'Checkout'});
        this.continueButton = page.getByRole('button', { name: 'Continue'});
        this.finishButton = page.getByRole('button', { name: 'Finish'});
        this.backHomeButton = page.getByRole('button', { name: 'Back Home'});
    }
}