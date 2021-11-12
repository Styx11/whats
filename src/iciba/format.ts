import { Parser } from 'xml2js';

export const format = async (rtDefault: any, rtChinese: any) => {
	const parser = new Parser();
	const { dict } = await parser.parseStringPromise(rtDefault);
	const {
		key,
		pos,
		sent,
		acceptation
	} = dict;
	let { ps } = dict;

	let parts, psChinese;
	if (rtChinese) {
		rtChinese = JSON.parse(rtChinese).symbols[0];
		parts = rtChinese.parts
		psChinese = rtChinese.word_symbol;
		ps = psChinese ? [psChinese] : '';
	}

	// 消除多余换行
	const spliter = (str: string) => {
		const pattern = /\r\n/g;
		return str.replace(pattern, '');
	};

	// 词义
	let explains;
	if (rtChinese) {
		explains = parts && parts[0].means.map((c: any) => {
			return `${c.word_mean}`;
		});
	} else {
		explains = pos && pos[0] && [... new Array(pos.length).keys()]
			.map((_, i) => {
				const acpt = spliter(acceptation[i]);
				return `${pos[i]} ${acpt}`;
			});
	}

	// 例句
	let sents = sent && sent.map(({ orig, trans }: { orig: string[], trans: string[] }) => {
		return {
			orig: `${spliter(orig[0])}`,
			trans: `${spliter(trans[0])}`
		};
	});

	return {
		ps,
		key,
		sents,
		explains
	};
};