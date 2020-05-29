import { browser, element, until, ExpectedConditions, by, ElementFinder } from "protractor";
import { DomUtils } from "../utils/domutils";
import { LogUtils } from "../utils/logutils";

const TIMEOUT: number = browser.params.driver_timeout_explicit;

export abstract class WaitTool {

	public waitForElementToBeVisible = async (webElement: ElementFinder) => {
		return await browser.wait(ExpectedConditions.visibilityOf(webElement), TIMEOUT);
	}

	public waitForElementToBeVisibleBySelector = async (cssSelector: string) => {
		let webElement = element(by.cssSelector(cssSelector));
		return await browser.wait(ExpectedConditions.visibilityOf(webElement), TIMEOUT);
	}

	public clickWithJavascriptBySelector = async (cssSelector: string) => {
		await browser.executeScript("document.querySelector(arguments[0]).click();", cssSelector);
	}

	public clickWithJavascript = async (webElement: ElementFinder) => {
		await browser.executeScript("arguments[0].click();", webElement);
	}

	public waitAndClickWithJavascript = async (webElement: ElementFinder) => {
		await this.waitForElementToBeVisible(webElement);
		await this.clickWithJavascript(webElement);
	}

	public waitAndClickWithJavascriptBySelector = async (cssSelector: string) => {
		await this.waitForElementToBeVisibleBySelector(cssSelector);
		await this.clickWithJavascriptBySelector(cssSelector);
	}

	public waitAndClickDOMElementWithJavascript = async (cssSelector: string) => {
		await this.waitForDOMElementToBePresent(cssSelector);
		await this.clickWithJavascriptBySelector(cssSelector);
	}

	public waitAndSendKeys = async (webElement: ElementFinder, text: string) => {
		await this.waitForElementToBeVisible(webElement);
		await webElement.clear();
		await webElement.sendKeys(text);
	}

	public waitForDOMElementToBePresent = async (cssSelector: string) => {
		let domElementIsPresent = async () => {
			try {
				let pageSource: string = await browser.getPageSource();
				if (DomUtils.getElement(pageSource, cssSelector) !== null) {
					LogUtils.debug(`DOM Element is now Present`);
					return true;
				}
			} catch (error) {
				LogUtils.debug(`DOM Element is not Present`);
				return false;
			}
		};
		await browser.wait(domElementIsPresent, TIMEOUT);
	}

	public waitForDOMElementToBeHidden = async (cssSelector: string) => {
		let elementToBeHidden = async () => {
			try {
				let dom: string = await browser.getPageSource()
				if (DomUtils.getElement(dom, cssSelector) === null) {
					LogUtils.debug(`DOM Element was hidden now`);
					return true;
				}
				return false;
			}
			catch (err) {
				LogUtils.debug(`DOM Element is not hidden`);
				return true;
			}
		};

		await browser.wait(elementToBeHidden, TIMEOUT);
	}

	public waitAndGetText = async (webElement: ElementFinder): Promise<string> => {
		await this.waitForElementToBeVisible(webElement);
		return await webElement.getText();
	}

	public waitForDOMElementAndGetText = async (cssSelector: string): Promise<string | null> => {
		let domElementIsPresentAndGetText = async () => {
			try {
				let pageSource: string = await browser.getPageSource();
				return DomUtils.getElementText(pageSource, cssSelector);
			} catch (error) {
				LogUtils.debug(`Element text not found by selector ${cssSelector}`);
				return '';
			}
		};
		return await browser.wait(domElementIsPresentAndGetText, TIMEOUT);
	}

	public waitForAtLeastOneDOMElementToBePresent = async (selectors: string[]) => {
		let atLeastOneDOMElementIsPresent = async () => {
			let pageSource: string = await browser.getPageSource();
			return DomUtils.isAtLeastOneDOMElementIsPresent(pageSource, selectors);
		};
		await browser.wait(atLeastOneDOMElementIsPresent, TIMEOUT);
	}

	public waitUntilJSReturnsTrue = async (javascript: string) => {
		let jsReturnsTrue = async () => {
			try {
				return await browser.executeScript(javascript);
			}
			catch (err) {
				LogUtils.debug(`JS didn't return true yet!`);
				return false;
			}
		};
		await browser.wait(jsReturnsTrue, TIMEOUT);
	}

	public waitUntilPageLoaded = async () => {
		let jsReturnsTrueAndDomStopsUpdating = async () => {
			try {
				let originalDOM: string = await browser.getPageSource();
				let loadingCompleted: boolean = await browser.executeScript("return document.readyState === 'complete'");
				let currentDOM: string = await browser.getPageSource();

				let isDOMIdentical: boolean = originalDOM === currentDOM;

				if (!isDOMIdentical)
					await this.delay(1000);

				return isDOMIdentical && loadingCompleted;
			}
			catch (err) {
				return false;
			}
		};
		await browser.wait(jsReturnsTrueAndDomStopsUpdating, TIMEOUT);
	}

	private delay = async (timeoutInMillis: number) => {
		return await new Promise(resolve => setTimeout(resolve, timeoutInMillis));
	}

}