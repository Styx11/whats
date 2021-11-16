// the print module of baidu now only print part of the trans result
import log from '../../lib/shared/log';
import ConfigStoreManager, { ConfigItem } from '../../lib/ConfigManager';
import { sliceOrigStr } from '../../lib/shared/slice';

// default printer of en to zh
// tense1: mean1; mean2
// tense2: mean1l mean2...
export const defaultPrint = (data: any) =>
{
	const { exchanges } = data;
	const chalk = ConfigStoreManager.getInstance().getConfig(ConfigItem.CHALK);
	const excExist = exchanges && exchanges.some((e: { exchange: string | any[]; }) => e.exchange.length > 0);

	const exc1 = exchanges.slice(0, 3);
	const exc2 = exchanges.slice(3);

	// filter makes sure that empty exchange [] won't be print
	const row1 = exc1.map((e: { exchange: any[]; tense: any; }) =>
	{
		if (e.exchange.length === 0) return;
		const exchange = e.exchange.join(', ');
		return `${e.tense}: ${chalk(exchange, 'cyan')}`;
	}).filter((r: any) => !!r);

	const row2 = exc2.map((e: { exchange: any[]; tense: any; }) =>
	{
		if (e.exchange.length === 0) return;
		const exchange = e.exchange.join(', ');
		return `${e.tense}: ${chalk(exchange, 'cyan')}`;
	}).filter((r: any) => !!r);

	// e.g:
	// 第三人称单数: loves;  复数: loves;  现在分词: loving
	// 过去式: loved;  过去分词: loved
	excExist > 0 && log('');
	row1.length > 0 && log(chalk('-', 'dim') + ' ' + row1.join(';  '));
	row2.length > 0 && log(chalk('-', 'dim') + ' ' + row2.join(';  '));
};

// print word means in different symbols
export const chinesePrint = (data: any) =>
{
	const {
		src,
		symbols,
		word_means
	} = data;
	const chalk = ConfigStoreManager.getInstance().getConfig(ConfigItem.CHALK);

	const hostWords = chalk('~  fanyi.baidu.com', 'dim');
	const logParts = (parts: any) =>
	{
		// 动  mean1; mean2; mean3...
		// 名  mean1; mean2...
		log('');
		parts.forEach((part: any) =>
		{
			const pn = part.part_name;
			const n = pn ? chalk(pn, 'dim') + '  ' : '';
			const m = part.means.join('; ').trim();
			const sliced: string[] = sliceOrigStr(m);

			// means maybe too long
			const offset = !!n ? '    ' : '';
			sliced.forEach((s, i) =>
			{
				i === 0
					? log(n + chalk(s, 'greenBright'))
					: log(offset + chalk(s, 'greenBright'));
			});

		});
	};

	src && log('');

	// 爱  [ ài ]  ~  fanyi.baidu.com
	// - love
	// - like
	// - be fond of
	// 时态不存在
	if (!symbols[0].parts[0].part_name || (symbols.length === 0 && word_means.length !== 0))
	{
		log(src + '  ' + hostWords);

		log('');
		word_means.forEach((w: string) =>
		{
			const mean = chalk('-', 'dim') + ' ' + chalk(w, 'greenBright');
			log(mean);
		});
		return;
	}

	// 干  [ gān ]  ~  fanyi.baidu.com
	//   名  shield; short for the ten Heavenly Stems; the edge of waters
	//   形  dry; waterless; empty; hollow
	// 干  [ gàn ]
	//   名  trunk; main part; short for cadre
	//   动  do; work; attend to; hold the post of
	let firstLine = true;
	symbols && symbols.forEach((symbol: any) =>
	{
		const sw = symbol.word_symbol;
		const s = sw ? '  ' + chalk(`[ ${sw} ]`, 'redBright') : '';
		const words = src + s + (firstLine ? ('  ' + hostWords) : '');

		firstLine || log('');
		log(words);
		logParts(symbol.parts);
		firstLine = false;
	});
};

// reservedPrint is used, when translating uncommon words but we just have
// the basic src --> dst resource
export const reservedPrint = (data: any) =>
{
	const {
		src,
		dst
	} = data;
	const chalk = ConfigStoreManager.getInstance().getConfig(ConfigItem.CHALK);
	const hostWords = chalk('~  fanyi.baidu.com', 'dim');

	// dst is the last resource
	if (dst === '')
	{
		throw new Error('未找到查询结果');
	}

	// 天干物燥  ~  fanyi.baidu.com
	// Heavenly stems and dryness
	log('');
	log(src + '  ' + hostWords);

	log('');
	log(chalk('-', 'dim') + ' ' + chalk(dst, 'greenBright'));
};
