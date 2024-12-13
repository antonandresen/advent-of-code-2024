import { readFileSync } from 'fs';

const diskMapStr = readFileSync('./09-disk-fragmenter/p1.input.txt', 'utf-8').trim();

let blocks: (number | '.')[] = [];

let fileId = 0;
let i = 0;

while (i < diskMapStr.length) {
  // Add file
  let fileLen = parseInt(diskMapStr[i]);
  for (let k = 0; k < fileLen; k++) {
    blocks.push(fileId);
  }

  fileId++;
  i++;

  // No space after last file
  if (i >= diskMapStr.length) {
    break;
  }

  // Add free space
  let freeLen = parseInt(diskMapStr[i]);
  for (let k = 0; k < freeLen; k++) {
    blocks.push('.');
  }

  i++;
}

let leftFreeIndex = blocks.indexOf('.');

while (leftFreeIndex !== -1) {
  let rightFileIndex = -1;
  for (let idx = blocks.length - 1; idx > leftFreeIndex; idx--) {
    if (blocks[idx] !== '.') {
      rightFileIndex = idx;
      break;
    }
  }

  if (rightFileIndex === -1) {
    break;
  }

  // Move part of file to free space, and find next free space
  blocks[leftFreeIndex] = blocks[rightFileIndex];
  blocks[rightFileIndex] = '.';
  leftFreeIndex = blocks.indexOf('.', leftFreeIndex + 1);
}

let checksum = 0;
for (let pos = 0; pos < blocks.length; pos++) {
  let block = blocks[pos];
  if (block !== '.') {
    checksum += pos * (block as number);
  }
}

console.log(`Checksum: ${checksum}`);
