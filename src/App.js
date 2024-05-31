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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], lines: lines[i] };
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
          value={squares[row * columnsNumber + column]}
          onSquareClick={() => handleClick(row * columnsNumber + column)}
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
  } else if (currentMove < 9) {
    status = `Next player: ${xIsNext ? "X" : "O"}`;
  } else {
    status = `It's a DRAW!`;
  }

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)?.winner) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="grid">{boardSquares}</div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setcurrentMove] = useState(0);
  const [movesAreDescending, setMovesAreDescending] = useState(false);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setcurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setcurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

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
