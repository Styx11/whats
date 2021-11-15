import ConfigStoreManager, { ConfigItem } from '../ConfigManager'
import langSup from './support.json'

// the youdao api is NOT opening for free
// so we try to use the iciba api instead
// when we're translating between en and zh

// returns a boolean representing whether to use the default API
export const checkLang = (from: string, to: string) =>
{
	if (from && to && (from === to)) throw new Error('请输入有效的值');

	const isChinese = ConfigStoreManager.getInstance().getConfig(ConfigItem.IS_CHINESE);

	// youdao support language
	const { normal, minor } = langSup;
	const zhSup = normal['zh-CHS'];

	// use iciba
	if (!from && !to) return true;
	if (isChinese && !(to in zhSup)) return true;
	if ((from === 'zh-CHS' || !from) && (to === 'en' || !to)) return true;
	if ((from === 'en' || !from) && (to === 'zh-CHS' || !to)) return true;

	// use youdao
	const normalFrom = from && ((normal as any)[from]);
	const minorFrom = from && (minor as any)[from];

	if (normalFrom && (!to || normalFrom[to]))
	{
		return false;
	} else if (minorFrom && (!to || minorFrom[to]))
	{
		return false;
	} else
	{
		throw new Error('源语言或目标语言不受支持');
	}
};