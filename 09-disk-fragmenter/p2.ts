import { readFileSync } from 'fs';

const diskMapStr = readFileSync('./09-disk-fragmenter/p2.input.txt', 'utf-8').trim();

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

const fileBlocksMap = new Map<number, number[]>();

// Map file blocks to their indexes
for (let idx = 0; idx < blocks.length; idx++) {
  const block = blocks[idx];
  if (block !== '.') {
    if (!fileBlocksMap.has(block as number)) {
      fileBlocksMap.set(block as number, []);
    }
    fileBlocksMap.get(block as number)!.push(idx);
  }
}

const freeSpaces: { start: number; length: number }[] = [];
let start = -1;

// Find free spaces and put in data structure, to make it easier to move files
for (let idx = 0; idx <= blocks.length; idx++) {
  if (idx < blocks.length && blocks[idx] === '.') {
    if (start === -1) {
      start = idx;
    }
  } else {
    if (start !== -1) {
      freeSpaces.push({ start, length: idx - start });
      start = -1;
    }
  }
}

const fileIds = Array.from(fileBlocksMap.keys()).sort((a, b) => b - a);

// Try to move each file to first free space
for (const fid of fileIds) {
  const fileBlockIndices = fileBlocksMap.get(fid)!;
  const fileSize = fileBlockIndices.length;

  for (const freeSpace of freeSpaces) {
    if (freeSpace.length >= fileSize && freeSpace.start < fileBlockIndices[0]) {
      for (let i = 0; i < fileSize; i++) {
        blocks[freeSpace.start + i] = fid;
        blocks[fileBlockIndices[i]] = '.';
      }
      freeSpace.start += fileSize;
      freeSpace.length -= fileSize;
      break;
    }
  }
}

let checksum = 0;
for (let pos = 0; pos < blocks.length; pos++) {
  let block = blocks[pos];
  if (block !== '.') {
    checksum += pos * (block as number);
  }
}

console.log(`Checksum: ${checksum}`);
