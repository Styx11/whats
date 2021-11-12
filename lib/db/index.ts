import logAsTable from './logAsTable';
import ora from 'ora';
import { wordBasedSearch } from './handlers';
import { config } from '../util/config';

export default async () => {
	const { db, created } = config.dbOpts;
	const spinner = ora('请稍后...').start();

	try {

		if (!created) return spinner.warn('暂无查询结果');

		console.time('Time');

		const tuples = await wordBasedSearch(db);
		spinner.succeed('查询成功！');
		logAsTable(tuples);

		console.log('');
		console.timeEnd('Time');
		db.close();

	} catch (e) {
		spinner.fail('出错了！');
		db && db.close();
	}

};