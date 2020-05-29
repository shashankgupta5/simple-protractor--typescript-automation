import { ComponentPage } from "./componentpage";
import { browser } from "protractor";
import { LogUtils } from "../../utils/logutils";

export abstract class BasePage extends ComponentPage {

	public async verify(title: string) {
		await this.waitUntilPageLoaded();
		let someTitle = await browser.getTitle();
		LogUtils.info(someTitle);
		expect<any>(someTitle).toContain(title);
	}

}