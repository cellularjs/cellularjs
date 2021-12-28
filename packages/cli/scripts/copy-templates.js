const fse = require('fs-extra');
const path = require('path');

fse.copySync(
  path.resolve(__dirname, '..', 'src', 'templates'),
  path.resolve(__dirname, '..', 'dist', 'templates'),
);
