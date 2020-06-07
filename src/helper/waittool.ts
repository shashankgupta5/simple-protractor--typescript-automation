import { browser, ExpectedConditions, ElementFinder } from "protractor";
import { DomUtils } from "../utils/DomUtils";
import { LogUtils } from "../utils/LogUtils";

const TIMEOUT: number = browser.params.driver_timeout_explicit;

export abstract class WaitTool {

	// ==========
	// General WebElement Helper - Can be used in cases where element located by other than CSS selector.
	// ==========

	protected async waitForElementToBeVisible(webElement: ElementFinder): Promise<any> {
		return await browser.wait(ExpectedConditions.visibilityOf(webElement), TIMEOUT);
	}

	protected async waitAndClickWebElement(webElement: ElementFinder) {
		(await this.waitForElementToBeVisible(webElement)).click();
	}

	protected clickWithJavascript = async (webElement: ElementFinder) => {
		await browser.executeScript("arguments[0].click();", webElement);
	}

	protected async waitAndSendKeys(webElement: ElementFinder, text: string) {
		await this.waitForElementToBeVisible(webElement);
		await webElement.clear();
		await webElement.sendKeys(text);
	}

	protected waitAndGetText = async (webElement: ElementFinder): Promise<string> => {
		await this.waitForElementToBeVisible(webElement);
		return await webElement.getText();
	}

	// ==========
	// General Helper - Can be used in cases where element needs to be find by CSS selector.
	// ==========

	protected clickWithJavascriptBySelector = async (cssSelector: string) => {
		try {
			await browser.executeScript("document.querySelector(arguments[0]).click();", cssSelector);
			LogUtils.debug(`Found and clicked element by selector ${cssSelector}`);
		} catch (err) {
			LogUtils.debug(`Element not found and henced not clicked by selector ${cssSelector}`);
		}
	}

	protected waitAndClickDOMElementWithJavascript = async (cssSelector: string) => {
		await this.waitForDOMElementToBePresent(cssSelector);
		await this.clickWithJavascriptBySelector(cssSelector);
	}

	protected waitForDOMElementToBePresent = async (cssSelector: string) => {
		let domElementIsPresent = async () => {
			try {
				let pageSource: string = await browser.getPageSource();
				if (DomUtils.getElement(pageSource, cssSelector) != null) {
					LogUtils.debug(`waitForDOMElementToBePresent - DOM Element is now Present, selector is ${cssSelector}`);
					return true;
				}
			} catch (error) {
				LogUtils.debug(`waitForDOMElementToBePresent - DOM Element is not Present, selector is ${cssSelector}`);
				return false;
			}
		};
		await browser.wait(domElementIsPresent, TIMEOUT);
	}

	protected waitForDOMElementToBeHidden = async (cssSelector: string) => {
		let elementToBeHidden = async () => {
			try {
				let dom: string = await browser.getPageSource()
				if (DomUtils.getElement(dom, cssSelector) != null) {
					LogUtils.debug(`waitForDOMElementToBeHidden - DOM Element is not hidden, selector is ${cssSelector}`);
					return false;
				}
			}
			catch (err) {
				LogUtils.debug(`waitForDOMElementToBeHidden - DOM Element is hidden now, selector is ${cssSelector}`);
				return true;
			}
			return true;
		};

		await browser.wait(elementToBeHidden, TIMEOUT);
	}

	protected waitForDOMElementAndGetText = async (cssSelector: string): Promise<string | null> => {
		let domElementIsPresentAndGetText = async () => {
			try {
				let pageSource: string = await browser.getPageSource();
				return DomUtils.getElementText(pageSource, cssSelector);
			} catch (error) {
				LogUtils.debug(`waitForDOMElementAndGetText - Element not found by selector ${cssSelector}`);
				return '';
			}
		};
		return await browser.wait(domElementIsPresentAndGetText, TIMEOUT);
	}

	protected waitForAtLeastOneDOMElementToBePresent = async (selectors: string[]) => {
		let atLeastOneDOMElementIsPresent = async () => {
			let pageSource: string = await browser.getPageSource();
			return DomUtils.isAtLeastOneDOMElementIsPresent(pageSource, selectors);
		};
		await browser.wait(atLeastOneDOMElementIsPresent, TIMEOUT);
	}

	protected waitUntilJSReturnsTrue = async (javascript: string) => {
		let jsReturnsTrue = async () => {
			try {
				return await browser.executeScript(javascript);
			}
			catch (err) {
				LogUtils.debug(`waitUntilJSReturnsTrue - JS didn't return true yet!`);
				return false;
			}
		};
		await browser.wait(jsReturnsTrue, TIMEOUT);
	}

	protected waitUntilPageLoaded = async () => {
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