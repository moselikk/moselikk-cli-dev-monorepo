'use strict';
const path = require('path');
const semver = require('semver');
const constant =require('./lib/const');
const userHome = require('user-home');
const pathExists = require('path-exists');
const commander = require('commander');
const colors = require('colors');
const log = require('@moselikk-cli-dev/log');
const cli = require('@moselikk-cli-dev/cli');
const init = require('@moselikk-cli-dev/init');
const pkg = require('./package.json');

let args;

const program = new commander.Command();

async function main() {
  try {
    // checkInputArgs();
    checkNodeVersion();
    checkPkgVersion();
    checkRoot();
    checkUserHome();
    checkEnv();
    await checkGlobalUpdate();
    registerCommand();

    log.test('测试', 'log模块正常运行了');
    log.verbose('debug', '当前为调试模式');
    console.log(cli());
  } catch (e) {
    log.error(e.message);
  }

}

// 注册命令
function registerCommand() {
  program
    .name(Object.keys(pkg.bin)[0])
    .usage('<command> [options]')
    .version(pkg.version)
    .option('-d, --debug', '是否开启调试模式', false)
    .option('-tp, --targetPath <targetPath>', '是否指定本地调试文件路径', '');

  // 注册init命令
  program
    .command('init [projectName]')
    .option('-f, --force', '是否强制初始化项目')
    .action(init);

  // 开启debug模式
  program.on('option:debug', function () {
    if (program.opts().debug) {
      process.env.LOG_LEVEL = 'verbose';
    } else {
      process.env.LOG_LEVEL = 'info';
    }
    log.level = process.env.LOG_LEVEL;
  });

  // program.on('option:targetPath' );

  // 未知命令处理
  program.on('command:*', function (obj) {
    const availableCommands = program.commands.map(cmd => cmd.name());
    console.log(colors.red('未知的命令' + obj[0]));
    if (availableCommands.length > 0) {
      console.log(colors.red('可用命令' + availableCommands.join(',')));
    }
  });

  program.parse(process.argv);

  // 不存在的命令，输出help内容
  if (program.args && program.args.length < 1) {
    program.outputHelp();
    console.log();
  }
}


// 打印包版本
function checkPkgVersion() {
  console.log(colors.rainbow(pkg.version));
}

// 检查node版本
function checkNodeVersion() {
  const currentVersion = process.version; // 获取本机Node版本
  const lowestVersion = constant.LOWEST_NODE_VERSION; // 设定最低支持版本

  if (!semver.gte(currentVersion, lowestVersion)) {
    throw new Error(colors.red(`moselikk-cli-dev 需要安装 v${lowestVersion} 以上版本的 Node.js`));
  }
}

// 检查是否root
function checkRoot() {
  // eslint-disable-next-line global-require
  const rootCheck = require('root-check');

  rootCheck();
}

// 检查用户主目录是否存在
function checkUserHome() {
  if (!userHome || !pathExists(userHome)) {
    throw new Error(colors.red('当前登录用户主目录不存在！'));
  }
}
// 监听调试模式
function checkInputArgs() {
  // eslint-disable-next-line global-require
  const minimist = require('minimist');
  args = minimist(process.argv.slice(2));
  // checkArgs();
}

function checkArgs() {
  if (args.debug) {
    process.env.LOG_LEVEL = 'verbose';
  } else {
    process.env.LOG_LEVEL = 'info';
  }
  log.level = process.env.LOG_LEVEL;
}

function checkEnv() {
  // eslint-disable-next-line global-require
  const dotenv = require('dotenv');
  const dotenvPath = path.resolve(userHome, '.env');
  if (pathExists(dotenvPath)) {
    dotenv.config({
      path: dotenvPath,
    });
  }
  createDefaultConfig();
  log.verbose('环境变量', process.env.CLI_HOME_PATH);
}

function createDefaultConfig() {
  const cliConfig = {};
  if (process.env.CLI_HOME) {
    cliConfig['cliHome'] = path.join(userHome, process.env.CLI_HOME);
  } else {
    cliConfig['cliHome'] = path.join(userHome, constant.DEFAULT_CLI_HOME);
  }
  process.env.CLI_HOME_PATH = cliConfig.cliHome;
}

async function checkGlobalUpdate() {
  // 获取当前版本号和模块名
  const currentVersion = pkg.version;
  const npmName = pkg.name;
  // 调用npm API，获取所有版本号
  // eslint-disable-next-line global-require
  const { getNpmSemverVersions } = require('@moselikk-cli-dev/get-npm-info');
  const lastVersion = await getNpmSemverVersions(currentVersion, npmName);
  if (lastVersion && semver.gt(lastVersion, currentVersion)) {
    log.warn(colors.yellow(`请手动更新${npmName}, 当前版本: ${currentVersion}, 最新版本:${lastVersion}
              更新命令：npm install -g ${npmName}`));
  }
  // 提取所有版本号，比对大于当前版本号
  // 获取最新版本号，提示用户更新到当前版本号
  // 测试 测试
}

module.exports = main;
