import { readFileSync } from 'fs';

const map = readFileSync('./10-hoof-it/p2.input.txt', 'utf-8')
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

function countDistinctPaths(start: Position): number {
  // Use dynamic programming to count paths
  // dp[row][col][height] represents number of paths to this position at this height
  // Read here: https://en.wikipedia.org/wiki/Dynamic_programming
  // Essentially, store state at each position for each height.
  const dp: number[][][] = Array(numRows).fill(null).map(() =>
    Array(numCols).fill(null).map(() =>
      Array(10).fill(0)
    )
  );

  // Initialize starting point
  dp[start.row][start.col][0] = 1;

  // Process each height level
  for (let height = 0; height < 9; height++) {
    // For each position in the map
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        if (dp[row][col][height] > 0) {
          // Get valid neighbors for current position
          const neighbors = getValidNeighbors({ row, col }, height);
          
          // Add paths to neighbors
          for (const neighbor of neighbors) {
            dp[neighbor.row][neighbor.col][height + 1] += dp[row][col][height];
          }
        }
      }
    }
  }

  // Sum up all paths that reach height 9
  let totalPaths = 0;
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      totalPaths += dp[row][col][9];
    }
  }

  return totalPaths;
}

let totalRating = 0;

// Process each trailhead
for (const trailhead of trailheads) {
  const rating = countDistinctPaths(trailhead);
  totalRating += rating;
}

console.log(`Sum of trailhead ratings: ${totalRating}`);