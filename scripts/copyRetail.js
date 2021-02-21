import path from 'path';
import fs from 'fs-extra';
import {config} from 'dotenv';

const __dirname = path.dirname('');

config();

function getFolderPath(folder) {
  return path.resolve(__dirname, folder);
}

function readFolder(folder) {
  return fs.readdirSync(getFolderPath(folder), {encoding: 'utf8'});
}

function deleteResDir() {
  const dirs = readFolder(process.env.BUILD_DIR_RETAIL);
  dirs.forEach(dir => {
    const finalDir = `${process.env.BUILD_DIR_RETAIL}/${dir}`;
    fs.removeSync(`${finalDir}`);
    console.log(`Successfully cleared ${finalDir}`);
  })
}

function copy() {
  const dirs = readFolder('retail');
  deleteResDir();

  copyPackageJson();

  dirs.forEach((dir) => {
    if (!dir.startsWith('_') && !dir.startsWith('.') && !dir.includes('.example.')) {
      const dest = path.resolve(getFolderPath(process.env.BUILD_DIR_RETAIL), dir);
      fs.copySync(path.resolve(getFolderPath('retail'), dir), dest);
      console.log(`Successfully copied ${dir} to ${dest}`);
    }
  });

  console.log('Copy Retail Folder successfully done');
}

/**
 * Copy the global package json to BUILD_DIR_RETAIL
 */
function copyPackageJson() {
  const dest = getFolderPath(process.env.BUILD_DIR_RETAIL);
  fs.copySync(path.resolve('', 'package.json'),
      path.resolve(process.env.BUILD_DIR_RETAIL, 'package.json'));
  console.log(`Successfully copied package.json to ${dest}`);
}

console.log('Start copy Retail Folder...');
copy();
