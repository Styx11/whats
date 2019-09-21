#!/usr/bin/env node
const ora = require('ora');
const iciba = require('./lib/iciba');
const commander = require('commander');
const program = new commander.Command();
const { checkVers } = require('./lib/util/checkVers');
const { checkLang } = require('./lib/util/checkLang');

const pkg = require('./package.json');
const version = pkg.version;
const spinner = ora();

program.version(version);

program
  .name('whats')
  .usage('<word> [options]')
  .option('-f, --from <source>', 'the source language to translate')
  .option('-t, --to <target>', 'the target language');

program.on('--help', () => {
  console.log('')
  console.log('Examples:');
  console.log('  $ whats love');
  console.log('  $ whats 爱');
  console.log('  $ whats l’amour --from fr --to zh-CHS');
  console.log('');
})

if (!process.argv.slice(2).length) {
  console.log('');
  return program.help();
}

program.parse(process.argv);

if (!checkVers()) {
  return spinner.warn('您的 Node.js 版本过低');
}

try {
  let to = program.to;
  let from = program.from;
  const word = process.argv[2].toLocaleLowerCase();
  const useIciba = checkLang(word, from, to);
  if (useIciba) {
    iciba(word);
  }
} catch (e) {
  spinner.fail(e.message || '出现了一个错误...');
}