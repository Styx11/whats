const readline = require('readline');
const logSymbols = require('log-symbols');

// this module is used to be a CLI when dropping the db
module.exports = dropDB => {
  const cancel = /n(o)?$/i;
  const confirm = /y(es)?$/i;
  const failed = logSymbols.error + ' ' + '清除失败！';
  const succeed = logSymbols.success + ' ' + '清除成功！';
  const question = logSymbols.warning + ' ' + '确定要清除所有记录吗? (y/n): ';
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: question
  });
  const invalid = input => {
    return logSymbols.error + ' ' + `无效指令 (${input})，请重新输入`
  };

  rl.on('line', input => {
    switch (true) {
      case !input:
        rl.prompt();
        break;
      case cancel.test(input):
        rl.close();
        break;
      case confirm.test(input):
        dropDB().then(() => {
          console.log(succeed);
          rl.close();
        }).catch(e => {
          console.log(failed);
          rl.close();
        });
        break;
      default:
        console.log(invalid(input));
        rl.prompt();
        break;
    }
  });
  rl.on('SIGINT', () => {
    rl.close();
    console.log('');
  });
  rl.prompt();
};