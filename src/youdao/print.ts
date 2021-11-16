import log from '../../lib/shared/log'
import ConfigStoreManager, { ConfigItem } from '../../lib/ConfigManager'
import { sliceOrigStr, sliceTransStr } from '../../lib/shared/slice';

export const print = (data: any) =>
{
	const chalk = ConfigStoreManager.getInstance().getConfig(ConfigItem.CHALK);
	let {
		to,
		from,
		orig,
		trans
	} = data;

	log('');

	// 首行主机名
	const hostname = chalk('~ youdao.com ~', 'dim');
	log(hostname);

	log('');

	// 原文
	let firstLine = true;
	const slicedOrig: string[] = sliceOrigStr(orig);

	from = chalk(from, 'red');
	slicedOrig.forEach(o =>
	{
		o = chalk(o, 'cyan');
		firstLine
			? log(`${from}  ${o}`)
			: log(`    ${o}`);// four spaces
		firstLine = false;
	});

	log('');

	// 翻译结果
	firstLine = true;
	const slicedTrans: string[] = sliceTransStr(trans);

	to = chalk(to, 'red');
	slicedTrans.forEach(t =>
	{
		t = chalk(t, 'cyan');
		firstLine
			? log(`${to}  ${t}`)
			: log(`    ${t}`);
		firstLine = false;
	});

	log('');

	log(hostname);

	log('');

};