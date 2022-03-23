require('ts-node/register');
const { createCluster } = require('../../src');

createCluster({
  script: 'script-is-not-important-here',
});
