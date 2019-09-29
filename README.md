<div align="center">

# whats 🔍
一个作者本人也经常用的命令行翻译工具🤓

![](https://img.shields.io/node/v/what-is-x)
![](https://img.shields.io/npm/v/what-is-x?color=blue)
![](https://img.shields.io/npm/dt/what-is-x)
![](https://img.shields.io/librariesio/github/styx11/whats)
![](https://img.shields.io/github/license/styx11/whats)

![](https://s2.ax1x.com/2019/09/29/uGmJ10.png)

</div>

## Install

```
npm install -g what-is-x
```

## Usage

```
Usage: whats <word> [options]

Options:
  -v, --vers    output the current version
  -n, --normal  normalize text color in your terminal
  -h, --help    output usage information

Examples:
  $ whats love
  $ whats 爱
```

## Note

1. 你的 Node 版本需大于等于 7.6.0

2. 测试版本目前只支持中英文基本词语的互译

3. 输出结果的文本颜色可能会因你的终端主题而有较大差异，
  想要消除颜色带来的影响可以使用 `-n` 或 `--normal` 命令。
  例如：
  ```
  $ whats up --normal
  ```
  你将得到无颜色输出

## License
MIT.