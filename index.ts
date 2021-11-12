import say from 'say';
import iciba from './src/iciba';
import youdao from './src/youdao';
import logSymbols from 'log-symbols';
import ConfigStoreManager, { ConfigItem } from './lib/ConfigManager';
import { checkLang } from './lib/util/checkLang';
import { formatQuery } from './lib/util/formatQuery';

export default async (from: string, to: string) =>
{
	try
	{
		const {
			query,
			isSent,
			isChinese,
		} = formatQuery();

		const useIciba = checkLang(from, to) && !isSent;

		const useSay = ConfigStoreManager.getInstance().getConfig<ConfigItem.USE_SAY>(ConfigItem.USE_SAY)
		ConfigStoreManager.getInstance().setConfig<ConfigItem.IS_CHINESE>(ConfigItem.IS_CHINESE, !!isChinese)
		ConfigStoreManager.getInstance().setConfig<ConfigItem.USE_ICIBA>(ConfigItem.USE_ICIBA, useIciba)

		if (useIciba)
		{
			await iciba(query);
		}
		else
		{
			await youdao(query, from, to);
		}

		if (useSay) say.speak(query);

	} catch (e: any)
	{
		const msg = e.message || '出现了一个错误...';
		console.error(logSymbols.error + ' ' + msg);
	}
};