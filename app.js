
const boardContainer = document.getElementById("n-queen-board");
const playBtn = document.getElementById("play-button");
const numberInput = document.getElementById("numberbox");
const arrangementDisplay = document.getElementById("queen-arrangement");
const slider = document.getElementById("slider");
const progressBar = document.getElementById("progress-bar");

let delay = 60;
slider.oninput = function () {
  delay = this.value;
  progressBar.style.width = delay + "%";
};

function isSafe(board, row, col, n) {
  for (let i = 0; i < col; i++)
    if (board[row][i]) return false;

  for (let i = row, j = col; i >= 0 && j >= 0; i--, j--)
    if (board[i][j]) return false;

  for (let i = row, j = col; i < n && j >= 0; i++, j--)
    if (board[i][j]) return false;

  return true;
}

async function solveNQUtil(board, col, n, result) {
  if (col >= n) {
    result.push(board.map(row => row.slice()));
    return true;
  }

  let res = false;
  for (let i = 0; i < n; i++) {
    if (isSafe(board, i, col, n)) {
      board[i][col] = 1;
      res = await solveNQUtil(board, col + 1, n, result) || res;
      board[i][col] = 0;
    }
  }

  return res;
}

async function solveNQ(n) {
  const board = Array.from({ length: n }, () => Array(n).fill(0));
  const result = [];

  await solveNQUtil(board, 0, n, result);
  return result;
}

function createBoard(board, index) {
  const container = document.createElement("div");
  const heading = document.createElement("h4");
  heading.innerText = `Arrangement ${index + 1}`;
  container.appendChild(heading);

  const table = document.createElement("table");
  board.forEach(row => {
    const tr = document.createElement("tr");
    row.forEach(cell => {
      const td = document.createElement("td");
      td.innerText = cell ? "♛" : "";
      td.style.backgroundColor = (row.indexOf(cell) + row.length) % 2 === 0 ? "#eeeeee" : "#444444";
      td.style.color = cell ? "#f72585" : "transparent";
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });

  container.appendChild(table);
  return container;
}

playBtn.addEventListener("click", async () => {
  const n = parseInt(numberInput.value);
  if (isNaN(n) || n < 1 || n > 15) {
    alert("Please enter a number between 1 and 15.");
    return;
  }

  playBtn.disabled = true;
  boardContainer.innerHTML = "";
  arrangementDisplay.innerText = "Calculating, please wait...";

  const solutions = await solveNQ(n);
  arrangementDisplay.innerText = `${solutions.length} Arrangements`;

  solutions.forEach((solution, index) => {
    setTimeout(() => {
      boardContainer.appendChild(createBoard(solution, index));
    }, delay * index);
  });

  playBtn.disabled = false;
});
