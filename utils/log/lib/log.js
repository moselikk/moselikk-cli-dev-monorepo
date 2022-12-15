'use strict';
const log = require('npmlog');

/*
* 添加自定义log，或覆盖default配置
* */
log.level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info'; //判断debug模式
log.heading = 'moselikk';
log.headingStyle = {fg: 'yellow', bg: 'black'};
log.addLevel('test', 2000, { fg: 'green' }); //添加自定义命令

module.exports = log;
