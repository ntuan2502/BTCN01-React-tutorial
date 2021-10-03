import React, { useState } from "react";
import Board from "./Board";
import { calculateWinner } from "../lib/func";
import { minSize, maxSize } from "../config.json";

export default function Game() {
  const [inputWidth, setInputWidth] = useState(minSize);
  const [inputHeight, setInputHeight] = useState(minSize);
  const [width, setWidth] = useState(minSize);
  const [height, setHeight] = useState(minSize);
  let tmpArr = Array(minSize);
  for (let i = 0; i < minSize; i++) {
    tmpArr[i] = Array(minSize).fill(null);
  }
  const [history, setHistory] = useState([
    {
      squares: tmpArr,
      location: null,
    },
  ]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);
  const [isDescending, setIsDescending] = useState(true);

  function rewriteBoard(tmpArr) {
    setHistory([
      {
        squares: tmpArr,
        location: null,
      },
    ]);
    setStepNumber(0);
    setXIsNext(true);
  }
  function jumpTo(step) {
    setStepNumber(step);
    setXIsNext(step % 2 === 0);
  }
  function handleClick(i, j) {
    const current_history = history.slice(0, stepNumber + 1);
    const current = current_history[stepNumber];
    const squares = current.squares.slice();
    current.squares.map((row, idx) => {
      squares[idx] = current.squares[idx].slice();
      return true;
    });
    if (calculateWinner(squares) || squares[i][j]) {
      return;
    }
    squares[i][j] = xIsNext ? "X" : "O";
    setHistory(
      current_history.concat([
        {
          squares: squares,
          location: { x: i, y: j },
        },
      ])
    );
    setStepNumber(current_history.length);
    setXIsNext(!xIsNext);
  }
  function sort() {
    setIsDescending(!isDescending);
  }
  function handleChangeWidth(e) {
    const val = Number(e.target.value);
    setInputWidth(val);
    if (val >= minSize && val <= maxSize) {
      let tmpArr = Array(height);
      for (let i = 0; i < height; i++) {
        tmpArr[i] = Array(val).fill(null);
      }
      setWidth(Number(val));
      rewriteBoard(tmpArr);
    }
  }
  function handleChangeHeight(e) {
    const val = Number(e.target.value);
    setInputHeight(val);
    if (val >= minSize && val <= maxSize) {
      let tmpArr = Array(val);
      for (let i = 0; i < val; i++) {
        tmpArr[i] = Array(width).fill(null);
      }
      setHeight(Number(val));
      rewriteBoard(tmpArr);
    }
  }

  const current = history[stepNumber];
  const winner = calculateWinner(current.squares);

  let moves = history.map((step, move) => {
    const desc = move
      ? "Go to move #" +
        move +
        " (" +
        step.location.x +
        "," +
        step.location.y +
        ")"
      : "Go to game start";
    return stepNumber === move ? (
      <li key={move}>
        <button className="btn-bold" onClick={() => jumpTo(move)}>
          {desc}
        </button>
      </li>
    ) : (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  });
  if (!isDescending) {
    moves = moves.reverse();
  }

  let status;
  if (winner) {
    status = "Winner: " + winner.val;
  } else {
    if (moves.length === inputWidth * inputHeight + 1) status = "Draw";
    else status = "Next player: " + (xIsNext ? "X" : "O");
  }

  let arrow = isDescending ? "ASC" : "DESC";
  return (
    <div className="content">
      <div className="game-config">
        <span className="fixed-size">Width:</span>
        <input
          type="number"
          placeholder="Width"
          value={inputWidth}
          onChange={(e) => handleChangeWidth(e)}
          min={minSize}
          max={maxSize}
        />
        <br />
        <span className="fixed-size">Height:</span>
        <input
          type="number"
          placeholder="Height"
          value={inputHeight}
          onChange={(e) => handleChangeHeight(e)}
          min={minSize}
          max={maxSize}
        />
      </div>
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i, j) => handleClick(i, j)}
            winner={winner}
          />
        </div>
        <div className="game-info">
          <div>
            <button onClick={() => sort()}>Step: {arrow}</button>
          </div>
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    </div>
  );
}
