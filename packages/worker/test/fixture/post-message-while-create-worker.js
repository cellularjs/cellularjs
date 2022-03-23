require('ts-node/register');
const { parentPort } = require('worker_threads');
const { initNetWorker  } = require('./../../src');

parentPort.postMessage('ola');
initNetWorker([]);
