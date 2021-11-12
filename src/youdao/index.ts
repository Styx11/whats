import { request } from '../../lib/shared/request';
import support from '../../lib/util/support.json';
import ConfigStoreManager, { config, ConfigItem } from '../../lib/ConfigManager';
import getTime from '../../lib/util/getTime';
import { getSource } from './source';
import { format } from './format';
import { print } from './print';
import ora from 'ora';
import { createDB, insertDB } from '../../lib/db/handlers';

export default async (word: string, from: string, to: string) =>
{
	const all = support.all;
	const isChinese = ConfigStoreManager.getInstance().getConfig<ConfigItem.IS_CHINESE>(ConfigItem.IS_CHINESE);;
	const { db, created } = config.dbOpts;
	const spinner = ora('搜索中...').start();
	const createWrapper = () =>
	{
		return created
			? Promise.resolve()
			: createDB(db);
	}

	// default to be zh
	let toLang = to ? (all as any)[to] : '中';
	let fromLang = from ? (all as any)[from] : '中';

	// translating sentence between zh and en
	if (!from && !to)
	{
		if (isChinese)
		{
			fromLang = '中';
			toLang = '英';
		} else
		{
			fromLang = '英';
			toLang = '中';
		}
	}

	try
	{
		const source = getSource(word, from, to);
		const getResult = Promise.all([request(source), createWrapper()]);
		const [result] = await getResult;
		const formattedResult = format(result, fromLang, toLang);

		const o = formattedResult.orig;
		const t = formattedResult.trans;
		await insertDB(db, {
			$word: (o && o),
			$source: fromLang,
			$target: toLang,
			$result: (t ? t : '无查询结果'),
			$time: getTime(),
			$host: 'youdao'
		});

		db.close();
		spinner.stop();
		print(formattedResult);
	} catch (e: any)
	{
		db && db.close();
		spinner.fail(e.message || '或许是网络错误...');
	}
}