import { browser } from "protractor";
import { SuperCalculatorPage } from "../pageobjects/pages/SuperCalulatorPage";

describe('Super Calculator Tests - ', () => {

	let superCalculatorPage: SuperCalculatorPage = new SuperCalculatorPage();

	beforeEach(async () => {
		await (global as any).isAngularSite(true);
		await superCalculatorPage.navigate(browser.params.super_calculator_base_url);
	});

	it('tp verify that page title is correct', async () => {
		await superCalculatorPage.verify('Super');
	});

	it('to verify it adds two number correctly', async () => {
		await superCalculatorPage.addTheseTwoNumbers(25, 25, 50);
	});

});