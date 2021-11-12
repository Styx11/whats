import { sha256 } from 'js-sha256'
import { URLSearchParams } from 'url'

export const getSource = (word: string, from: string, to: string) => {
	const len = word.length;
	const q = word;
	const input = len <= 20 ? word : (q.slice(0, 10) + len + q.slice(len - 10));
	const signType = 'v3';
	const appKey = '011d6e12f75e5792';
	const base = 'https://openapi.youdao.com/api';
	const key = 'ro6v75hegl4iI45wqfWfGoY1KyT6yHiq';
	const salt = '735fa0aa-59c8-4f04-997e-8bca4fa649e3';// UUID
	const curtime = Math.round(new Date().getTime() / 1000).toString();// Unix 时间戳
	const str = appKey + input + salt + curtime + key;

	const sign = sha256(str);

	to = to || 'auto';
	from = from || 'auto';
	const params = new URLSearchParams({
		q,
		to,
		from,
		appKey,
		curtime,
		salt,
		sign,
		signType
	}).toString();
	const source = `${base}?${params}`;

	return source;
}