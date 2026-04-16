import test, { expect } from '../myFixture';

const passwordValidationText = 'Epic sadface: Username and password do not match any user in this service';
const username = 'NonExistingUser';
const password = 'ShallNotMatter';
  
test.beforeEach(async ({ page }) => {
  await page.goto('');
})

test.describe('Testing the most basic functionalities', { tag: ['@ping', '@negative']}, () => {
  test('Ping test', async ({ page, checkVisually }) => {

    test.info().annotations.push({
      type: 'Smoke',
      description: 'Web Title Check'
    });

    await expect(page).toHaveTitle(/Swag Labs/);
    await checkVisually('Swag-Labs-Login-Page');
  });

  test('Incorrect login test', async({ checkVisually, loginPage }) => {

    await test.step('Negative Login process - providing username, password and clicking the login button', async() => {
      await loginPage.login(username, password)
    });

    await test.step('Checking the loginpage characteristics after an unsuccessful login process', async() => {
      await expect.soft(loginPage.errorButton).toBeVisible();
      await expect.soft(loginPage.passwordValidationElement).toHaveText(passwordValidationText);
      await checkVisually('After-Unauthorized-Login');
    })
  })
})

test('Basic Purchase Workflow', async ({ checkVisually, inventoryPage, page}) => {  

  await test.step('Landing on the page', async() => {
    await page.goto('/inventory.html');
    await page.waitForLoadState('domcontentloaded');
    await checkVisually('Inventory-Page-After-Login', { scrollableContent: page.locator('//div[@id="page_wrapper"]')});
  })

  await test.step('Adding item to the cart and proceesing to checkout', async() => {
    await inventoryPage.backpackAddToCartButton.click();
    expect(inventoryPage.backpackRemoveFromCartButton).toBeVisible();
    await checkVisually('Cart-Icon-After-Item-Added', { elementContent: inventoryPage.shoppingCartIcon});
    expect(inventoryPage.shoppingCartBadge).toBeVisible();
    expect(inventoryPage.shoppingCartBadge).toHaveText('1');
    await inventoryPage.shoppingCartIcon.click();
    await checkVisually('Item-In-Shopping-Cart');
    await inventoryPage.checkoutButton.click();
  })

  await test.step('Filling out the checkout form', async() => {
    await inventoryPage.firstNameField.click();
    await inventoryPage.firstNameField.fill("Jake");
    await inventoryPage.lastNameField.click();
    await inventoryPage.lastNameField.fill('Hudson');
    await inventoryPage.postalCodeField.click();
    await inventoryPage.postalCodeField.fill('1120');
    await checkVisually('Checkout-Information-Filled');
    await inventoryPage.continueButton.click();
    await checkVisually('Checkout-Overview');
    await inventoryPage.finishButton.click();
    await checkVisually('Checkout-Completed');
  })

  await test.step('Proceeding to the home page', async() => {
    await inventoryPage.backHomeButton.click();
    await checkVisually('Inventory-Home-Page-After-Successfull-Checkout');
  })
})