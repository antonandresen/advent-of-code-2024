import { readFileSync } from 'fs';

const input = readFileSync('./05-print-queue/p1.input.txt', 'utf-8');

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

  if (isCorrect) {
    const midIndex = Math.floor(update.length / 2);
    const middlePageNum = update[midIndex];
    totalMiddlePageNumbers += middlePageNum;
  }
});

console.log(`Sum of middle page numbers: ${totalMiddlePageNumbers}`);