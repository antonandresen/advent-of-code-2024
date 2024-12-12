import { readFileSync } from 'fs';

const mapInput = readFileSync('./06-guard-galliant/p1.input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map(line => line.split(''));

const numRows = mapInput.length;
const numCols = mapInput[0].length;

const directionSymbols = ['^', '>', 'v', '<'];
const dx = [0, 1, 0, -1];
const dy = [-1, 0, 1, 0];

let guardX = 0;
let guardY = 0;
let directionIndex = 0;

outerLoop:
for (let y = 0; y < numRows; y++) {
  for (let x = 0; x < numCols; x++) {
    const cell = mapInput[y][x];
    const dirIndex = directionSymbols.indexOf(cell);

    // Guard found
    if (dirIndex !== -1) {
      guardX = x;
      guardY = y;
      directionIndex = dirIndex;
      break outerLoop;
    }
  }
}

const visitedPositions = new Set<string>();

visitedPositions.add(`${guardX},${guardY}`);

// Move guard
while (true) {
  const nextX = guardX + dx[directionIndex];
  const nextY = guardY + dy[directionIndex];

  console.log(`${nextX},${nextY}`);

  const withinBounds = nextX >= 0 && nextX < numCols && nextY >= 0 && nextY < numRows;

  // About to move out of bounds
  if (!withinBounds) {
    break;
  }

  if (mapInput[nextY]?.[nextX] === '#') {
    // Turn 90 deg
    directionIndex = (directionIndex + 1) % 4;
  } else {
    // Move
    guardX = nextX;
    guardY = nextY;
    visitedPositions.add(`${guardX},${guardY}`);
  }
}

console.log(`The guard visits ${visitedPositions.size} distinct positions.`);