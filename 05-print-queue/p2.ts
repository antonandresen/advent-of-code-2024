import { readFileSync } from 'fs';
import { topologicalSort } from '../utils';

const input = readFileSync('./05-print-queue/p2.input.txt', 'utf-8');

const [rulesSection, updatesSection] = input.trim().split('\n\n');

interface Rule {
  before: number;
  after: number;
}

const rules: Rule[] = rulesSection.trim().split('\n').map(line => {
  const [beforeStr, afterStr] = line.split('|');
  return {
    before: parseInt(beforeStr, 10),
    after: parseInt(afterStr, 10)
  };
});

const rulesMap = new Map<number, Set<number>>();
rules.forEach(rule => {
  if (!rulesMap.has(rule.before)) {
    rulesMap.set(rule.before, new Set());
  }
  rulesMap.get(rule.before)!.add(rule.after);
});

const updates = updatesSection.trim().split('\n').map(line => {
  return line.split(',').map(numStr => parseInt(numStr, 10));
});

let totalMiddlePageNumbers = 0;

updates.forEach(update => {
  let isCorrect = true;

  // numbers -> positions
  const pagePositions = new Map<number, number>();
  update.forEach((pageNum, index) => {
    pagePositions.set(pageNum, index);
  });

  for (const rule of rules) {
    // If both pages are in the update
    if (pagePositions.has(rule.before) && pagePositions.has(rule.after)) {
      const posBefore = pagePositions.get(rule.before)!;
      const posAfter = pagePositions.get(rule.after)!;

      if (posBefore >= posAfter) {
        isCorrect = false;
        break;
      }
    }
  }

  if (!isCorrect) {

    // Fix the update by reordering it according to the rules
    // FROM WIKIPEDIA: in computer science, a topological sort or topological ordering of a directed graph is a linear ordering of its vertices such that for every directed edge (u,v) from vertex u to vertex v, u comes before v in the ordering.
    // Perfect, exactly what we need.
    const fixedOrder = topologicalSort(update, rules);

    if (fixedOrder.length === 0) {
      console.error('Cycle detected, cannot fix the update.');
      return;
    }

    // Find the middle page number
    const midIndex = Math.floor(fixedOrder.length / 2);
    const middlePageNum = fixedOrder[midIndex];
    totalMiddlePageNumbers += middlePageNum;
  }
});

console.log(`Sum of middle page numbers after fixing: ${totalMiddlePageNumbers}`);