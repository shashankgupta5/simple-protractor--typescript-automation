import { browser } from "protractor";
import { SuperCalculatorPage } from "../pageobjects/pages/supercalculatorpage";

var superCalculatorPage: SuperCalculatorPage;

describe('Super Calculator Tests - ', () => {

	beforeAll(async () => {
		superCalculatorPage = new SuperCalculatorPage();
		await (global as any).isAngularSite(true);
		await superCalculatorPage.navigate(browser.params.super_calculator_base_url);
	});

	it('Verify that page title is correct', async () => {
		await superCalculatorPage.verify('Super');
	});

	it('Verify it adds two number correctly', async () => {
		await superCalculatorPage.addTheseTwoNumbers(25, 25, 50);
	});

	afterAll(async () => {
		await superCalculatorPage.close();
		await browser.quit();
	});

});