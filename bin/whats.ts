#!/usr/bin/env node
import chalk from 'chalk'
import os from 'os'
import path from 'path'
const commander = require('commander')
import logSymbols from 'log-symbols';
import _sqlite, { Database } from 'sqlite3'

import whats from '../index'
import record from '../lib/db';
import { config } from '../lib/ConfigManager';
import ConfigStoreManager, { ConfigItem } from '../lib/ConfigManager';
import { checkVers } from '../lib/util/checkVers';
import { dropDB, tableCreated } from '../lib/db/handlers';
import dropCLI from '../lib/db/dropCLI';
import pkg from '../package.json';


(() =>
{
	const dbName = '.whats.sqlite';
	const dbPath = path.join(os.homedir(), dbName);
	const sqlite = _sqlite.verbose()
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

	ConfigStoreManager.getInstance().setConfig<ConfigItem.USE_SAY>(ConfigItem.USE_SAY, !!program.say);

	// use global chalk instead of config.normalize
	// because we not need getChalk() every time
	const chalkFnc = program.normal
		? (str: string) => str
		: (str: string, color: string) => (chalk as any)[color](str) as string;

	ConfigStoreManager.getInstance().setConfig<ConfigItem.CHALK>(ConfigItem.CHALK, chalkFnc);

	// deal with record commander
	let limit;
	const rawRecord = program.record;
	const invaild = logSymbols.error + ' ' + `无效参数 (${rawRecord})，使用 -h 查看帮助`;
	if (rawRecord && typeof rawRecord === 'string')
	{
		if (rawRecord === 'clear')
		{
			// use dropDB as closure to avoid path issue
			return dropCLI(() => dropDB(dbPath));
		}
		if (!(limit = Number(rawRecord)))
		{
			return console.log(invaild);
		}
		ConfigStoreManager.getInstance().setConfig<ConfigItem.RECORD_LIMIT>(ConfigItem.RECORD_LIMIT, limit);
	}

	// For now, it's easily to fail to find the database file by spreading the database creation,
	// so we'll have to create it in the first place
	const db: Database = sqlite.cached.Database(dbPath);

	db.on('open', () =>
	{
		tableCreated(dbPath)
			.then((created: boolean) =>
			{
				const dbOpts = { db, created };
				config.dbOpts = dbOpts;
				program.record
					? record()
					: whats(program.from, program.to);
			})
			.catch((e: Error) =>
			{
				console.log(logSymbols.error + ' ' + e.message);
				db.close();
			});
	})

	db.on('error', (e: Error) =>
	{
		console.log(logSymbols.error + ' ' + e);
		db.close();
	})

})()