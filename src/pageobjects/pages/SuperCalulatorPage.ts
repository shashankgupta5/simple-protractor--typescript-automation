import { browser, element, by, ElementFinder } from "protractor";
import { BasePage } from "./BasePage";

export class SuperCalculatorPage extends BasePage {

	private firstNumber: ElementFinder = element(by.model('first'));
	private secondNumber: ElementFinder = element(by.model('second'));
	private goButton: ElementFinder = element(by.css('#gobutton'));
	private result: ElementFinder = element(by.xpath('//div/div/form/h2'));

	public async addTheseTwoNumbers(firstNumber: number, secondNumber: number, result: number) {
		await this.firstNumber.sendKeys(firstNumber + '');
		await this.secondNumber.sendKeys(secondNumber + '');
		await this.goButton.click();

		expect<any>(this.result.getText()).toEqual(result + '');
	}

}