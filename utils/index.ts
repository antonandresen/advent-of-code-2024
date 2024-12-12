import { readFileSync } from 'fs';

/**
 * Reads a file and returns an array of strings, each representing a row in the file.
 * @param path The path to the file.
 * @returns An array of strings, each representing a row in the file.
 */
export const inputEachRow = (path: string) => {
  return readFileSync(path, 'utf-8')
    .trim()
    .split('\n')
    .map(line => line.trim())
};

interface Rule {
  before: number;
  after: number;
}

/**
 * Performs topological sort on the given list of items according to the provided rules.
 * Can sort a DAG (Directed Acyclic Graph) in linear time. https://en.wikipedia.org/wiki/Directed_acyclic_graph
 * Sorting explained: https://en.wikipedia.org/wiki/Topological_sorting
 * @param pages The list of pages to sort.
 * @param rules The ordering rules.
 * @returns An array representing the pages in a valid order.
 */
export const topologicalSort = (pages: number[], rules: Rule[]): number[] => {
  const graph = new Map<number, number[]>();
  const inDegree = new Map<number, number>();

  // Init graph and in-degree map
  pages.forEach(page => {
    graph.set(page, []);
    inDegree.set(page, 0);
  });

  // Build graph
  for (const rule of rules) {
    const { before, after } = rule;
    if (graph.has(before) && graph.has(after)) {
      graph.get(before)!.push(after);
      inDegree.set(after, inDegree.get(after)! + 1);
    }
  }

  // Queue for pages with zero in-degree
  const queue: number[] = [];
  for (const [page, degree] of inDegree.entries()) {
    if (degree === 0) {
      queue.push(page);
    }
  }

  const sortedPages: number[] = [];

  while (queue.length > 0) {
    const page = queue.shift()!;
    sortedPages.push(page);

    for (const neighbor of graph.get(page)!) {
      inDegree.set(neighbor, inDegree.get(neighbor)! - 1);
      if (inDegree.get(neighbor) === 0) {
        queue.push(neighbor);
      }
    }
  }

  // Check if topological sort was possible
  if (sortedPages.length !== pages.length) {
    // Cycle detected
    return [];
  }

  return sortedPages;
}

/**
 * Calculates the greatest common divisor of two numbers.
 * @param a The first number.
 * @param b The second number.
 * @returns The greatest common divisor of the two numbers.
 */
export const gcd = (a: number, b: number): number => {
  if (b === 0) return Math.abs(a);
  return gcd(b, a % b);
};