#!/usr/bin/env node
const ora = require('ora');
const whats = require('../index');
const record = require('../lib/db');
const commander = require('commander');
const { checkVers } = require('../lib/util/checkVers');

let spinner;
const program = new commander.Command();
const { config } = require('../lib/util/config');
const pkg = require('../package.json');
const version = pkg.version;

program.version(version, '-v, --vers', 'output the current version');

program
  .name('whats')
  .usage('<query> [options]')
  .option('-n, --normal', 'normalize text color of your terminal')
  .option('-f, --from <source>', 'the source language to translate')
  .option('-t, --to <target>', 'the target language')
  .option('-s, --say', 'use default system voice and speak')
  .option('-r, --record', 'show the query record');

program.on('--help', () => {
  console.log('');
  console.log('Examples:');
  console.log('  $ whats love');
  console.log('  $ whats 爱');
  console.log('  $ whats bonjour -f fr');
  console.log('  $ whats こんにちは -f ja -t en');
  console.log('  $ whats I love you very much');
  console.log('  $ whats only you can control your future -f en -t ja');
  console.log('');
})

if (!process.argv.slice(2).length) {
  console.log('');
  return program.help();
}
if (!checkVers()) {
  spinner = ora();
  return spinner.warn('您的 Node.js 版本过低');
}

program.parse(process.argv);

config.say = !!program.say;
config.normalize = !!program.normal;

program.record
  ? record()
  : whats(program.from, program.to);