import { browser } from "protractor";
import { AmazonPage } from "../pageobjects/pages/AmazonPage";
import { LogUtils } from "../utils/LogUtils";

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
		try {
			await amazonPage.close();
			await browser.quit();
		}
		catch (err) {
			LogUtils.debug(err);
		}
	});

});