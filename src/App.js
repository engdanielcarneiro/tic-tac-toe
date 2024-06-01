import { useState } from "react";

function Square({ value, onSquareClick, winner }) {
  return (
    <button
      className={`square ${winner ? "winner" : ""}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (
      squares.list[a].value &&
      squares.list[a].value === squares.list[b].value &&
      squares.list[a].value === squares.list[c].value
    ) {
      return { winner: squares.list[a].value, lines: lines[i] };
    }
  }
  return null;
}

function Board({ xIsNext, squares, onPlay, currentMove }) {
  const columnsNumber = 3;
  const rowsNumber = 3;
  const boardSquares = [];

  for (let row = 0; row < rowsNumber; row++) {
    for (let column = 0; column < columnsNumber; column++) {
      boardSquares.push(
        <Square
          key={row * columnsNumber + column}
          value={squares.list[row * columnsNumber + column].value}
          onSquareClick={() =>
            handleClick(row * columnsNumber + column, {
              row: row,
              column: column,
            })
          }
          winner={calculateWinner(squares)?.lines.includes(
            row * columnsNumber + column
          )}
        />
      );
    }
  }

  const winner = calculateWinner(squares)?.winner;
  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (currentMove.number < 9) {
    status = `Next player: ${xIsNext ? "X" : "O"}`;
  } else {
    status = `It's a DRAW!`;
  }

  function handleClick(position, positionColRow) {
    if (squares.list[position].value || calculateWinner(squares)?.winner)
      return;
    const nextSquares = {
      ...squares,
      list: squares.list.map((square, index) =>
        index === position
          ? { value: xIsNext ? "X" : "O", position: positionColRow }
          : square
      ),
      lastClickedSquareNumber: position,
    };

    onPlay(nextSquares, positionColRow);
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="grid">{boardSquares}</div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([
    {
      list: Array(9)
        .fill(null)
        .map(() => ({
          value: null,
          position: { col: null, row: null },
        })),
      lastClickedSquareNumber: null,
    },
  ]);
  const [currentMove, setcurrentMove] = useState({
    number: 0,
    col: null,
    row: null,
  });
  const [movesAreDescending, setMovesAreDescending] = useState(false);

  const xIsNext = currentMove.number % 2 === 0;
  const currentSquares = history[currentMove.number];

  const moves = history.map((historySquares, move) => {
    const column =
      historySquares?.list[historySquares.lastClickedSquareNumber]?.position
        .column + 1;
    const row =
      historySquares?.list[historySquares.lastClickedSquareNumber]?.position
        .row + 1;
    let goToMoveString;
    let positionString;
    if (move > 0) {
      goToMoveString = `Go to move # ${move} `;
      positionString = `Coluna: ${column} / Linha: ${row}`;
    } else {
      goToMoveString = "Go to game start";
    }
    return (
      <li key={move}>
        <button
          onClick={() =>
            jumpTo(move, {
              col: null,
              row: null,
            })
          }
        >
          {goToMoveString}
          {positionString}
        </button>
      </li>
    );
  });

  function handlePlay(nextSquares, positionColRow) {
    const nextHistory = [
      ...history.slice(0, currentMove.number + 1),
      nextSquares,
    ];
    setHistory(nextHistory);
    setcurrentMove({
      number: nextHistory.length - 1,
      col: positionColRow.column,
      row: positionColRow.row,
    });
  }

  function jumpTo(nextMove, positionColRow) {
    setcurrentMove({
      number: nextMove,
      col: positionColRow.col,
      row: positionColRow.row,
    });
  }

  function sortMoves() {
    setMovesAreDescending(!movesAreDescending);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          currentMove={currentMove}
        />
      </div>
      <div className="game-info">
        <ol>{movesAreDescending ? moves.reverse() : moves}</ol>
      </div>
      <div className="game-info">
        <button onClick={sortMoves}>Sort</button>
      </div>
    </div>
  );
}
