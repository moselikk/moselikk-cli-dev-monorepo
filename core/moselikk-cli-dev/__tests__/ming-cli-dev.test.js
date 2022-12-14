'use strict';

const mingCliDev = require('..');
const assert = require('assert').strict;

assert.strictEqual(mingCliDev(), 'Hello from mingCliDev');
console.info("mingCliDev tests passed");
