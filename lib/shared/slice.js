// slice module is used to slice the orig and trans result
// make it more formatted in terminal

const isChinese = require('is-chinese');

// 7 is a fuzzy number of available cols,
// which contains the beginning and the end, 
// and provides additional cols for slicing minority language
const cols = getColumns(); 

// check is stdout.columns a valid value
function getColumns() {
  if (!process.stdout.isTTY || isNaN(process.stdout.columns)) {
    return 100;
  }

  return process.stdout.columns - 7;
}

// this func slice a string which has no space and Chinese
// but it's probably not gonna happend in nature language
const sliceStrWithoutSpace = (str, sliced) => {
  const len = str.length;

  if (len <= cols) return sliced.push(str);

  const mainStr = str.slice(0, cols);
  const subStr = str.slice(cols + 1);
  sliced.push(mainStr);

  return sliceStrWithoutSpace(subStr, sliced);
}

// slice the orig str which out of cols in terminal
const sliceOrigStr = (str, sliced) => {// sliced is an empty array
  let lastSpaceOfCol;
  const len = str.length;
  const byteLength = Buffer.byteLength(str);

  // check whether minority language
  if (len !== byteLength) return sliceTransStr(str, sliced);
  if (len <= cols) return sliced.push(str);

  // return index of space before out of col
  lastSpaceOfCol = str.lastIndexOf(' ', cols);
  if (lastSpaceOfCol === -1) return sliceStrWithoutSpace(str, sliced);

  const mainStr = str.slice(0, lastSpaceOfCol);
  const subStr = str.slice(lastSpaceOfCol + 1);
  sliced.push(mainStr);

  // orig may be a very long string
  // so we call it recursively
  // tail call
  return sliceOrigStr(subStr, sliced);
};

// find out whether trans str which include Chinese longer than cols, correctly
// then returns the roughly slice position of it
const slicePotOfTrans = str => {
  let len = 0;
  let slicePot = 0;
  for (let s of str) {
    if (isChinese(s) || (Buffer.byteLength(s) !== s.length)) {
      len += 2;
    } else {
      len += 1;
    }

    // we just need to know it's longer
    // so the exact slice point doesn't matter
    if (len >= cols) {
      slicePot = len / 2;
      break;
    }
  }
  return slicePot;
};

// slice the trans result which may includes Chinese
const sliceTransStr = (str, sliced) => {
  const slicePot = slicePotOfTrans(str);

  if (!slicePot) return sliced.push(str);

  const mainStr = str.slice(0, slicePot);
  const subStr = str.slice(slicePot);
  sliced.push(mainStr);

  return sliceTransStr(subStr, sliced);
};

module.exports = {
  sliceOrigStr,
  sliceTransStr,
  sliceStrWithoutSpace,
};
