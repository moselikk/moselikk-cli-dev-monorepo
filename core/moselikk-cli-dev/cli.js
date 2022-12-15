#!/usr/bin/env node

'use strict';

const importLocal = require('import-local');
const log = require('@moselikk-cli-dev/log');

if (importLocal(__filename)) {
  log.info('cli', '正在使用 moselikk-cli-dev 本地版本');
} else {
  // eslint-disable-next-line global-require
  require('.')(process.argv.slice(2));
}


