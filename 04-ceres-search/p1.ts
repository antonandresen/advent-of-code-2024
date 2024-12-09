import { readFileSync } from 'fs';

const grid = readFileSync('./04-ceres-search/p1.input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map(line => line.trim().split(''));

const numRows = grid.length;
const numCols = grid[0].length;

const word = 'XMAS';
const wordLength = word.length;

let count = 0;

const directions = [
  [-1, -1], // Northwest
  [-1, 0],  // North
  [-1, 1],  // Northeast
  [0, -1],  // West
  [0, 1],   // East
  [1, -1],  // Southwest
  [1, 0],   // South
  [1, 1]    // Southeast
];

for (let row = 0; row < numRows; row++) {
  for (let col = 0; col < numCols; col++) {
    for (const [dx, dy] of directions) {
      let matched = true;

      for (let k = 0; k < wordLength; k++) {
        const newRow = row + dx * k;
        const newCol = col + dy * k;

        if (
          newRow < 0 ||
          newRow >= numRows ||
          newCol < 0 ||
          newCol >= numCols ||
          grid[newRow][newCol] !== word[k]
        ) {
          matched = false;
          break;
        }
      }

      if (matched) {
        count++;
      }
    }
  }
}

console.log(`XMAS appears ${count} times.`);