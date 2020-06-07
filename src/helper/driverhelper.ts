import { browser, element, by, ElementFinder, ElementArrayFinder, $$ } from "protractor";
import { WaitTool } from "./WaitTool";
import { DomUtils } from "../utils/DomUtils";
import { LogUtils } from "../utils/LogUtils";

export abstract class DriverHelper extends WaitTool {

	private changeImplicitWait = async (timeToWait: number) => {
		await browser.manage().timeouts().implicitlyWait(timeToWait);
	}

	private restoreImplicitWait = async () => {
		await browser.manage().timeouts().implicitlyWait(browser.params.driver_timeout_implicit);
	}

	//=====
	// Driver-related actions
	//=====

	public async navigate(route: string) {
		let message: string = `Navigating to ${route}`;
		LogUtils.info(message);
		await browser.get(route);
	}

	public async close() {
		await browser.close();
	}

	//=====
	// Element-related actions
	//=====

	public async domContainsText(text: string): Promise<boolean> {
		let pageSource: string = await browser.getPageSource();
		return pageSource.indexOf(text) > -1;
	}

	protected isElementInDOM = async (cssSelector: string): Promise<boolean> => {
		try {
			await this.getDOMElement(cssSelector);
			LogUtils.debug(`isElementInDOM - DOM Element FOUND with selector of ${cssSelector}`);
			return true;
		} catch (error) {
			LogUtils.debug(`isElementInDOM - DOM Element NOT FOUND with selector of ${cssSelector}`);
			return false;
		}
	}

	protected isElementDisplayed = async (cssSelector: string): Promise<boolean> => {
		this.changeImplicitWait(2000);
		try {
			let webElement: ElementFinder = this.getElementBySelector(cssSelector);
			LogUtils.debug(`isElementDisplayed - WebElement FOUND with selector of ${cssSelector}`);
			return await webElement.isDisplayed();
		} catch (error) {
			LogUtils.debug(`isElementDisplayed - WebElement NOT FOUND with selector of ${cssSelector}`);
			return false;
		} finally {
			this.restoreImplicitWait();
		}
	}

	protected isElementInteractable = async (cssSelector: string): Promise<boolean> => {
		this.changeImplicitWait(2000);
		try {
			let webElement: ElementFinder = this.getElementBySelector(cssSelector);
			LogUtils.debug(`isElementInteractable - WebElement FOUND with selector of ${cssSelector}`);
			return await webElement.isDisplayed() && await webElement.isEnabled();
		} catch (error) {
			LogUtils.debug(`isElementInteractable - WebElement NOT FOUND with selector of ${cssSelector}`);
			return false;
		} finally {
			this.restoreImplicitWait();
		}
	}

	protected getDOMElement = async (cssSelector: string): Promise<Element | null> => {
		let pageSource = await browser.getPageSource();
		return DomUtils.getElement(pageSource, cssSelector);
	}

	protected getElementsBySelector = async (cssSelector: string): Promise<ElementArrayFinder | any[]> => {
		let webElements: ElementArrayFinder | any[] = await $$(cssSelector);
		LogUtils.debug(`getElementsBySelector - Found ${webElements.length} by locator ${cssSelector}`)
		return webElements;
	}

	protected async sendKeysToWebElementBySelector(cssSelector: string, text: string) {
		let webElement: ElementFinder = this.getElementBySelector(cssSelector);
		await this.sendKeysToWebElement(webElement, text);
	}

	protected async sendKeysToWebElement(webElement: ElementFinder, text: string) {
		await webElement.clear();
		await webElement.sendKeys(text);
	}

	protected getWebElementTextBySelector = async (cssSelector: string): Promise<string> => {
		return this.getElementBySelector(cssSelector).getText();
	}

	private getElementBySelector(cssSelector: string): ElementFinder {
		return element(by.css(cssSelector));
	}

	protected async pauseTestExecution(timeInMillis: number) {
		await browser.sleep(timeInMillis);
	}

	//=====
	// Page-related actions
	//=====

	protected getPageText = async (): Promise<String | null> => {
		return (await this.getPageBody()).textContent;
	}

	protected getPageBody = async (): Promise<HTMLElement> => {
		return (await this.getPageAsDocument()).body;
	}

	protected getPageAsDocument = async (): Promise<Document> => {
		return DomUtils.getHTMLStringAsDocument(await browser.getPageSource());
	}

	protected async failWithErrorAndIncludePageText(message: string) {
		let innerHTML: any = (await this.getPageBody()).querySelector('#root')?.innerHTML;
		let text: string = `${message}. The Page DOM text was - 												
												${innerHTML}`;
		return this.failWithMessage(text);
	}

	private failWithMessage = async (message: string) => {
		LogUtils.info(message);
		throw new Error(message);
	}

}