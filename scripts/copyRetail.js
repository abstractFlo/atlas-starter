const path = require('path');
const fs = require('fs-extra');
const {config} = require('dotenv');
const pathToRetail = path.resolve(__dirname, '../retail');
config();

function readRetail() {
  return fs.readdirSync(pathToRetail, {encoding: 'utf8'});
}

function deleteResDir(dir) {
  if (fs.existsSync(dir)) {
    fs.removeSync(`${dir}/*`);
    console.log(`Successfully cleared ${dir}`);
  }
}

function copy() {
  const dirs = readRetail();
  deleteResDir(path.resolve(process.env.BUILD_DIR));

  dirs.forEach((dir) => {
    if (!dir.startsWith('_') && !dir.startsWith('.')) {
      const dest = path.resolve(process.env.BUILD_DIR, dir);
      fs.copySync(path.resolve(pathToRetail, dir), dest);
      console.log(`Successfully copied ${dir} to ${dest}`);
    }
  });

  console.log('Copy Retail Folder successfully done');
}

console.log('Start copy Retail Folder...');
copy();
