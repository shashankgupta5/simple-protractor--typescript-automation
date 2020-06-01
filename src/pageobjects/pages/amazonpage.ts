import { BasePage } from "./BasePage";

export class AmazonPage extends BasePage {

	public async clickAmazonPantryElement() {
		await this.waitUntilPageLoaded();
		await this.waitForAtLeastOneDOMElementToBePresent(['#nav-cart', '.abc']);
	}

}