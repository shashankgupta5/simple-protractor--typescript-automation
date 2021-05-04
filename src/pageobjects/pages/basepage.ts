import { browser } from "protractor";
import { DriverHelper } from "../../helper/driverhelper";
import { LogUtils } from "../../utils/logutils";

export abstract class BasePage extends DriverHelper {

	public async verifyTitle(title: string) {
		await this.waitUntilPageLoaded();

		let someTitle = await browser.getTitle();
		LogUtils.info(someTitle);
		expect<any>(someTitle).toContain(title);
	}

}