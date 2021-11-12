import { URLSearchParams } from 'url';
import md5 from 'blueimp-md5';

// this module is used to get baidu translation resource
// including sentence translation and the dictionary resource
export const getBaiduSource = (query: string, isChinese: boolean) => {
	const q = query.toLocaleLowerCase();
	const appid = '20191014000341469';
	const key = '4GEOkedoeuLlSiwypAoD';
	const baidu = 'http://api.fanyi.baidu.com/api/trans/vip/translate';
	const from = 'auto';
	const to = isChinese ? 'en' : 'zh';// to can't be auto
	const salt = '735fa0aa-59c8-4f04-997e-8bca4fa649e3';// UUID
	const str = appid + q + salt + key;
	const dict = '0';

	const sign = md5(str);

	const search = new URLSearchParams({
		q,
		from,
		to,
		appid,
		salt,
		sign,
		dict
	}).toString();

	const source = `${baidu}?${search}`;

	return source;
}