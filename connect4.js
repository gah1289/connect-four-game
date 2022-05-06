/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;
let player1IsNext = true;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
	// TODO: set "board" to empty HEIGHT x WIDTH matrix array
	// make 6 empty arrays
	for (let i = 0; i < HEIGHT; i++) {
		board.push([]);
	}
	//
	for (let i = 0; i < WIDTH; i++) {
		for (let i = 0; i < HEIGHT; i++) {
			board[i].push(null);
		}
	}
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
	// TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
	const htmlBoard = document.querySelector('#board');

	// TODO: make top row and set id for each cell as a top cell and its column number (0-6)
	const top = document.createElement('tr');
	top.setAttribute('id', 'column-top');
	top.addEventListener('click', handleClick);

	for (let x = 0; x < WIDTH; x++) {
		const headCell = document.createElement('td');
		headCell.setAttribute('id', x);
		top.append(headCell);
		headCell.addEventListener('mouseenter', (e) => {
			let hoveredCell = e.target;
			currPlayer === 1
				? (hoveredCell.style.backgroundColor = '#ffcccb')
				: (hoveredCell.style.backgroundColor = '#add8e6');
		});
		headCell.addEventListener('click', (e) => {
			headCell.removeAttribute('style');
		});
		headCell.addEventListener('mouseleave', (e) => {
			headCell.removeAttribute('style');
		});

		htmlBoard.append(top);
	}

	// TODO: create rest of board; 6 rows and 7 columns, set each cells id to ist position on the board y,x
	for (let y = 0; y < HEIGHT; y++) {
		const row = document.createElement('tr');
		for (let x = 0; x < WIDTH; x++) {
			const cell = document.createElement('td');
			cell.setAttribute('id', `${y}-${x}`);
			row.append(cell);
		}
		htmlBoard.append(row);
	}
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
	// TODO: given column x, return top empty y. Return null if filled.

	for (let y = HEIGHT - 1; y >= 0; y--) {
		// console.log(y);
		if (board[y][x] === null) {
			return y;
		}
	}
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
	// TODO: make a div and insert into correct table cell
	const chip = document.createElement('div');
	chip.classList.add('piece');
	chip.classList.add(`player${currPlayer}`);

	const taken = document.getElementById(`${y}-${x}`);
	taken.append(chip);
}

/** endGame: announce game end */

function endGame(msg) {
	const gameBoard = document.querySelector('#game');

	// DONE: pop up alert message
	alert(msg);
	const doneButton = document.createElement('button');
	doneButton.innerHTML = 'Restart';
	gameBoard.appendChild(doneButton);
	doneButton.addEventListener('click', function() {
		location.reload();
	});
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
	// get x from ID of clicked cell
	const x = +evt.target.id;

	// get next spot in column (if none, ignore click)
	const y = findSpotForCol(x);
	if (y === null) {
		return;
	}

	// place piece in board and add to HTML table
	// TODO: add line to update in-memory board
	board[y][x] = currPlayer;
	placeInTable(y, x);

	// check for win
	if (checkForWin()) {
		return endGame(`Player ${currPlayer} won!`);
	}

	// check for tie
	// TODO: check if all cells in board are filled; if so call, call endGame
	if (
		board.every((val) => {
			return val === null;
		})
	) {
		endGame();
	}

	// switch players
	// TODO: switch currPlayer 1 <-> 2
	currPlayer === 1 ? (currPlayer = 2) : (currPlayer = 1);
}

const topRow = document.querySelector('column-top');

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
	function _win(cells) {
		// Check four cells to see if they're all color of current player
		//  - cells: list of four (y, x) cells
		//  - returns true if all are legal coordinates & all match currPlayer

		return cells.every(
			(
				[
					y,
					x
				]
			) => y >= 0 && y < HEIGHT && x >= 0 && x < WIDTH && board[y][x] === currPlayer
		);
	}

	// TODO: read and understand this code. Add comments to help you.

	for (let y = 0; y < HEIGHT; y++) {
		for (let x = 0; x < WIDTH; x++) {
			// winner got 4 in a row in x-axis
			const horiz = [
				[
					y,
					x
				],
				[
					y,
					x + 1
				],
				[
					y,
					x + 2
				],
				[
					y,
					x + 3
				]
			];
			// winner got 4 in a row in y-axis
			const vert = [
				[
					y,
					x
				],
				[
					y + 1,
					x
				],
				[
					y + 2,
					x
				],
				[
					y + 3,
					x
				]
			];
			// winner got 4 in a row towards top-right /
			const diagDR = [
				[
					y,
					x
				],
				[
					y + 1,
					x + 1
				],
				[
					y + 2,
					x + 2
				],
				[
					y + 3,
					x + 3
				]
			];
			// winner got 4 in a row going top left \
			const diagDL = [
				[
					y,
					x
				],
				[
					y + 1,
					x - 1
				],
				[
					y + 2,
					x - 2
				],
				[
					y + 3,
					x - 3
				]
			];

			if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
				return true;
			}
		}
	}
}

makeBoard();
makeHtmlBoard();
