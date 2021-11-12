import { URLSearchParams } from 'url';
const key = '7558F47B1AC36021E67286D3FEBEFEEF';
const base = 'http://dict-co.iciba.com/api/dictionary.php';

export const getDefaultSource = (word: string) => {
	const w = word;

	const query = new URLSearchParams({
		w,
		key
	}).toString();

	const source = `${base}?${query}`;

	return source;
};

// this module is used to get Chinese translation example
export const getChineseSource = (word: string) => {
	const w = word;
	const type = 'json';

	const query = new URLSearchParams({
		w,
		key,
		type
	}).toString();

	const source = `${base}?${query}`;

	return source;
};
