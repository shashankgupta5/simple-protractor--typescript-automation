import { browser } from "protractor";
import { AmazonPage } from "../pageobjects/pages/AmazonPage";

describe('Amazon Tests - ', () => {

	let amazonPage: AmazonPage = new AmazonPage();

	beforeEach(async () => {
		await (global as any).isAngularSite(false);
		await amazonPage.navigate(browser.params.amazon_base_url);
	});

	it('to verify that page title is correct', async () => {
		await amazonPage.verify('Amazon');
	});

});