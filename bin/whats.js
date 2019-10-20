#!/usr/bin/env node
const whats = require('../index');
const commander = require('commander');
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
  .option('-t, --to <target>', 'the target language');

program.on('--help', () => {
  console.log('')
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

program.parse(process.argv);

config.normalize = !!program.normal;

whats(program.from, program.to);