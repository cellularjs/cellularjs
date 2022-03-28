require('ts-node/register');
const { createPool } = require('../../src');

createPool({
  script: 'script-is-not-important-here',
});
