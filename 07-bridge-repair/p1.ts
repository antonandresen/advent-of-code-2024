import { readFileSync } from 'fs';

const input = readFileSync('./07-bridge-repair/p1.input.txt', 'utf-8')
  .trim()
  .split('\n');

let totalCalibrationResult = 0;

// Function to generate all combinations of '+' and '*' operators
function generateOperatorCombinations(numOperators: number): string[][] {
  const operators = ['+', '*'];
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

  const [testValueStr, numbersStr] = line.split(':');
  const testValue = parseInt(testValueStr.trim(), 10);
  const numbers = numbersStr.trim().split(' ').map(numStr => parseInt(numStr, 10));

  const numOperators = numbers.length - 1;
  let foundValidExpression = false;

  const operatorCombos = generateOperatorCombinations(numOperators);

  for (const combo of operatorCombos) {
    let expression = '';
    for (let i = 0; i < numbers.length; i++) {
      expression += numbers[i];
      if (i < combo.length) {
        expression += ` ${combo[i]} `;
      }
    }

    // I know overkill but now i built it this way, dont feel like changing it
    const tokens = expression.trim().split(' ');
    let result = parseInt(tokens[0], 10);
    for (let i = 1; i < tokens.length; i += 2) {
      const operator = tokens[i];
      const nextOperand = parseInt(tokens[i + 1], 10);
      if (operator === '+') {
        result += nextOperand;
      } else if (operator === '*') {
        result *= nextOperand;
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