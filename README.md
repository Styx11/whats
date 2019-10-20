<div align="center">

# whats 🔍
一个作者本人也经常用的命令行翻译工具🤓

***Inspired by [afc163/fanyi](https://github.com/afc163/fanyi), but more***

![](https://img.shields.io/node/v/what-is-x)
![](https://img.shields.io/npm/v/what-is-x?color=blue)
![](https://img.shields.io/npm/dm/what-is-x)
![](https://img.shields.io/librariesio/github/styx11/whats)
![](https://img.shields.io/github/license/styx11/whats)

![](https://s2.ax1x.com/2019/09/29/uGmJ10.png)

</div>

## ⭐️Features

* 中英日文基本词语互译
* 小语种中文翻译
* 支持语言范围内的长句翻译
* 文本关键字高亮
* 终端自适应的输出

## 💾Install

```
npm install -g what-is-x
```

## 💡Usage

```
Usage: whats <query> [options]

Options:
  -v, --vers    output the current version
  -h, --help    output usage information
  -f, --from <source>  the source language to translate
  -t, --to <target>    the target language
  -n, --normal  normalize text color in your terminal

Examples:
  $ whats love
  $ whats 爱
  $ whats bonjour -f fr
  $ whats こんにちは -f ja -t en
  $ whats I love you very much
  $ whats only you can control your future -f en -t ja
```

![](https://s2.ax1x.com/2019/10/20/KMGzuQ.png)

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

2. 测试版本目前支持基本词语的互译、小语种中文翻译、长句子翻译

3. 输出结果的文本颜色可能会因你的终端主题而有较大差异，
  想要消除颜色带来的影响（**无颜色**输出）可以使用 `-n` 或 `--normal` 命令。
  例如：
  ```
  $ whats up --normal
  ```

4. 除**中英文**互译外所有语言的翻译**必须**使用 `-f` 或 `--from` 标识源语言
5. 在支持语言范围内，若无 `-t` 或 `--to` 命令标识，目标语言默认为**中文**

## 📄License
MIT.