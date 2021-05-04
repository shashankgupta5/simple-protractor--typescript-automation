import { ElementFinder, element, by } from "protractor";
import { BasePage } from "./basepage";

export class SuperCalculatorPage extends BasePage {

	private readonly firstNumber: ElementFinder = element(by.model('first'));
	private readonly secondNumber: ElementFinder = element(by.model('second'));
	private readonly goButton: ElementFinder = element(by.css('#gobutton'));
	private readonly result: ElementFinder = element(by.xpath('//div/div/form/h2'));

	public async addTheseTwoNumbers(firstNumber: number, secondNumber: number, result: number) {
		await this.sendKeysToWebElement(this.firstNumber, `${firstNumber}`);
		await this.sendKeysToWebElement(this.secondNumber, `${secondNumber}`);
		await this.clickWithJavascript(this.goButton);

		expect<any>(this.result.getText()).toEqual(result + '');
	}

}