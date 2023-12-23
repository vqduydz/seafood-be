const fs = require('fs');
const path = require('path');

export function renameImg(oldName, newName) {
  const oldPath = path.join(__dirname, '../../uploads', oldName);
  const newPath = path.join(__dirname, '../../uploads', newName);

  return new Promise((resolve, reject) => {
    fs.rename(oldPath, newPath, (err) => {
      if (err) reject(false);
      else resolve(true);
    });
  });
}
