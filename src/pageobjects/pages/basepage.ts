import { browser } from "protractor";
import { LogUtils } from "../../utils/LogUtils";
import { DriverHelper } from "../../helper/DriverHelper";

export abstract class BasePage extends DriverHelper {

	public async verify(title: string) {
		await this.waitUntilPageLoaded();
		let someTitle = await browser.getTitle();
		LogUtils.info(someTitle);
		expect<any>(someTitle).toContain(title);
	}

}