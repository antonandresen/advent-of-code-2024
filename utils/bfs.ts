export type Position = { row: number; col: number };
export type Grid<T> = T[][];

export function bfs<T>(
  grid: Grid<T>,
  start: Position,
  visitCondition: (current: Position, neighbor: Position) => boolean,
  onVisit: (current: Position) => void,
  onProcessNeighbor?: (current: Position, neighbor: Position) => void,
  directions: Position[] = [
    { row: -1, col: 0 }, // Up
    { row: 1, col: 0 },  // Down
    { row: 0, col: -1 }, // Left
    { row: 0, col: 1 },  // Right
  ],
  visited?: boolean[][]
): void {
  const numRows = grid.length;
  const numCols = grid[0].length;

  if (!visited) {
    visited = Array.from({ length: numRows }, () => Array(numCols).fill(false));
  }

  const queue: Position[] = [start];
  visited[start.row][start.col] = true;

  while (queue.length > 0) {
    const current = queue.shift()!;
    onVisit(current);

    for (const dir of directions) {
      const newRow = current.row + dir.row;
      const newCol = current.col + dir.col;

      const neighbor: Position = { row: newRow, col: newCol };

      if (
        newRow >= 0 && newRow < numRows &&
        newCol >= 0 && newCol < numCols
      ) {
        // Valid position
        if (!visited[newRow][newCol]) {
          if (visitCondition(current, neighbor)) {
            visited[newRow][newCol] = true;
            queue.push(neighbor);
          } else if (onProcessNeighbor) {
            onProcessNeighbor(current, neighbor);
          }
        } else if (onProcessNeighbor) {
          onProcessNeighbor(current, neighbor);
        }
      } else if (onProcessNeighbor) {
        // Neighbor is out of bounds
        onProcessNeighbor(current, neighbor);
      }
    }
  }
} 