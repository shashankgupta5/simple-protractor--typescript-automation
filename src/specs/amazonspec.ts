import { browser } from "protractor";
import { AmazonPage } from "../pageobjects/pages/amazonpage";

var amazonPage: AmazonPage;

describe('Amazon Tests - ', () => {

	beforeAll(async () => {
		amazonPage = new AmazonPage();
		await (global as any).isAngularSite(false);
		await amazonPage.navigate(browser.params.amazon_base_url);
	});

	it('Verify that page title is correct', async () => {
		await amazonPage.verify('Amazon');
		await amazonPage.clickAmazonPantryElement();
	});

	afterAll(async () => {
		await amazonPage.close();
		await browser.quit();
	});

});