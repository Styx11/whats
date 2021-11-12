import say from 'say';
import iciba from './src/iciba';
import youdao from './src/youdao';
import logSymbols from 'log-symbols';
import { config } from './lib/util/config';
import { checkLang } from './lib/util/checkLang';
import { formatQuery } from './lib/util/formatQuery';

export default async (from: string, to: string) => {
	let useIciba;

	try {
		const {
			query,
			isSent,
			isChinese,
		} = formatQuery();
		config.isChinese = isChinese;

		useIciba = checkLang(from, to) && !isSent;
		config.useIciba = useIciba;
		if (useIciba) {
			await iciba(query);
		} else {
			await youdao(query, from, to);
		}
		if (config.say) say.speak(query);

	} catch (e: any) {
		const msg = e.message || '出现了一个错误...';
		console.error(logSymbols.error + ' ' + msg);
	}
};