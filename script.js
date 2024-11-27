const display = document.getElementById("display");
const buttons = document.querySelectorAll("button");
const bottomDisplay = document.querySelector("#bottom-calc");
const topDisplay = document.querySelector("#top-calc");

const operators = ["÷", "x", "+", "-"];
const digits = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "0"];

let pointer = 0;
let stack = [[], [], []];
let answer = [];

function appendToDisplay(value) {
  formatStack(value);

  console.log("eqStack: ", stack);

  updateDisplay();
}

function calculate() {
  //eqStack.flat(); // Çıktı: ["5", "+", "3"]
  //eqStack.flat().join(""); // Çıktı: "5+3"
  let flatStack = stack.map((e) => e.join(""));

  answer = operate(
    flatStack[1],
    parseFloat(flatStack[0]),
    parseFloat(flatStack[2])
  );
  answer = Math.round(answer * 100) / 100;
  topDisplay.textContent = flatStack.join("");
  bottomDisplay.textContent = answer;

  return answer;
}

function formatStack(value) {
  //stack[pointer].push(value);
  //Kullanıcının bastığı tuş şu anki eqPointer'ın işaret ettiği bölüme eklenir.

  switch (pointer) {
    case 0:
      stack[0].push(value);
      //console.log("case0");
      //Eğer bir önceki işlem sonucu varsa (answer.length != 0) ve kullanıcı yeni bir sayı tuşlarsa
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
      //console.log(stack[1].length);
      if (stack[1].length > 0 && operators.includes(value)) {
        //console.log("case1");
        stack[1].length = 0;
        stack[1].push(value);
      } else if (digits.includes(value)) {
        // Operatörden sonra sayı girilirse ikinci pozisyona geçiş yapılır
        pointer = 2;
        stack[2].push(value);
      }

      break;

    case 2:
      //console.log("case2");
      /* bu oldugunda hesaplama baslamali kodu degistir
      if (stack[2].length == 1 && operators.includes(value)) {
        stack[2].pop();
      }
        */
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
  answer = calculate();

  topDisplay.textContent = stack.flat().join("");
  bottomDisplay.textContent = answer;

  //Daha sonra eqStack sıfırlanır ve sonuç, yeni işlemlerde kullanılabilmesi için eqStack[0] pozisyonuna eklenir.
  stack[0] = answer.toString();
  stack[1] = [];
  stack[2] = [];
  pointer = 0;
}

//belki sonra default ekle
function operate(currentOperator, firstNumber, secondNumber) {
  switch (currentOperator) {
    case "+":
      return add(firstNumber, secondNumber);
    case "-":
      return subtract(firstNumber, secondNumber);
    case "*":
      return multiply(firstNumber, secondNumber);
    case "/":
      return secondNumber === 0
        ? "I'm sorry Dave"
        : divide(firstNumber, secondNumber);
  }
}

function updateDisplay() {
  const topCalcContent = stack.flat().join("");
  const bottomCalcContent = stack[pointer].join("") || "0";

  //update top and bottom displays
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
      //console.log(value);   //SIL
      if (value === "=") {
        equal();
      } else if (value === "C") {
        clearAll();
      } else if (value === "DEL") {
        deleteButton();
      } else {
        appendToDisplay(value);
        //console.log(value);
      }
    } else {
      appendToDisplay(value);
      //console.log(value);   //SIL
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
