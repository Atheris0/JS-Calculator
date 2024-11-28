const display = document.getElementById("display");
const buttons = document.querySelectorAll("button");
const bottomDisplay = document.querySelector("#bottom-calc");
const topDisplay = document.querySelector("#top-calc");

const operators = ["/", "*", "+", "-"];
const digits = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "0"];

let pointer = 0;
let stack = [[], [], []];
let answer = [];

function appendToDisplay(value) {
  formatStack(value);

  //console.log(stack);

  updateDisplay();
}

function calculate() {
  let flatStack = stack.map((e) => e.join(""));

  answer = operate(
    flatStack[1],
    parseFloat(flatStack[0]),
    parseFloat(flatStack[2])
  );

  if (answer === "Error") {
    bottomDisplay.textContent = "I'm sorry Dave";
  } else {
    answer = Math.round(answer * 100) / 100;
    bottomDisplay.textContent = answer;
  }
  topDisplay.textContent = flatStack.join("");

  return answer;
}

function formatStack(value) {
  switch (pointer) {
    case 0:
      stack[0].push(value);

      //negatif logic eklenecek

      if (answer.length != 0 && digits.includes(value)) {
        answer = [];
        stack[0] = [value];
      }

      if (stack[0].length == 1 && operators.includes(value) && value != "-") {
        stack[0].pop();
      }

      if (stack[0].length > 0 && operators.includes(value) && value != ".") {
        pointer = 1;

        let operator = stack[0].pop();
        stack[1].push(operator);
      }
      break;

    case 1:
      if (stack[1].length > 0 && operators.includes(value)) {
        stack[1].length = 0;
        stack[1].push(value);
      } else if (digits.includes(value)) {
        pointer = 2;
        stack[2].push(value);
      }

      break;

    case 2:
      stack[2].push(value);

      if (stack[2].length > 0 && operators.includes(value)) {
        let operator = stack[2].pop();
        answer = calculate();
        stack = [[], [], []];
        stack[0].push(answer.toString());
        stack[1].push(operator);
        pointer = 1;
      }
      break;
  }
}

function equal() {
  if (stack.map((part) => part.join("")).some((part) => part === "")) {
    return;
  }
  answer = calculate();

  topDisplay.textContent = stack.flat().join("");

  if (answer === "Error") {
    bottomDisplay.textContent = "I'm sorry Dave";
  } else {
    answer = Math.round(answer * 100) / 100;
    bottomDisplay.textContent = answer;
  }

  stack = [[], [], []];
  stack[0].push(answer.toString());
  pointer = 0;
}

function operate(currentOperator, firstNumber, secondNumber) {
  switch (currentOperator) {
    case "+":
      return add(firstNumber, secondNumber);
    case "-":
      return subtract(firstNumber, secondNumber);
    case "*":
      return multiply(firstNumber, secondNumber);
    case "/":
      return secondNumber === 0 ? "Error" : divide(firstNumber, secondNumber);
  }
}

function updateDisplay() {
  const topCalcContent = stack.flat().join("");
  const bottomCalcContent = stack[pointer].join("") || "0";

  topDisplay.textContent = topCalcContent || "";
  bottomDisplay.textContent = bottomCalcContent;
}

function deleteButton() {
  while (stack[pointer].length == 0) {
    pointer--;
    if (pointer < 0) {
      pointer = 0;
      break;
    }
  }
  stack[pointer].pop();
  updateDisplay();
}

buttons.forEach((button) => {
  const value = button.textContent;

  button.addEventListener("click", () => {
    if (button.classList.contains("operator")) {
      if (value === "=") {
        equal();
      } else if (value === "C") {
        clearAll();
      } else if (value === "DEL") {
        deleteButton();
      } else {
        appendToDisplay(value);
      }
    } else {
      appendToDisplay(value);
    }
  });
});

function clearAll() {
  pointer = 0;
  stack = [[], [], []];
  answer = [];

  topDisplay.textContent = "0";
  bottomDisplay.textContent = "0";
}

function add(a, b) {
  return a + b;
}
function subtract(a, b) {
  return a - b;
}
function multiply(a, b) {
  return a * b;
}
function divide(a, b) {
  return a / b;
}
