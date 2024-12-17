import { readFileSync } from 'fs';

const map = readFileSync('./10-hoof-it/p1.input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map(line => line.split('').map(Number));

const numRows = map.length;
const numCols = map[0].length;

type Position = {
  row: number;
  col: number;
};

// Find all trailheads (positions with height 0)
const trailheads: Position[] = [];
for (let row = 0; row < numRows; row++) {
  for (let col = 0; col < numCols; col++) {
    if (map[row][col] === 0) {
      trailheads.push({ row, col });
    }
  }
}

function getValidNeighbors(pos: Position, currentHeight: number): Position[] {
  const neighbors: Position[] = [];
  const directions = [
    { row: -1, col: 0 }, // up
    { row: 1, col: 0 },  // down
    { row: 0, col: -1 }, // left
    { row: 0, col: 1 }   // right
  ];

  for (const dir of directions) {
    const newRow = pos.row + dir.row;
    const newCol = pos.col + dir.col;

    // Check bounds
    if (newRow < 0 || newRow >= numRows || newCol < 0 || newCol >= numCols) {
      continue;
    }

    // Check if height increases by exactly 1
    if (map[newRow][newCol] === currentHeight + 1) {
      neighbors.push({ row: newRow, col: newCol });
    }
  }

  return neighbors;
}

function findReachableNines(start: Position): Set<string> {
  const reachableNines = new Set<string>();
  const visited = new Set<string>();
  const queue: { pos: Position, height: number }[] = [{ pos: start, height: 0 }];

  while (queue.length > 0) {
    const current = queue.shift()!;
    const posKey = `${current.pos.row},${current.pos.col}`;

    if (visited.has(posKey)) {
      continue;
    }
    visited.add(posKey);

    // If we reach height 9, add to reachableNines
    if (current.height === 9) {
      reachableNines.add(posKey);
      continue;
    }

    // Get valid neighbors and add them to queue
    const neighbors = getValidNeighbors(current.pos, current.height);
    for (const neighbor of neighbors) {
      queue.push({ pos: neighbor, height: current.height + 1 });
    }
  }

  return reachableNines;
}

let totalScore = 0;

// Process each trailhead
for (const trailhead of trailheads) {
  const reachableNines = findReachableNines(trailhead);
  totalScore += reachableNines.size;
}

console.log(`Sum of trailhead scores: ${totalScore}`);