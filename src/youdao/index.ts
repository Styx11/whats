import { request } from '../../lib/shared/request';
import support from '../../lib/util/support.json';
import ConfigStoreManager, { ConfigItem } from '../../lib/ConfigManager';
import getTime from '../../lib/util/getTime';
import { getSource } from './source';
import { format } from './format';
import { print } from './print';
import ora from 'ora';
import DatabaseManager from '../../lib/db/DatabaseManager';

export default async (word: string, from: string, to: string) =>
{
	const all = support.all;
	const isChinese = ConfigStoreManager.getInstance().getConfig(ConfigItem.IS_CHINESE);
	const spinner = ora('搜索中...').start();

	// default to be zh
	let toLang = to ? (all as any)[to] : '中';
	let fromLang = from ? (all as any)[from] : '中';

	// translating sentence between zh and en
	if (!from && !to)
	{
		fromLang = isChinese ? '中' : '英';
		toLang = isChinese ? '英' : '中';
	}

	try
	{
		const source = getSource(word, from, to);
		const getResult = Promise.all([request(source), DatabaseManager.getInstance().createDB()]);
		const [result] = await getResult;
		const formattedResult = format(result, fromLang, toLang);

		const o = formattedResult.orig;
		const t = formattedResult.trans;
		await DatabaseManager.getInstance().insertDB({
			$word: (o && o),
			$source: fromLang,
			$target: toLang,
			$result: (t ? t : '无查询结果'),
			$time: getTime(),
			$host: 'youdao'
		});

		DatabaseManager.getInstance().closeDB();
		spinner.stop();
		print(formattedResult);
	}
	catch (e: any)
	{
		DatabaseManager.getInstance().closeDB();
		spinner.fail(e.message || '或许是网络错误...');
	}
}