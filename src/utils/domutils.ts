import { JSDOM } from 'jsdom';
import { LogUtils } from './LogUtils';

export class DomUtils {

	public static getHTMLStringAsDocument(pageSource: string): Document {
		return new JSDOM(pageSource).window.document;
	}

	public static getElement(pageSource: string, cssQuerySelector: string): Element | null {
		let document = DomUtils.getHTMLStringAsDocument(pageSource);
		return DomUtils.getElementByDocument(document, cssQuerySelector);
	}

	public static getElementByDocument(document: Document, cssQuerySelector: string): Element | null {
		let elements = DomUtils.getElements(document, cssQuerySelector);

		if (elements.length === 0) {
			let failure: string = `getElementByDocument - Could not find Element in source, located by ${cssQuerySelector}`;
			LogUtils.debug(failure);
			throw new Error(failure);
		}

		return elements.item(0);
	}

	public static getElements(document: Document, cssQuerySelector: string): NodeListOf<Element> {
		let elements = document.querySelectorAll(cssQuerySelector);
		return elements;
	}

	public static getElementText(pageSource: string, cssQuerySelector: string): string {
		return <string>DomUtils.getElement(pageSource, cssQuerySelector)?.textContent;
	}

	public static isAtLeastOneDOMElementIsPresent(pageSource: string, cssQuerySelectors: string[]): boolean {
		for (let selector of cssQuerySelectors) {
			try {
				return DomUtils.getElement(pageSource, selector) !== null;
			} catch (error) {
				LogUtils.debug(`isAtLeastOneDOMElementIsPresent - Trying with next Selector`);
			}
		}
		return false;
	}

}