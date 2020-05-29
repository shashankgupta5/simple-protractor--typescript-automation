import { BasePage } from "./basepage";

export class AmazonPage extends BasePage {

	public async clickAmazonPantryElement() {
		await this.waitUntilPageLoaded();
		await this.waitForAtLeastOneDOMElementToBePresent(['#nav-cart', '.abc']);

		// await this.waitAndClickDOMElementWithJavascript('#nav-xshop > a:nth-child(4)');
		// await this.waitForDOMElementToBePresent(".nav-a-content img[alt='Amazon Pantry']");

		// LogUtils.debug(`DOM element found - ${await this.isElementInDOM('select[name=url]')}`);
		// LogUtils.debug(`DOM found Besan - ${await this.domContainsText('Vedaka Gram Flour (100% Chana Besan), 500 g')}`)

		// await this.waitAndClickDOMElementWithJavascript(".bxc-grid__image img[alt='Atta & Rice']");

		// LogUtils.debug(await this.waitForDOMElementAndGetText('#s-result-count'));
	}

}