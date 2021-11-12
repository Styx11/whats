// log module makes sure that every sentence indents two spaces
// when log sents in iciba, it won't overflow
import ConfigStoreManager, { ConfigItem } from '../ConfigManager'

export default (str: string) =>
{
	const curRows = ConfigStoreManager.getInstance().getConfig<ConfigItem.AVAIL_ROWS>(ConfigItem.AVAIL_ROWS);

	console.group();
	console.log(str);
	console.groupEnd();

	ConfigStoreManager.getInstance().setConfig<ConfigItem.AVAIL_ROWS>(ConfigItem.AVAIL_ROWS, curRows - 1);
};