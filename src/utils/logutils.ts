import { configure, getLogger } from 'log4js';

configure('./src/config/log4js.json');
const logger = getLogger();

export class LogUtils {

	public static info(toLog: any) {
		logger.info(toLog);
	}

	public static debug(toLog: any) {
		logger.debug(toLog);
	}

}