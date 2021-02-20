import path from 'path';
import fs from 'fs-extra';
import {config} from 'dotenv';

const __dirname = path.dirname('');
const pathToRetail = path.resolve(__dirname, 'retail');

config();

function readRetail() {
  return fs.readdirSync(pathToRetail, {encoding: 'utf8'});
}

function deleteResDir(dirs) {
  const resPath = path.resolve(process.env.BUILD_DIR_RETAIL);
  dirs.forEach((dir) => {
    const res = path.resolve(resPath, dir);
    if (fs.existsSync(res)) {
      fs.removeSync(res);
      console.log(`Successfully cleared ${res}`);
    }
  })
}

function copy() {
  const dirs = readRetail();
  deleteResDir(dirs);

  copyPackageJson();

  dirs.forEach((dir) => {
    if (!dir.startsWith('_') && !dir.startsWith('.')) {
      const dest = path.resolve(process.env.BUILD_DIR_RETAIL, dir);
      fs.copySync(path.resolve(pathToRetail, dir), dest);
      console.log(`Successfully copied ${dir} to ${dest}`);
    }
  });

  console.log('Copy Retail Folder successfully done');
}

/**
 * Copy the global package json to BUILD_DIR_RETAIL
 */
function copyPackageJson() {
  const dest = path.resolve(process.env.BUILD_DIR_RETAIL);
  fs.copySync(path.resolve('', 'package.json'),
      path.resolve(process.env.BUILD_DIR_RETAIL, 'package.json'));
  console.log(`Successfully copied package.json to ${dest}`);
}

console.log('Start copy Retail Folder...');
copy();
