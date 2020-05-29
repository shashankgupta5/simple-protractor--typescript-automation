import { browser, element, by, ElementFinder, ElementArrayFinder } from "protractor";
import { WaitTool } from "./waittool";
import { DomUtils } from "../utils/domutils";
import { LogUtils } from "../utils/logutils";

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

	public static isElementInDOM(pageSource: string, cssQuerySelector: string): boolean {
		let document = DomUtils.getHTMLStringAsDocument(pageSource);
		try {
			DomUtils.getElementByDocument(document, cssQuerySelector);
			return true;
		} catch (error) {
			return false;
		}
	}

	public isElementInDOM = async (cssSelector: string): Promise<boolean> => {
		try {
			await this.getDOMElement(cssSelector);
			LogUtils.debug(`DOM Element FOUND with selector of ${cssSelector}`);
			return true;
		} catch (error) {
			LogUtils.debug(`DOM Element NOT FOUND with selector of ${cssSelector}`);
			return false;
		}
	}

	public getDOMElement = async (cssSelector: string): Promise<Element | null> => {
		let pageSource = await browser.getPageSource();
		return DomUtils.getElement(pageSource, cssSelector);
	}

	public isElementVisible = async (cssSelector: string): Promise<boolean> => {
		this.changeImplicitWait(2000);
		try {
			let webElement: ElementFinder = element(by.cssSelector(cssSelector));
			LogUtils.debug(`WebElement FOUND with selector of ${cssSelector}`);
			return webElement.isDisplayed();
		} catch (error) {
			LogUtils.debug(`WebElement NOT FOUND with selector of ${cssSelector}`);
			return false;
		} finally {
			this.restoreImplicitWait();
		}
	}

	public getElementsBySelector = async (cssSelector: string): Promise<any> => {
		let webElements: any | ElementArrayFinder = await element.all(by.cssSelector(cssSelector));
		return webElements;
	}

	//=====
	// Page-related actions
	//=====

	public failWithErrorAndIncludePageText(message: string) {
		let text: string = `The Page DOM text was - 
												${message}
												${this.getPageText()}`;
		return this.failWithMessage(text);
	}

	public failWithMessage = async (message: string) => {
		LogUtils.info(message);
		throw new Error(message);
	}

	public getPageText = async (): Promise<String | null> => {
		return (await this.getPageBody()).textContent;
	}

	public getPageBody = async (): Promise<HTMLElement> => {
		return DomUtils.getHTMLStringAsDocument(await browser.getPageSource()).body;
	}

}