# flatten array problem 

## solution

``` javascript
function flatten(array) {
  // Check if the input array is empty
  if (array.length === 0) {
    return [];
  }

  // Use reduce to flatten the array
  return array.reduce((acc, cur) => acc.concat(cur), []);
}

```

## code template 

``` javascript
function flatten(array) {
}

```

## Test code 

```javascript

// @ts-nocheck

// #INSERT_HERE

function createTestOutput(result, inputs, expected, actual) {
  return {
    executionResult: result ? "passed" : "failed",
    input: inputs, // Array of objects with "input" property
    expected: JSON.stringify(expected),
    output: JSON.stringify(actual),
  };
}

let results = []; // Array to store results

// Test case 1
let input1 = [
  [1, 2],
  [3, 4],
];
let expected1 = [1, 2, 3, 4];
let result1 = flatten(input1);
results.push(
  createTestOutput(
    result1.toString() === expected1.toString(),
    [input1],
    expected1,
    result1,
  ),
);

// Test case 2
let input2 = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
let expected2 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let result2 = flatten(input2);
results.push(
  createTestOutput(
    result2.toString() === expected2.toString(),
    [input2],
    expected2,
    result2,
  ),
);

// Test case 3
let input3 = [
  [-1, -2],
  [-3, -4],
];
let expected3 = [-1, -2, -3, -4];
let result3 = flatten(input3);
results.push(
  createTestOutput(
    result3.toString() === expected3.toString(),
    [input3],
    expected3,
    result3,
  ),
);

// Write all results to stdout at once
process.stdout.write(JSON.stringify(results) + "\n");
```
