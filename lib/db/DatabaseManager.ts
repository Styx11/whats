import _sqlite, { Database } from "sqlite3";
import path from 'path';
import os from 'os';
import fs from 'fs';
import ConfigStoreManager, { ConfigItem } from "../ConfigManager";

const CREATE_SQL = `CREATE TABLE Whats (
	Word TEXT NOT NULL,
	Source TEXT NOT NULL,
	Target TEXT NOT NULL,
	Result TEXT,
	Time DATE NOT NULL UNIQUE,
	Host TEXT NOT NULL,
	Primary key (word, time)
);`;

const INSERT_SQL = `
	INSERT
	INTO Whats
	VALUES ($word, $source, $target, $result, $time, $host);
`;

const SEARCH_SQL = `
	SELECT Word, Count(*) Count, Result, Source, Target, Max(Time) Time
	FROM Whats
	GROUP BY Word, Source, Target, Result
	ORDER BY Time DESC;
`;

// 插入「表」的数据结构
export interface InsertStruct
{
	// 查找的单词
	$word: string;
	// 源语言
	$source: string;
	// 目标语言
	$target: string;
	// 结果
	$result: string;
	// 搜索时间
	$time: string;
	// 搜索 api
	$host: string;
}

// 搜索数据结构
export interface SearchStruct
{
	Word: string;
	Count: number;
	Result: string;
	Source: string;
	Target: string;
	Time: string;
}

export default class DatabaseManager
{
	// sqlite 数据库实例
	private _db: Database;

	// 数据库文件存放位置
	private _dbPath: string;

	private static _instance: DatabaseManager;

	static getInstance()
	{
		if (!this._instance)
		{
			this._instance = new DatabaseManager();
		}
		return this._instance;
	}

	constructor()
	{
		const dbName = '.whats.sqlite';
		const dbPath = path.join(os.homedir(), dbName);
		const sqlite = _sqlite.verbose();

		this._dbPath = dbPath;
		this._db = sqlite.cached.Database(dbPath);
	}

	public getDBInstance = () =>
	{
		return this._db;
	}

	// 判断「表」是否已被 created，
	public tableCreated = (): Promise<boolean> =>
	{
		return new Promise<boolean>((res, rej) =>
		{
			fs.readFile(this._dbPath, (err, buf) =>
			{
				if (err)
				{
					return rej(err);
				}
				res(buf.length > 0);
			});
		});
	};

	// 直接删除 db 文件，因为我们 create 表之前，需要知道「表」是否已存在
	public dropDB = (): Promise<void> =>
	{
		return new Promise((res, rej) =>
		{
			fs.writeFile(this._dbPath, '', err =>
			{
				if (err)
				{
					return rej(err);
				}
				res();
			});
		});
	};

	// 建「表」
	public createDB = async (): Promise<string> =>
	{
		const created = ConfigStoreManager.getInstance().getConfig(ConfigItem.DB_CREATED)

		if (created) return ''

		return new Promise((res, rej) =>
		{
			this._db.run(CREATE_SQL, (err: Error | null) =>
			{
				if (err)
				{
					return rej(err);
				}
				return res('');
			})
		});
	};

	// 插入「表」
	public insertDB = (tuple: InsertStruct): Promise<void> =>
	{
		return new Promise<void>((res, rej) =>
		{
			this._db.run(INSERT_SQL, tuple, (err: Error | null) =>
			{
				if (err)
				{
					return rej(err);
				}
				return res();
			});
		});
	};

	// search db based on word
	public searchDB = (): Promise<SearchStruct[]> =>
	{
		return new Promise<SearchStruct[]>((res, rej) =>
		{
			this._db.all(SEARCH_SQL, (err: Error | null, tuples: SearchStruct[]) =>
			{
				if (err)
				{
					return rej(err);
				}
				return res(tuples);
			});
		});
	};
}