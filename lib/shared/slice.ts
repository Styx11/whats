// slice module is used to slice the orig and trans result
// make it more formatted in terminal

import isChinese from 'is-chinese'

// 7 is a fuzzy number of available cols,
// which contains the beginning and the end,
// and provides additional cols for slicing minority language
const cols = getColumns();

// check is stdout.columns a valid value
function getColumns()
{
	if (!process.stdout.isTTY || isNaN(process.stdout.columns))
	{
		return 100;
	}

	return process.stdout.columns - 7;
}

// this func slice a string which has no space or Chinese
// but it's probably not gonna happend in nature language
const sliceStrWithoutSpace = (str: string, sliced: string[] = []): string[] =>
{
	const len = str.length;

	if (len <= cols) return [...sliced, str];

	const mainStr = str.slice(0, cols);
	const subStr = str.slice(cols + 1);

	return sliceStrWithoutSpace(subStr, [...sliced, mainStr]);
}

// 切分包含空格的英文句子
export const sliceOrigStr = (str: string, sliced: string[] = []): string[] =>
{
	const len = str.length;
	const byteLength = Buffer.byteLength(str);

	// 检查是否是小语种
	if (len !== byteLength) return sliceTransStr(str, sliced);
	if (len <= cols) return [...sliced, str];

	// 以 col 为分界，找到最后一个空格
	const lastSpaceOfCol = str.lastIndexOf(' ', cols);
	if (lastSpaceOfCol === -1) return sliceStrWithoutSpace(str, sliced);

	const mainStr = str.slice(0, lastSpaceOfCol);
	const subStr = str.slice(lastSpaceOfCol + 1);

	// 尾递归
	return sliceOrigStr(subStr, [...sliced, mainStr]);
};

// 返回中文句子的大致切分位置
const findSlicePosOfTrans = (str: string) =>
{
	let len = 0;
	let slicePot = 0;
	for (let s of str)
	{
		if (isChinese(s) || (Buffer.byteLength(s) !== s.length))
		{
			len += 2;
		}
		else
		{
			len += 1;
		}

		// we just need to know it's longer
		// so the exact slice point doesn't matter
		if (len >= cols)
		{
			slicePot = len / 2;
			break;
		}
	}
	return slicePot;
};

// 切分包含中文的句子
export const sliceTransStr = (str: string, sliced: string[] = []): string[] =>
{
	const slicePot = findSlicePosOfTrans(str);

	if (!slicePot) return [...sliced, str];

	const mainStr = str.slice(0, slicePot);
	const subStr = str.slice(slicePot);

	return sliceTransStr(subStr, [...sliced, mainStr]);
};
