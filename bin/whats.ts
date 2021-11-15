#!/usr/bin/env node
import chalk from 'chalk'
import commander from 'commander';
import logSymbols from 'log-symbols';
import _sqlite, { Database } from 'sqlite3'

import whats from '../index'
import searchRecord from '../lib/db';
import ConfigStoreManager, { ConfigItem } from '../lib/ConfigManager';
import { checkVers } from '../lib/util/checkVers';
import dropCLI from '../lib/db/dropCLI';
import pkg from '../package.json';
import DatabaseManager from '../lib/db/DatabaseManager';


(() =>
{
	const program = new commander.Command();
	const version = pkg.version;

	program.version(version, '-v, --vers', 'output the current version');

	program
		.name('whats')
		.usage('<query> [options]')
		.option('-n, --normal', 'normalize text color of your terminal')
		.option('-f, --from <source>', 'the source language to translate')
		.option('-t, --to <target>', 'the target language')
		.option('-s, --say', 'use default system voice and speak')
		.option('-r, --record [limit: number | clear]', 'show the query record');

	program.on('--help', () =>
	{
		console.log('');
		console.log('Examples:');
		console.log('  $ whats love');
		console.log('  $ whats bonjour -f fr');
		console.log('  $ whats こんにちは -f ja -t en');
		console.log('  $ whats I love you very much');
		console.log('  $ whats -r clear');
		console.log('  $ whats -r 10');
		console.log('');
	});

	if (!process.argv.slice(2).length)
	{
		console.log('');
		return program.help();
	}
	if (!checkVers())
	{
		return console.log(logSymbols.warning + ' 您的 Node.js 版本过低');
	}

	program.parse(process.argv);
	const options = program.opts()

	// normalize 配置 chalk 输出
	const chalkFnc = options.normal
		? (str: string) => str
		: (str: string, color: string) => (chalk as any)[color](str) as string;

	ConfigStoreManager.getInstance().setConfig(ConfigItem.CHALK, chalkFnc);
	ConfigStoreManager.getInstance().setConfig(ConfigItem.USE_SAY, !!options.say);

	// 搜索记录相关
	let limit: number;
	const rawRecord = options.record;
	const invaild = logSymbols.error + ' ' + `无效参数 (${rawRecord})，使用 -h 查看帮助`;
	if (rawRecord && typeof rawRecord === 'string')
	{
		if (rawRecord === 'clear')
		{
			return dropCLI();
		}
		if (!(limit = Number(rawRecord)))
		{
			return console.log(invaild);
		}
		// 设置查询条数限制
		ConfigStoreManager.getInstance().setConfig(ConfigItem.RECORD_LIMIT, limit);
	}

	// 获取数据库实例
	const db: Database = DatabaseManager.getInstance().getDBInstance()

	db.on('open', () =>
	{
		DatabaseManager.getInstance().tableCreated()
			.then((created: boolean) =>
			{
				ConfigStoreManager.getInstance().setConfig(ConfigItem.DB_CREATED, created)

				options.record
					? searchRecord()
					: whats(options.from, options.to);
			})
			.catch((e: Error) =>
			{
				console.log(logSymbols.error + ' ' + e.message);
				console.log(logSymbols.error + ' ' + '数据库文件丢失');
				db.close();
			});
	})

	db.on('error', (e: Error) =>
	{
		console.log(logSymbols.error + ' ' + e);
		db.close();
	})

})()