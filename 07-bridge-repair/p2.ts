import { readFileSync } from 'fs';

const input = readFileSync('./07-bridge-repair/p2.input.txt', 'utf-8')
  .trim()
  .split('\n');

let totalCalibrationResult = 0;

// Function to generate all combinations of '+' and '*' operators
function generateOperatorCombinations(numOperators: number): string[][] {
  const operators = ['+', '*', '||'];
  const combinations: string[][] = [];

  // Recursively generate all combinations
  function backtrack(index: number, currentCombination: string[]) {
    if (index === numOperators) {
      combinations.push([...currentCombination]);
      return;
    }
    for (const op of operators) {
      currentCombination.push(op);
      backtrack(index + 1, currentCombination);
      currentCombination.pop();
    }
  }

  backtrack(0, []);
  return combinations;
}

// Process each equation
input.forEach(line => {
  if (!line.trim()) {
    return;
  }

  const [testValueStr, numbersStr] = line.split(':');
  const testValue = parseInt(testValueStr.trim(), 10);
  const numbers = numbersStr.trim().split(' ').map(numStr => parseInt(numStr, 10));

  const numOperators = numbers.length - 1;
  let foundValidExpression = false;

  const operatorCombos = generateOperatorCombinations(numOperators);

  // Cleaned this up a bit here in p2
  for (const combo of operatorCombos) {
    let result = numbers[0];

    for (let i = 0; i < combo.length; i++) {
      const operator = combo[i];
      const nextOperand = numbers[i + 1];
      if (operator === '+') {
        result += nextOperand;
      } else if (operator === '*') {
        result *= nextOperand;
      } else if (operator === '||') {
        result = parseInt('' + result + nextOperand, 10);
      }
    }

    if (result === testValue) {
      foundValidExpression = true;
      break;
    }
  }

  if (foundValidExpression) {
    totalCalibrationResult += testValue;
  }
});

console.log(`Total calibration result: ${totalCalibrationResult}`);
