import { inputEachRow } from '../utils';

const input = inputEachRow('./03-mull-it-over/p1.input.txt');

let enabled = true;

function processLine(line: string): number {
  let sum = 0;

  const mulRegex = /mul\((\d{1,3}),(\d{1,3})\)/g;
  const doRegex = /do\(\)/g;
  const dontRegex = /don't\(\)/g;

  const instructions: { type: 'mul' | 'do' | 'dont', pos: number, x?: number, y?: number }[] = [];

  let match;
  while ((match = mulRegex.exec(line)) !== null) {
    instructions.push({
      type: 'mul',
      pos: match.index,
      x: parseInt(match[1]),
      y: parseInt(match[2])
    });
  }

  while ((match = doRegex.exec(line)) !== null) {
    instructions.push({
      type: 'do',
      pos: match.index
    });
  }

  while ((match = dontRegex.exec(line)) !== null) {
    instructions.push({
      type: 'dont',
      pos: match.index
    });
  }

  instructions.sort((a, b) => a.pos - b.pos);

  instructions.forEach(instruction => {
    switch (instruction.type) {
      case 'mul':
        if (enabled && instruction.x !== undefined && instruction.y !== undefined) {
          sum += instruction.x * instruction.y;
        }
        break;
      case 'do':
        enabled = true;
        break;
      case 'dont':
        enabled = false;
        break;
    }
  });

  return sum;
}

let totalSum = 0;

input.forEach(line => {
  if (line.trim()) {
    totalSum += processLine(line);
  }
});

console.log(`Sum of all enabled multiplication results: ${totalSum}`);