import { BasePage } from "./basepage";

export class AmazonPage extends BasePage {

	public async clickAmazonPantryElement() {
		await this.waitUntilPageLoaded();
		await this.waitForAtLeastOneDOMElementToBePresent(['#nav-cart', '.abc']);
	}

}