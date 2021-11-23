import { request } from '../../lib/shared/request';
import ConfigStoreManager, { ConfigItem } from '../../lib/ConfigManager';
import getTime from '../../lib/util/getTime';
import ora from 'ora';

// formatter
import { format as icibaFormat } from './format';
import { defaultFormat, chineseFormat } from '../baidu/format';

// printer and source
import { defaultPrint, chinesePrint } from './print';
import { getDefaultSource, getChineseSource } from './source';
import { getBaiduSource } from '../baidu/source';

import DatabaseManager from '../../lib/db/DatabaseManager';

export default async (query: string) =>
{
	const isChinese = ConfigStoreManager.getInstance().getConfig(ConfigItem.IS_CHINESE);
	const spinner = ora('搜索中...').start();
	const defaultSource = getDefaultSource(query);
	const chineseSource = getChineseSource(query);
	const baiduSource = getBaiduSource(query, isChinese);

	const baiduFormat = isChinese
		? chineseFormat
		: defaultFormat;

	const print = isChinese
		? chinesePrint
		: defaultPrint;

	// iciba's default api doesn't have the translation for chinese to english
	// so we make another requset 'reqChinese' to get it.
	try
	{
		const reqDefault = request(defaultSource);
		const reqBaidu = request(baiduSource);
		const reqChinese = isChinese
			? request(chineseSource)
			: Promise.resolve('');

		const promises = [
			reqDefault,
			reqChinese,
			reqBaidu,
			DatabaseManager.getInstance().createDB(),
		];
		const getResult = Promise.all(promises);
		const [rtDefault, rtChinese, rtBaidu] = await getResult;
		const icibaData = await icibaFormat(rtDefault, rtChinese);
		const baiduData = baiduFormat(rtBaidu);

		let semi;
		const k = icibaData.key;
		const e = icibaData.explains;
		await DatabaseManager.getInstance().insertDB({
			$word: (k && k[0]),
			$source: (isChinese ? '中' : '英'),
			$target: (isChinese ? '英' : '中'),
			$result: (e ? ((semi = e[0].indexOf('；')) > -1 ? e[0].slice(0, semi) : e[0]) : '无查询结果'),
			$time: getTime(),
			$host: 'iciba'
		});

		DatabaseManager.getInstance().closeDB();
		spinner.stop();
		print(icibaData, baiduData);

	}
	catch (e: any)
	{
		const msg = e.message || '或许是网络错误...';
		spinner.fail(msg);
		DatabaseManager.getInstance().closeDB();
	}
};