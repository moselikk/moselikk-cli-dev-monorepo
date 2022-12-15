'use strict';
const semver = require('semver');
const constant =require('./lib/const');
const colors = require('colors');
const log = require('@moselikk-cli-dev/log');
const cli = require('@moselikk-cli-dev/cli');
const pkg = require('./package.json');


function main() {
  try {
  checkPkgVersion();
  checkNodeVersion();
  checkRoot();
  log.test('测试', 'log模块正常运行了');

  console.log(cli());
  } catch (e) {

  log.error(e.message);
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
  console.log('uid' + process.getuid());
}

module.exports = main;
