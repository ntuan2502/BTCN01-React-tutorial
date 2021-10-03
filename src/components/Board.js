import React from "react";
import SquareRow from "./SquareRow";

export default function Board({ squares, winner, onClick }) {
  let board;
  board = squares.map((row, idx) => {
    let k = "r" + idx;
    return (
      <SquareRow
        winner={winner}
        rowIdx={idx}
        row={row}
        onClick={onClick}
        key={k}
      />
    );
  });
  return <div>{board}</div>;
}
