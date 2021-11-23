
export enum ConfigItem
{
	// 查询目标是否为中文
	IS_CHINESE = 'IS_CHINESE',
	// 是否使用 iciba api 查询（爱词霸使用 http 协议）
	USE_ICIBA = 'USE_ICIBA',
	// 是否使用 say
	USE_SAY = 'USE_SAY',
	// chalk 函数（是否使用了 normalize 命令）
	CHALK = 'CHALK',
	// 查询记录限制条数
	RECORD_LIMIT = 'RECORD_LIMIT',
	// 当前终端可用的行数（用于防止 iciba 例句输出时已出终端窗口）
	AVAIL_ROWS = 'AVAIL_ROWS',
}

export interface Config
{
	[ConfigItem.IS_CHINESE]: boolean;
	[ConfigItem.USE_ICIBA]: boolean;
	[ConfigItem.USE_SAY]: boolean;
	[ConfigItem.CHALK]: ((str: string) => string) | ((str: string, color: string) => string);
	[ConfigItem.RECORD_LIMIT]: number;
	[ConfigItem.AVAIL_ROWS]: number;
}

// 配置 store
class ConfigStoreManager
{
	private store: Config = {
		[ConfigItem.IS_CHINESE]: false,
		[ConfigItem.USE_ICIBA]: false,
		[ConfigItem.USE_SAY]: false,
		[ConfigItem.CHALK]: (str: string) => str,
		[ConfigItem.RECORD_LIMIT]: 6,
		[ConfigItem.AVAIL_ROWS]: process.stdout.rows - 3,
	}

	private static _instance: ConfigStoreManager

	static getInstance()
	{
		if (!this._instance)
		{
			this._instance = new ConfigStoreManager();
		}
		return this._instance;
	}

	public getConfig<T extends ConfigItem>(item: T): Config[T]
	{
		return this.store[item];
	}

	public setConfig<T extends ConfigItem>(item: T, value: Config[T])
	{
		this.store[item] = value;
	}
}

export default ConfigStoreManager