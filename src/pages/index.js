import { useState } from "react";

const validateSudoku = (grid) => {
  const hasDuplicates = (nums) => {
    const seen = new Set();
    for (const num of nums) {
      if (num !== "" && seen.has(num)) return true;
      seen.add(num);
    }
    return false;
  };

  for (let i = 0; i < 9; i++) {
    const row = grid[i]; 
    const column = grid.map((row) => row[i]); 
    if (hasDuplicates(row) || hasDuplicates(column)) return false;
  }

  for (let startRow = 0; startRow < 9; startRow += 3) {
    for (let startCol = 0; startCol < 9; startCol += 3) {
      const subGrid = [];
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          subGrid.push(grid[startRow + row][startCol + col]);
        }
      }
      if (hasDuplicates(subGrid)) return false;
    }
  }
  return true; 
};

const solveSudoku = (grid) => {
  const isSafe = (num, row, col) => {
    for (let i = 0; i < 9; i++) {
      if (grid[row][i] === num || grid[i][col] === num) return false;
      const subGridRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
      const subGridCol = 3 * Math.floor(col / 3) + (i % 3);
      if (grid[subGridRow][subGridCol] === num) return false;
    }
    return true; 
  };

  const solve = () => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === "") {
          for (let num = 1; num <= 9; num++) {
            if (isSafe(num.toString(), row, col)) {
              grid[row][col] = num.toString(); 
              if (solve()) return true; 
              grid[row][col] = ""; 
            }
          }
          return false; 
        }
      }
    }
    return true; 
  };

  if (solve()) return grid;
  return null; 
};

export default function SudokuSolver() {
  const [grid, setGrid] = useState(Array(9).fill().map(() => Array(9).fill(""))); 
  const [error, setError] = useState("");

  const handleInputChange = (value, row, col) => {
    const updatedGrid = grid.map((r, i) => (i === row ? [...r] : r));
    updatedGrid[row][col] = value; 
    setGrid(updatedGrid);
  };

  const handleValidate = () => {
    if (validateSudoku(grid)) {
      setError("Valid Sudoku!");
    } else {
      setError("Invalid Sudoku configuration!");
    }
  };

  const handleSolve = () => {
    if (!validateSudoku(grid)) {
      setError("Invalid Sudoku configuration!");
      return;
    }
    const solvedGrid = solveSudoku(grid.map((row) => [...row]));
    if (solvedGrid) {
      setGrid(solvedGrid);
      setError("Sudoku Solved!");
    } else {
      setError("No solution exists!");
    }
  };
  return (
    <div className="sudoku-container">
      <h1>Sudoku Solver</h1>
      <div className="sudoku-grid">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <input
              key={`${rowIndex}-${colIndex}`}
              type="text"
              value={cell}
              maxLength="1"
              onChange={(e) => handleInputChange(e.target.value.replace(/[^1-9]/, ""), rowIndex, colIndex)}
              className="sudoku-input"
            />
          ))
        )}
      </div>
      <div className="button-container">
        <button onClick={handleValidate} className="button">
          Validate
        </button>
        <button onClick={handleSolve} className="button">
          Solve
        </button>
      </div>
      {error && <p className={error.includes("Invalid") ? "error-message" : "success-message"}>{error}</p>}
    </div>
  );
}
