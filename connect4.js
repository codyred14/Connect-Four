const WIDTH = 7; // The width of the game board, measured in number of columns
const HEIGHT = 6; // The height of the game board, measured in number of rows

// Initialize current player to 1 and create an empty board array
let currPlayer = 1;
let board = [];

// Function to create a 2D array of empty spaces with the dimensions of HEIGHT x WIDTH
function makeBoard() {
  for (let y = 0; y < HEIGHT; y++) {
    board.push(Array.from({ length: WIDTH }));
  }
}

// Function to create the HTML table structure for the game board
function makeHtmlBoard() {

  // Get the HTML element with id "board"
  const board = document.getElementById('board');

  // Create a top row element for the column tops
  const top = document.createElement('tr');
  top.setAttribute('id', 'column-top');
  top.addEventListener('click', handleClick);

  // Create table cells for the top row with ids equal to their column number
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement('td');
    headCell.setAttribute('id', x);
    top.append(headCell);
  }

  // Append the top row to the board element
  board.append(top);

  // Create table rows for the game board
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement('tr');

    // Create table cells for each row with ids in the format "y-x"
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement('td');
      cell.setAttribute('id', `${y}-${x}`);
      row.append(cell);
    }

    // Append the row to the board element
    board.append(row);
  }
}

// Function to find the first empty spot in a given column
function findSpotForCol(x) {

  // Iterate through the rows of the column starting from the bottom
  for (let y = HEIGHT - 1; y >= 0; y--) {

    // Check if the spot is empty
    if (!board[y][x]) {
      return y;
    }
  }

  // If the column is full, return null
  return null;
}

// Function to place a game piece in the HTML table
function placeInTable(y, x) {

  // Create a new HTML div element for the game piece
  const piece = document.createElement('div');
  piece.classList.add('piece');
  piece.classList.add(`p${currPlayer}`);
  piece.classList.add('drop-animation');

  // Get the HTML element for the spot on the board
  const spot = document.getElementById(`${y}-${x}`);
  spot.append(piece);
}

// Function to end the game and display a message
function endGame(msg) {
  setTimeout(() => {
    if (confirm(msg)) {
      location.reload();
    }
  }, 1000);
}

// Function to handle a click on the top row of the game board
function handleClick(evt) {

  // Get the column number from the id of the clicked cell
  const x = +evt.target.id;

  // Create a new audio object for the "drop" sound effect
  const sound = new Audio("./drop.wav");
  sound.play();

  // Find the first empty spot in the selected column
  const y = findSpotForCol(x);
  if (y === null) {
    // If the column is full, exit the function
    return;
  }

  // Place the current player's game piece in the board array
  board[y][x] = currPlayer;

  // Place the game piece in the HTML table
  placeInTable(y, x);

  // Check if the current player has won
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won! Click "OK" to play again!`);
  }

  // Check if the game is a tie
  if (board.every(row => row.every(cell => cell))) {
    return endGame('Tie! Click "OK" to play again!');
  }

  // Switch to the other player
  currPlayer = currPlayer === 1 ? 2 : 1;
}

// Function to check if the current player has won the game
function checkForWin() {

  // Helper function to check if a series of cells contains the current player's game piece
  function _win(cells) {

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // Iterate through all spots on the board
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      // Check horizontal, vertical, and diagonal lines of 4 spots starting from the current spot
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      // If any of the lines contain the current player's game piece, return true
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();

document.querySelectorAll('#column-top td').forEach(function (td) {
  // add an event listener for when the mouse pointer enters the table cell
  td.addEventListener('mouseover', function () {
    // check the current player
    if (currPlayer === 1) {
      // if current player is 1, add class 'p1'
      this.classList.add('p1');
    } else {
      // if current player is 2, add class 'p2'
      this.classList.add('p2');
    }
  });
  // add an event listener for when the mouse pointer leaves the table cell
  td.addEventListener('mouseout', function () {
    // remove the 'p1' and 'p2' classes from the cell
    this.classList.remove('p1', 'p2');
  });
});





