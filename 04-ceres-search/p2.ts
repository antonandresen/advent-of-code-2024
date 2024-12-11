import { readFileSync } from 'fs';

const grid = readFileSync('./04-ceres-search/p2.input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map(line => line.trim().split(''));

const numRows = grid.length;
const numCols = grid[0].length;

const word1 = 'MAS';
const word2 = 'SAM';
const words = [word1, word2];

let count = 0;

function checkMAS(letters: string[]): boolean {
  const sequence = letters.join('');
  return sequence === word1 || sequence === word2;
}

for (let row = 1; row < numRows - 1; row++) {
  for (let col = 1; col < numCols - 1; col++) {
    // Center must be 'A'
    if (grid[row][col] !== 'A') continue;

    // TL -> BR
    const diag1 = [
      grid[row - 1][col - 1],
      grid[row][col],
      grid[row + 1][col + 1],
    ];

    // TR -> BL
    const diag2 = [
      grid[row - 1][col + 1],
      grid[row][col],
      grid[row + 1][col - 1],
    ];

    // Confirm diagonals
    if (checkMAS(diag1) && checkMAS(diag2)) {
      count++;
    }
  }
}

console.log(`X-MAS appears ${count} times.`);