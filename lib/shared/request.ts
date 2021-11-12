import { config } from '../util/config'

export const request = async (source: string) => {
	const http = config.useIciba
		? await import('http')
		: await import('https');

	// 请求结果Promise
	const rt = new Promise<string>((resolve, reject) => {
		let result: string;
		const pattern = /undefined/;
		const req = http.get(source, res => {
			const { statusCode } = res;
			if (statusCode !== 200) {
				res.resume();
				reject('请求错误');
			}
			res.setEncoding('utf8');
			res.on('data', (data: string) => {
				result += data;
			});
			res.on('end', () => {
				result = result.split(pattern).join('');
				resolve(result);
			});
		});
		req.on('error', e => {
			if (e) {
				reject('或许是网络错误...')
			}
		});
		req.on('timeout', () => {
			req.abort();
			reject('请求超时');
		});
	});

	return rt;
};