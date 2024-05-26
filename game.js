console.log("Script loaded");

const X_CLASS = 'x';
const O_CLASS = 'o';
const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // แถว
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // คอลัมน์
  [0, 4, 8], [2, 4, 6]             // เส้นทะแยง
];

let cellElements = document.querySelectorAll('[data-cell]');
let board = document.getElementById('board');
let winningMessageElement = document.getElementById('winningMessage');
let winningMessageTextElement = document.querySelector('[data-winning-message-text]');
let restartButton = document.getElementById('restartButton');
let oTurn;

let xCount = 0; // ตัวแปรนับจำนวนการคลิกของ X
let oCount = 0; // ตัวแปรนับจำนวนการคลิกของ O
let xPositions = []; // ตัวแปรเก็บตำแหน่งการคลิกของ X
let oPositions = []; // ตัวแปรเก็บตำแหน่งการคลิกของ O

let flashInterval; // ตัวแปรเพื่อเก็บ interval ของการกระพริบ
let flashingText; // ตัวแปรเพื่อเก็บตัวอักษรที่กำลังกระพริบ
let k = 0;
startGame();

restartButton.addEventListener('click', startGame);

function startGame() {
  console.log("Game started");
  oTurn = false;
  xCount = 0;
  oCount = 0;
  xPositions = []; // รีเซ็ตตำแหน่งการคลิกของ X
  oPositions = []; // รีเซ็ตตำแหน่งการคลิกของ O
  clearInterval(flashInterval); // รีเซ็ตการกระพริบ
  flashingText = null; // รีเซ็ตตัวอักษรที่กำลังกระพริบ

  cellElements.forEach(cell => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(O_CLASS);
    cell.innerHTML = ''; // ล้างข้อความในเซลล์
    cell.removeEventListener('click', handleClick);
    cell.addEventListener('click', handleClick, { once: true });
  });

  setBoardHoverClass();
  winningMessageElement.classList.remove('show');
}

function handleClick(e) {
  const cell = e.target;
  const currentClass = oTurn ? O_CLASS : X_CLASS;

  placeMark(cell, currentClass);

  if (checkWin(currentClass)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
    setBoardHoverClass();
    console.log(k);
    if (k < 5) {
      k += 1;
    } else {
      if (currentClass === X_CLASS && xCount === 3) {
        flashCell(oPositions[0]); // ทำให้ตัวแรกกระพริบ
      } else if (currentClass === O_CLASS && oCount === 3) {
        flashCell(xPositions[0]); // ทำให้ตัวแรกกระพริบ
      }
    }
  }
}

function placeMark(cell, currentClass) {
  if (flashingText) {
    clearInterval(flashInterval);
    flashingText.classList.remove('flash-text');
    flashingText = null;
  }

  cell.classList.add(currentClass);
  cell.innerHTML = `<span>${currentClass.toUpperCase()}</span>`;
  
  if (currentClass === X_CLASS) {
    xCount++;
    xPositions.push(cell);
  } else {
    oCount++;
    oPositions.push(cell);
  }

  console.log(`X has been clicked ${xCount} times`);
  console.log(`O has been clicked ${oCount} times`);

  if (currentClass === X_CLASS && xCount > 3) {
    const firstXCell = xPositions.shift();
    firstXCell.classList.remove(X_CLASS);
    firstXCell.innerHTML = '';
    firstXCell.addEventListener('click', handleClick, { once: true });
    xCount--;
  } else if (currentClass === O_CLASS && oCount > 3) {
    const firstOCell = oPositions.shift();
    firstOCell.classList.remove(O_CLASS);
    firstOCell.innerHTML = '';
    firstOCell.addEventListener('click', handleClick, { once: true });
    oCount--;
  }
}

function flashCell(cell) {
  const text = cell.querySelector('span');
  if (flashingText) {
    flashingText.classList.remove('flash-text');
  }
  flashingText = text;
  flashingText.classList.add('flash-text');
}

function endGame(draw) {
  if (draw) {
    winningMessageTextElement.innerText = 'Draw!';
  } else {
    winningMessageTextElement.innerText = `${oTurn ? "O's" : "X's"} Wins!`;
  }
  winningMessageElement.classList.add('show');
}

function isDraw() {
  return [...cellElements].every(cell => {
    return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
  });
}

function swapTurns() {
  oTurn = !oTurn;
}

function setBoardHoverClass() {
  board.classList.remove(X_CLASS);
  board.classList.remove(O_CLASS);
  if (oTurn) {
    board.classList.add(O_CLASS);
  } else {
    board.classList.add(X_CLASS);
  }
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some(combination => {
    return combination.every(index => {
      return cellElements[index].classList.contains(currentClass);
    });
  });
}
