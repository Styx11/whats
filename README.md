<div align="center">

# whats 🔍
一个作者本人也经常用的命令行翻译工具🤓

***Inspired by [afc163/fanyi](https://github.com/afc163/fanyi), but more***

![](https://img.shields.io/node/v/what-is-x)
![](https://img.shields.io/npm/v/what-is-x?color=blue)
![](https://img.shields.io/librariesio/github/styx11/whats)
![](https://img.shields.io/github/license/styx11/whats)

![](https://s2.ax1x.com/2019/12/24/lPYdyD.png)

</div>

## ⭐️Features

* 中英日文基本词语互译
* 小语种中文翻译
* 支持语言范围内的长句翻译
* 文本关键字高亮
* 中英文语音播放
* 终端**自适应**的输出
* 支持查询记录

![](https://s2.ax1x.com/2019/11/09/MnFMh4.png)

## 💾Install

```
npm install -g what-is-x
```
🚨[注意](#关于-v046-及以上版本说明)

## 💡Usage

```
Usage: whats <query> [options]

Options:
  -v, --vers                      output the current version
  -h, --help                      output usage information
  -f, --from        <source>      the source language to translate
  -t, --to          <target>      the target language
  -n, --normal                    normalize text color in your terminal
  -s, --say                       use default system voice and speak
  -r, --record   [limit | clear]  show the query record (limit records ouputs default: 6 or clear records)

Examples:
  $ whats love
  $ whats bonjour -f fr
  $ whats こんにちは -f ja -t en
  $ whats I love you very much
  $ whats -r clear // 清除查询记录
  $ whats -r 10    // 限制查询结果数量
```


### 🇨🇳支持语言

语言|目标语言|
---|:--:|
中文|英文、日文、韩文、法文、西班牙文、葡萄牙文、俄文、越南文、德文、阿拉伯文、印尼文、意大利文
英文|中文、日文
日文|中文、英文
韩文|中文
法文|中文
西班牙文|中文
葡萄牙文|中文
意大利文|中文
俄文|中文
越南文|中文
德文|中文
阿拉伯文|中文
印尼文|中文
意大利文|中文

### 🇺🇳各语言对应代码

语言|代码|
---|:--:|
中文|zh-CHS
英文|en
日文|ja
韩文|ko
法文|fr
西班牙文|es
葡萄牙文|pt
意大利文|it
俄文|ru
越南文|vi
德文|de
阿拉伯文|ar
印尼文|id

## 💬Notes

1. 你的 Node 版本需 ≥ 7.6.0

2. 单次最大查询**字符数**为 200

3. 本翻译工具拥有终端自适应的输出，即超过终端宽度的输出会被切分并排版，

    例句的输出不会溢出终端窗口。一般情况下想要看到**全部的例句**建议的终端窗口大小最少为 `73 * 25`

3. 测试版本目前支持基本词语的互译、小语种中文翻译、长句子翻译（中文字符数 > 4 将被视为句子）

4. 输出结果的文本颜色可能会因你的终端主题而有较大差异，
  想要消除颜色带来的影响（**无颜色**输出）可以使用 `-n` 或 `--normal` 命令。
  例如：
    ```
    $ whats up --normal
    ```

5. 除**中英文**互译外所有语言的翻译**必须**使用 `-f` 或 `--from` 标识源语言
6. 在支持语言范围内，若无 `-t` 或 `--to` 命令标识，目标语言默认为**中文**
7. 使用语音播放 `-s` 或 `--say` 时，可能会存在系统层次的问题，具体参考👉[say.js](https://github.com/Marak/say.js#feature-matrix)

### 🚨关于 v0.4.6 及以上版本说明
由于 MacOS 自 10.11 系统开始使用了 Rootless 机制，系统默认将会锁定 /system、/bin、/usr 这三个目录，
因此全局环境下无法获取数据库读写权限，需要在终端输入如下命令：
```
sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}
```

## 📄License
MIT.